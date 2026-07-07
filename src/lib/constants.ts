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

// Configuration par agent pour le formulaire « Nouvelle production ».
// - needsClientMemory : le brand.md du client est obligatoire (agents marketing/doc)
// - needsInput        : un document d'entrée est requis (agents data)
// - hasFormat         : propose un choix de format (Créateur)
export interface AgentFormConfig {
  needsClientMemory?: boolean;
  needsInput?: boolean;
  hasFormat?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
}

export const AGENT_CONFIG: Record<string, AgentFormConfig> = {
  // Agents à partir de la mémoire client
  strategiste: { needsClientMemory: true },
  createur: { needsClientMemory: true, hasFormat: true },
  designer: { needsClientMemory: true },
  presentateur: { needsClientMemory: true },
  institutionnel: { needsClientMemory: true },
  "cahier-des-charges": { needsClientMemory: true },
  // Agents à partir d'un document d'entrée
  analyste: {
    needsInput: true,
    inputLabel: "Exports analytics",
    inputPlaceholder: "Colle ici l'export (CSV, tableau de métriques…) + une baseline si possible.",
  },
  fireflies: {
    needsInput: true,
    inputLabel: "Transcription du call",
    inputPlaceholder: "Colle ici la transcription (participants, échanges…).",
  },
  cv: {
    needsInput: true,
    inputLabel: "Fiche de poste + CV(s)",
    inputPlaceholder: "Colle la fiche de poste puis les CV à évaluer.",
  },
  "appel-offres": {
    needsInput: true,
    inputLabel: "Document de l'appel d'offres",
    inputPlaceholder: "Colle l'appel à candidatures / cahier des charges de l'organisme.",
  },
  gmail: {
    needsInput: true,
    inputLabel: "Export de la boîte de réception",
    inputPlaceholder: "Colle la liste des emails (expéditeur, objet, corps) à trier.",
  },
};

// Tous les agents pilotables depuis le formulaire.
export const RUNNABLE_AGENT_KEYS = Object.keys(AGENT_CONFIG) as readonly string[];
