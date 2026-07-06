import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Agent =
  | "strategiste"
  | "createur"
  | "designer"
  | "analyste"
  | "presentateur";

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
  strategiste: "briefs",
  createur: "content",
  designer: "prompts-images",
  analyste: "analytics",
  presentateur: "decks",
};

// La racine de la plateforme est le dossier parent de `dashboard/`.
const ROOT = path.resolve(process.cwd(), "..");

export function getLivrables(agent?: Agent): Livrable[] {
  const folders = agent
    ? [AGENT_FOLDERS[agent]]
    : Object.values(AGENT_FOLDERS);

  const livrables: Livrable[] = [];

  for (const folder of folders) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      livrables.push({
        id: file.replace(".md", ""),
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
  } as Record<Agent, number>;
  for (const l of getLivrables()) counts[l.agent] = (counts[l.agent] ?? 0) + 1;
  return counts;
}
