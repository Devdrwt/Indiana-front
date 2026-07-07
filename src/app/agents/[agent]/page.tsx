import { notFound } from "next/navigation";
import { getLivrables, type Agent } from "@/lib/livrables";
import { AGENTS } from "@/lib/constants";
import LivrableCard from "@/components/LivrableCard";

export const dynamic = "force-dynamic";

const VALID = AGENTS.map((a) => a.key) as readonly string[];

export default async function AgentPage({
  params,
}: {
  params: Promise<{ agent: string }>;
}) {
  const { agent } = await params;
  if (!VALID.includes(agent)) notFound();

  const meta = AGENTS.find((a) => a.key === agent)!;
  const livrables = getLivrables(agent as Agent);

  return (
    <div className="flex flex-col gap-8">
      <header className="glass-strong accent-top p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="dot" style={{ color: meta.color, background: meta.color }} />
          <span className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>
            Agent {meta.group}
          </span>
        </div>
        <h1 className="text-4xl font-black text-white">{meta.label}</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Dossier <code className="text-white/90">{meta.folder}/</code> · {livrables.length} livrable(s)
        </p>
      </header>

      {livrables.length === 0 ? (
        <div className="glass p-8 text-center" style={{ color: "var(--muted)" }}>
          Aucun livrable produit par cet agent pour l'instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {livrables.map((l) => (
            <LivrableCard key={l.id} livrable={l} />
          ))}
        </div>
      )}
    </div>
  );
}
