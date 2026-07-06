// Palette Drwintech — source unique de vérité pour les couleurs de marque.
export const DRWINTECH = {
  navy: "#0A1F44",
  or: "#D97706",
  cyan: "#0891B2",
  ivoire: "#FEFBF3",
  gris: "#475569",
} as const;

export const AGENTS = [
  { key: "strategiste", label: "Stratège", folder: "briefs", color: DRWINTECH.navy },
  { key: "createur", label: "Créateur", folder: "content", color: DRWINTECH.cyan },
  { key: "designer", label: "Designer", folder: "prompts-images", color: DRWINTECH.or },
  { key: "analyste", label: "Analyste", folder: "analytics", color: DRWINTECH.navy },
  { key: "presentateur", label: "Présentateur", folder: "decks", color: DRWINTECH.cyan },
] as const;

export const CLIENTS = [
  "drwintech", "cnad", "staybj", "ceremo",
  "alogo", "afri-members", "whatsapp-crm", "rnb",
] as const;
