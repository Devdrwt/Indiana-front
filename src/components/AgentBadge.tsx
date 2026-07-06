import { AGENTS } from "@/lib/constants";
import type { Agent } from "@/lib/livrables";

export default function AgentBadge({ agent }: { agent: Agent }) {
  const a = AGENTS.find((x) => x.key === agent);
  const color = a?.color ?? "#475569";
  return (
    <span
      style={{ background: color, color: "#fff" }}
      className="text-xs px-2 py-0.5 rounded-full font-medium"
    >
      {a?.label ?? agent}
    </span>
  );
}
