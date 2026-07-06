import Link from "next/link";
import { getLivrables, countByAgent } from "@/lib/livrables";
import { AGENTS, DRWINTECH } from "@/lib/constants";
import LivrableCard from "@/components/LivrableCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const livrables = getLivrables();
  const counts = countByAgent();
  const recent = livrables.slice(0, 6);

  return (
    <div>
      <h1 style={{ color: DRWINTECH.navy }} className="text-3xl font-bold mb-1">
        Vue d'ensemble
      </h1>
      <p className="text-slate-500 mb-8">
        {livrables.length} livrable(s) produits par la chaîne d'agents.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {AGENTS.map((a) => (
          <Link
            key={a.key}
            href={`/agents/${a.key}`}
            className="border rounded-lg p-4 bg-white hover:shadow-md transition"
            style={{ borderColor: "#e2e8f0" }}
          >
            <div style={{ color: a.color }} className="text-3xl font-bold">
              {counts[a.key] ?? 0}
            </div>
            <div className="text-sm text-slate-600">{a.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ color: DRWINTECH.navy }} className="text-xl font-semibold mb-4">
        Livrables récents
      </h2>
      {recent.length === 0 ? (
        <p className="text-slate-500">
          Aucun livrable pour l'instant. Lance un agent depuis Claude Code
          (ex : <code>/brief drwintech corporate-2026</code>) pour en produire.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recent.map((l) => (
            <LivrableCard key={l.id} livrable={l} />
          ))}
        </div>
      )}
    </div>
  );
}
