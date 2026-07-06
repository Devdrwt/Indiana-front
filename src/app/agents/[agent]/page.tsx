import { notFound } from "next/navigation";
import { getLivrables, type Agent } from "@/lib/livrables";
import { AGENTS, DRWINTECH } from "@/lib/constants";
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
    <div>
      <h1 style={{ color: DRWINTECH.navy }} className="text-3xl font-bold mb-1">
        {meta.label}
      </h1>
      <p className="text-slate-500 mb-8">
        Dossier <code>{meta.folder}/</code> · {livrables.length} livrable(s)
      </p>

      {livrables.length === 0 ? (
        <p className="text-slate-500">Aucun livrable produit par cet agent.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {livrables.map((l) => (
            <LivrableCard key={l.id} livrable={l} />
          ))}
        </div>
      )}
    </div>
  );
}
