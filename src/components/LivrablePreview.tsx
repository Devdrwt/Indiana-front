import type { Livrable } from "@/lib/livrables";
import { markdownToHtml } from "@/lib/markdown";
import { DRWINTECH } from "@/lib/constants";
import DeckActions from "./DeckActions";

export default function LivrablePreview({ livrable }: { livrable: Livrable }) {
  const html = markdownToHtml(livrable.content);
  const isDeck = livrable.agent === "presentateur";

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 style={{ color: DRWINTECH.navy }} className="text-2xl font-bold">
            {livrable.campagne || livrable.id}
          </h1>
          <p className="text-sm text-slate-500">
            {livrable.client} · {livrable.agent} · {livrable.date}
            {livrable.framework ? ` · ${livrable.framework}` : ""}
          </p>
        </div>
        {isDeck && <DeckActions livrableId={livrable.id} />}
      </div>

      <article
        className="prose-drwintech"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
