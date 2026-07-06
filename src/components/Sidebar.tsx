import Link from "next/link";
import { AGENTS, DRWINTECH } from "@/lib/constants";

export default function Sidebar() {
  return (
    <aside
      style={{ background: DRWINTECH.navy, color: DRWINTECH.ivoire }}
      className="w-64 min-h-screen p-6 flex flex-col gap-6"
    >
      <Link href="/" className="block">
        <div style={{ letterSpacing: 3, fontWeight: 900, fontSize: 20 }}>
          DRWINTECH
        </div>
        <div style={{ color: DRWINTECH.or, fontSize: 12, letterSpacing: 1 }}>
          MULTI-AGENT PLATFORM
        </div>
      </Link>

      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/" className="py-2 px-3 rounded hover:bg-white/10">
          Vue d'ensemble
        </Link>
        <div style={{ color: DRWINTECH.or }} className="mt-4 mb-1 text-xs uppercase tracking-wider">
          Agents métier
        </div>
        {AGENTS.map((a) => (
          <Link
            key={a.key}
            href={`/agents/${a.key}`}
            className="py-2 px-3 rounded hover:bg-white/10"
          >
            {a.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto text-xs opacity-60">
        Backend : localhost:8000
      </div>
    </aside>
  );
}
