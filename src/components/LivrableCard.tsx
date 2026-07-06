import Link from "next/link";
import type { Livrable } from "@/lib/livrables";
import AgentBadge from "./AgentBadge";
import { DRWINTECH } from "@/lib/constants";

const STATUT_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  validated: "#16a34a",
  archived: "#cbd5e1",
};

export default function LivrableCard({ livrable }: { livrable: Livrable }) {
  return (
    <Link
      href={`/livrables/${livrable.id}`}
      className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
      style={{ borderColor: "#e2e8f0" }}
    >
      <div className="flex items-center justify-between mb-2">
        <AgentBadge agent={livrable.agent} />
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ background: STATUT_COLORS[livrable.statut] ?? "#94a3b8", color: "#fff" }}
        >
          {livrable.statut}
        </span>
      </div>
      <h3 style={{ color: DRWINTECH.navy }} className="font-semibold text-sm mb-1">
        {livrable.campagne || livrable.id}
      </h3>
      <div className="text-xs text-slate-500 flex gap-2 flex-wrap">
        <span>{livrable.client}</span>
        <span>·</span>
        <span>{livrable.date}</span>
        {livrable.framework && (<><span>·</span><span>{livrable.framework}</span></>)}
        {livrable.format && (<><span>·</span><span>{livrable.format}</span></>)}
      </div>
    </Link>
  );
}
