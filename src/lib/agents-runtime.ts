import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { AGENT_FOLDERS, type Agent } from "./livrables";
import { RUNNABLE_AGENT_KEYS, AGENT_CONFIG } from "./constants";

// Racine de la plateforme = dossier parent du front (Projet-Indiana).
const ROOT = path.resolve(process.cwd(), "..");
const AGENTS_DIR = path.join(ROOT, ".claude", "agents");
const CLIENTS_DIR = path.join(ROOT, "clients");

// Agents pilotables depuis le dashboard (source unique dans constants.ts).
export const RUNNABLE_AGENTS: Agent[] = [...RUNNABLE_AGENT_KEYS] as Agent[];

// Mappe le champ `model` du frontmatter agent vers un ID de modèle Claude.
function resolveModel(model: unknown): string {
  if (model === "sonnet") return "claude-sonnet-5";
  return "claude-opus-4-8"; // opus par défaut
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readIfExists(p: string): string | null {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
}

// Dernier brief produit pour un client (le Créateur et le Présentateur en ont besoin).
function latestBrief(client: string): string | null {
  const dir = path.join(ROOT, "briefs");
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f.includes(`-${client}-`))
    .sort()
    .reverse();
  return files[0] ? fs.readFileSync(path.join(dir, files[0]), "utf-8") : null;
}

export interface RunInput {
  agent: Agent;
  client: string;
  campagne: string;
  contexte?: string;
  format?: string; // pour le Créateur
  input?: string; // document d'entrée pour les agents data
}

export interface RunResult {
  id: string;
  path: string;
  file: string;
}

export async function runAgent(input: RunInput): Promise<RunResult> {
  const { agent, client, campagne, contexte, format, input: sourceDoc } = input;
  const cfg = AGENT_CONFIG[agent] ?? {};

  if (!RUNNABLE_AGENTS.includes(agent)) {
    throw new Error(`Agent non pilotable depuis le dashboard : ${agent}`);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY manquante. Crée un fichier Indiana-front/.env.local avec ANTHROPIC_API_KEY=sk-ant-…",
    );
  }
  if (cfg.needsInput && !sourceDoc?.trim()) {
    throw new Error("Cet agent a besoin d'un document d'entrée (colle-le ou charge un fichier).");
  }

  // 1. System prompt = corps du fichier .claude/agents/{agent}.md
  const agentFile = path.join(AGENTS_DIR, `${agent}.md`);
  const raw = readIfExists(agentFile);
  if (!raw) throw new Error(`Définition d'agent introuvable : ${agent}.md`);
  const { data: agentMeta, content: systemBody } = matter(raw);

  // 2. Contexte injecté : mémoire client
  const contextParts: string[] = [];
  const brand = readIfExists(path.join(CLIENTS_DIR, client, "brand.md"));
  if (cfg.needsClientMemory && !brand) {
    throw new Error(
      `Mémoire de marque absente pour « ${client} » (clients/${client}/brand.md). Remplis-la avant de produire.`,
    );
  }
  if (brand) {
    contextParts.push(`# clients/${client}/brand.md\n\n${brand}`);
    const icp = readIfExists(path.join(CLIENTS_DIR, client, "icp.md"));
    const historique = readIfExists(path.join(CLIENTS_DIR, client, "historique.md"));
    if (icp) contextParts.push(`# clients/${client}/icp.md\n\n${icp}`);
    if (historique) contextParts.push(`# clients/${client}/historique.md\n\n${historique}`);
  }

  if (agent === "createur" || agent === "presentateur") {
    const brief = latestBrief(client);
    if (brief) contextParts.push(`# Brief de référence (le plus récent)\n\n${brief}`);
  }

  // Document d'entrée fourni (agents data)
  if (sourceDoc?.trim()) {
    contextParts.push(`# Document d'entrée à traiter\n\n${sourceDoc.trim()}`);
  }

  // 3. Contrat de sortie pour ce contexte API (pas d'outils Write ici)
  const today = new Date().toISOString().slice(0, 10);
  const system = `${systemBody.trim()}

---
# Contexte d'exécution (dashboard)
Tu es appelé via une API. Tu N'AS PAS accès aux outils de lecture/écriture de fichiers.
Toute la mémoire client nécessaire t'est fournie ci-dessous dans le message utilisateur.
Réponds UNIQUEMENT avec le contenu Markdown final du livrable, frontmatter YAML compris.
N'ajoute aucun texte avant le frontmatter, aucun commentaire méta, aucune explication.
La date du jour est ${today}.`;

  const userPrompt = `Produis ton livrable pour le client **${client}**, campagne **${campagne}**${
    format ? `, format **${format}**` : ""
  }.
${contexte ? `\nContexte / objectif fourni par l'utilisateur :\n${contexte}\n` : ""}
Frontmatter YAML obligatoire en tête, avec au minimum :
client: ${client} / campagne: ${slugify(campagne)} / agent: ${agent} / date: ${today} / version: 1 / statut: draft / framework: (le framework nommé que tu utilises)${
    format ? ` / format: ${format}` : ""
  }
${
  cfg.needsInput
    ? "\nTraite le « Document d'entrée à traiter » ci-dessous. N'invente aucune donnée absente de ce document.\n"
    : ""
}
${contextParts.length ? `Mémoire et références :\n\n${contextParts.join("\n\n---\n\n")}` : ""}`;

  const anthropic = new Anthropic();
  const response = await anthropic.messages.create({
    model: resolveModel(agentMeta.model),
    max_tokens: 16000,
    system,
    messages: [{ role: "user", content: userPrompt }],
  });

  let text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // Le modèle entoure parfois sa réponse d'un bloc ```markdown … ``` : on le retire.
  const fence = text.match(/^```[a-zA-Z]*\s*\n([\s\S]*?)\n```$/);
  if (fence) text = fence[1].trim();

  // Filet de sécurité : si le modèle n'a pas mis de frontmatter, on le préfixe.
  if (!text.startsWith("---")) {
    const fm = [
      "---",
      `client: ${client}`,
      `campagne: ${slugify(campagne)}`,
      `agent: ${agent}`,
      `date: ${today}`,
      "version: 1",
      "statut: draft",
      ...(format ? [`format: ${format}`] : []),
      "---",
      "",
    ].join("\n");
    text = fm + text;
  }

  // 4. Écriture dans le dossier de l'agent
  const folder = AGENT_FOLDERS[agent];
  const dir = path.join(ROOT, folder);
  fs.mkdirSync(dir, { recursive: true });
  const base = `${today}-${client}-${slugify(campagne)}${format ? `-${slugify(format)}` : ""}`;
  const fileName = `${base}.md`;
  const fullPath = path.join(dir, fileName);
  fs.writeFileSync(fullPath, text, "utf-8");

  // id cohérent avec getLivrables (folder__basename, URL-safe)
  const id = `${folder}__${base}`;
  return { id, path: fullPath, file: fileName };
}
