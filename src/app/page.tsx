import Link from "next/link";
import { getLivrables, countByAgent } from "@/lib/livrables";
import { AGENTS, DRWINTECH } from "@/lib/constants";
import LivrableCard from "@/components/LivrableCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const livrables = getLivrables();
  const counts = countByAgent();
  const recent = livrables.slice(0, 6);

  const clients = new Set(livrables.map((l) => l.client).filter((c) => c && c !== "?"));
  const activeAgents = AGENTS.filter((a) => (counts[a.key] ?? 0) > 0).length;

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <header className="glass-strong accent-top p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: DRWINTECH.or }}>
          Orchestration multi-agent
        </p>
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-gradient">
          Vue d'ensemble
        </h1>
        <p className="mt-3 max-w-2xl" style={{ color: "var(--muted)" }}>
          {livrables.length} livrable(s) produits par la chaîne d'agents Drwintech,
          couvrant {clients.size} client(s). Chaque agent lit la mémoire de marque
          avant de produire.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Stat label="Livrables" value={livrables.length} />
          <Stat label="Agents actifs" value={`${activeAgents}/${AGENTS.length}`} />
          <Stat label="Clients" value={clients.size} />
        </div>
      </header>

      {/* Compteurs par agent */}
      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] mb-4" style={{ color: "var(--muted)" }}>
          Production par agent
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {AGENTS.map((a) => {
            const n = counts[a.key] ?? 0;
            return (
              <Link
                key={a.key}
                href={`/agents/${a.key}`}
                className="glass card-hover p-4 flex flex-col gap-2"
              >
                <span className="dot" style={{ color: a.color, background: a.color }} />
                <span className="text-3xl font-black" style={{ color: n > 0 ? "#fff" : "var(--muted)" }}>
                  {n}
                </span>
                <span className="text-[13px]" style={{ color: "var(--muted)" }}>
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Livrables récents */}
      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] mb-4" style={{ color: "var(--muted)" }}>
          Livrables récents
        </h2>
        {recent.length === 0 ? (
          <div className="glass p-8 text-center" style={{ color: "var(--muted)" }}>
            Aucun livrable pour l'instant. Lance un agent depuis Claude Code
            (ex : <code className="text-white">/brief drwintech corporate-2026</code>).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((l) => (
              <LivrableCard key={l.id} livrable={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass px-5 py-3">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}
