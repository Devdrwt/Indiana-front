import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Agent =
  // Métier
  | "strategiste"
  | "createur"
  | "designer"
  | "analyste"
  | "presentateur"
  // Support
  | "gmail"
  | "fireflies"
  | "cv"
  // Spécifiques Drwintech
  | "institutionnel"
  | "cahier-des-charges"
  | "appel-offres";

export type Statut = "draft" | "validated" | "archived";

export interface Livrable {
  id: string;
  path: string;
  client: string;
  campagne: string;
  agent: Agent;
  date: string;
  version: number;
  statut: Statut;
  framework?: string;
  format?: string;
  content: string;
}

const AGENT_FOLDERS: Record<Agent, string> = {
  // Métier
  strategiste: "briefs",
  createur: "content",
  designer: "prompts-images",
  analyste: "analytics",
  presentateur: "decks",
  // Support
  gmail: "gmail",
  fireflies: "meetings",
  cv: "hiring",
  // Spécifiques Drwintech
  institutionnel: "institutionnel",
  "cahier-des-charges": "cahiers-charges",
  "appel-offres": "appels-offres",
};

// La racine de la plateforme est le dossier parent du front (Projet-Indiana).
const ROOT = path.resolve(process.cwd(), "..");

// Dossiers/fichiers ignorés lors du scan :
// - tout ce qui commence par `_` = fichier d'entrée (transcript, CV, export…)
// - `exports` = données analytics brutes, pas des livrables
const IGNORED_DIRS = new Set(["exports", "node_modules", ".git"]);

// Parcourt un dossier agent en profondeur et renvoie les .md livrables
// (chemin relatif au dossier agent, séparateur `/`).
function walkMd(baseDir: string, rel = ""): string[] {
  const results: string[] = [];
  const dir = path.join(baseDir, rel);
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue; // fichier/dossier d'entrée
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      results.push(...walkMd(baseDir, relPath));
    } else if (entry.name.endsWith(".md")) {
      results.push(relPath);
    }
  }
  return results;
}

export function getLivrables(agent?: Agent): Livrable[] {
  const folders = agent
    ? [AGENT_FOLDERS[agent]]
    : Object.values(AGENT_FOLDERS);

  const livrables: Livrable[] = [];

  for (const folder of folders) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;

    for (const relPath of walkMd(dir)) {
      const fullPath = path.join(dir, relPath);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      // id unique et URL-safe : dossier agent + sous-chemin, `/` → `__`.
      const idBase = `${folder}/${relPath.replace(/\.md$/, "")}`.replace(/\//g, "__");

      livrables.push({
        id: idBase,
        path: fullPath,
        client: data.client ?? "?",
        campagne: data.campagne ?? "",
        agent: (data.agent ?? agentFromFolder(folder)) as Agent,
        date: String(data.date ?? ""),
        version: data.version || 1,
        statut: (data.statut || "draft") as Statut,
        framework: data.framework,
        format: data.format,
        content,
      });
    }
  }

  return livrables.sort((a, b) => b.date.localeCompare(a.date));
}

function agentFromFolder(folder: string): Agent {
  const entry = (Object.entries(AGENT_FOLDERS) as [Agent, string][])
    .find(([, f]) => f === folder);
  return entry ? entry[0] : "strategiste";
}

export function getLivrableById(id: string): Livrable | null {
  return getLivrables().find((l) => l.id === id) || null;
}

export function countByAgent(): Record<Agent, number> {
  const counts = {
    strategiste: 0, createur: 0, designer: 0, analyste: 0, presentateur: 0,
    gmail: 0, fireflies: 0, cv: 0,
    institutionnel: 0, "cahier-des-charges": 0, "appel-offres": 0,
  } as Record<Agent, number>;
  for (const l of getLivrables()) counts[l.agent] = (counts[l.agent] ?? 0) + 1;
  return counts;
}
