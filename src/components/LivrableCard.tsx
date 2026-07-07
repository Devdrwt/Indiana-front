import Link from "next/link";
import type { Livrable } from "@/lib/livrables";
import AgentBadge from "./AgentBadge";

const STATUT_COLORS: Record<string, string> = {
  draft: "#f0a94b",
  validated: "#22c55e",
  archived: "#64748b",
};

export default function LivrableCard({ livrable }: { livrable: Livrable }) {
  const statutColor = STATUT_COLORS[livrable.statut] ?? "#f0a94b";
  return (
    <Link href={`/livrables/${livrable.id}`} className="glass card-hover p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <AgentBadge agent={livrable.agent} />
        <span
          className="text-[11px] px-2 py-0.5 rounded-full border"
          style={{ color: statutColor, borderColor: statutColor + "55", background: statutColor + "18" }}
        >
          {livrable.statut}
        </span>
      </div>

      <h3 className="font-semibold text-[15px] leading-snug text-white">
        {livrable.campagne || livrable.id}
      </h3>

      <div className="text-[12px] flex gap-2 flex-wrap mt-auto" style={{ color: "var(--muted)" }}>
        <span className="text-white/80">{livrable.client}</span>
        <span>·</span>
        <span>{livrable.date}</span>
        {livrable.framework && (<><span>·</span><span>{livrable.framework}</span></>)}
        {livrable.format && (<><span>·</span><span>{livrable.format}</span></>)}
      </div>
    </Link>
  );
}
