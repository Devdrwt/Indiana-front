// Palette Drwintech — source unique de vérité pour les couleurs de marque.
export const DRWINTECH = {
  navy: "#0A1F44",
  or: "#D97706",
  cyan: "#0891B2",
  ivoire: "#FEFBF3",
  gris: "#475569",
} as const;

export type AgentGroup = "Métier" | "Support" | "Drwintech";

export const AGENTS = [
  // Agents métier
  { key: "strategiste", label: "Stratège", folder: "briefs", color: DRWINTECH.navy, group: "Métier" },
  { key: "createur", label: "Créateur", folder: "content", color: DRWINTECH.cyan, group: "Métier" },
  { key: "designer", label: "Designer", folder: "prompts-images", color: DRWINTECH.or, group: "Métier" },
  { key: "analyste", label: "Analyste", folder: "analytics", color: DRWINTECH.navy, group: "Métier" },
  { key: "presentateur", label: "Présentateur", folder: "decks", color: DRWINTECH.cyan, group: "Métier" },
  // Agents support
  { key: "gmail", label: "Gmail", folder: "gmail", color: DRWINTECH.gris, group: "Support" },
  { key: "fireflies", label: "Fireflies", folder: "meetings", color: DRWINTECH.gris, group: "Support" },
  { key: "cv", label: "Recrutement", folder: "hiring", color: DRWINTECH.gris, group: "Support" },
  // Agents spécifiques Drwintech
  { key: "institutionnel", label: "Institutionnel", folder: "institutionnel", color: DRWINTECH.or, group: "Drwintech" },
  { key: "cahier-des-charges", label: "Cahier des charges", folder: "cahiers-charges", color: DRWINTECH.navy, group: "Drwintech" },
  { key: "appel-offres", label: "Appel d'offres", folder: "appels-offres", color: DRWINTECH.cyan, group: "Drwintech" },
] as const;

export const CLIENTS = [
  "drwintech", "cnad", "staybj", "ceremo",
  "alogo", "afri-members", "whatsapp-crm", "rnb",
] as const;

// Agents pilotables depuis le formulaire « Nouvelle production » (ceux qui
// produisent à partir de la mémoire client). Les agents data-dépendants
// (analyste, gmail, fireflies, cv, appel-offres) ont besoin de fichiers
// d'entrée et ne sont pas exposés dans le formulaire.
export const RUNNABLE_AGENT_KEYS = [
  "strategiste",
  "createur",
  "designer",
  "presentateur",
  "institutionnel",
  "cahier-des-charges",
] as const;
