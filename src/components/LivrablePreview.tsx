import type { Livrable } from "@/lib/livrables";
import { markdownToHtml } from "@/lib/markdown";
import AgentBadge from "./AgentBadge";
import DeckActions from "./DeckActions";

export default function LivrablePreview({ livrable }: { livrable: Livrable }) {
  const html = markdownToHtml(livrable.content);
  const isDeck = livrable.agent === "presentateur";

  return (
    <div className="max-w-4xl">
      {/* En-tête méta sur fond sombre */}
      <div className="glass-strong accent-top p-6 mb-5 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <AgentBadge agent={livrable.agent} />
          <h1 className="text-2xl font-black text-white">
            {livrable.campagne || livrable.id}
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {livrable.client} · {livrable.date}
            {livrable.framework ? ` · ${livrable.framework}` : ""}
            {livrable.format ? ` · ${livrable.format}` : ""}
          </p>
        </div>
        {isDeck && <DeckActions livrableId={livrable.id} />}
      </div>

      {/* Contenu markdown sur feuille ivoire pour la lisibilité */}
      <article
        className="prose-drwintech paper p-8 md:p-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
