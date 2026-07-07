"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AGENTS, type AgentGroup } from "@/lib/constants";

const GROUPS: AgentGroup[] = ["Métier", "Support", "Drwintech"];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 sticky top-0 h-screen p-5 flex flex-col gap-6 border-r border-white/10 overflow-y-auto">
      <Link href="/" className="block group">
        <div className="flex items-center gap-2">
          <span className="dot" style={{ color: "#D97706", background: "#D97706" }} />
          <span style={{ letterSpacing: 3, fontWeight: 900, fontSize: 20 }} className="text-gradient">
            DRWINTECH
          </span>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 10.5, letterSpacing: 2 }} className="mt-1 uppercase">
          Multi-Agent Platform
        </div>
      </Link>

      <nav className="flex flex-col gap-1 text-sm">
        <NavItem href="/" label="Vue d'ensemble" active={pathname === "/"} />

        {GROUPS.map((group) => (
          <div key={group} className="mt-4">
            <div className="mb-1 px-3 text-[10.5px] uppercase tracking-[0.15em]" style={{ color: "var(--or)" }}>
              {group}
            </div>
            {AGENTS.filter((a) => a.group === group).map((a) => (
              <NavItem
                key={a.key}
                href={`/agents/${a.key}`}
                label={a.label}
                color={a.color}
                active={pathname === `/agents/${a.key}`}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 text-[11px]" style={{ color: "var(--muted)" }}>
        <div className="flex items-center gap-2">
          <span className="dot" style={{ color: "#22c55e", background: "#22c55e" }} />
          Backend · localhost:8000
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  color,
  active,
}: {
  href: string;
  label: string;
  color?: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 py-2 px-3 rounded-lg transition-colors ${
        active ? "bg-white/10 text-white" : "hover:bg-white/[0.06]"
      }`}
      style={active ? { boxShadow: "inset 2px 0 0 var(--or)" } : undefined}
    >
      {color ? (
        <span
          className="dot transition-transform group-hover:scale-125"
          style={{ color, background: color, opacity: active ? 1 : 0.7 }}
        />
      ) : (
        <span className="w-[9px]" />
      )}
      <span style={{ color: active ? "#fff" : "var(--ink)" }}>{label}</span>
    </Link>
  );
}
