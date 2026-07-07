import { NextResponse } from "next/server";
import { runAgent, RUNNABLE_AGENTS } from "@/lib/agents-runtime";
import type { Agent } from "@/lib/livrables";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // la génération peut prendre du temps

export async function POST(req: Request) {
  let body: {
    agent?: Agent;
    client?: string;
    campagne?: string;
    contexte?: string;
    format?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const { agent, client, campagne, contexte, format } = body;

  if (!agent || !RUNNABLE_AGENTS.includes(agent)) {
    return NextResponse.json(
      { error: `Agent invalide ou non pilotable. Choisis parmi : ${RUNNABLE_AGENTS.join(", ")}` },
      { status: 400 },
    );
  }
  if (!client || !campagne) {
    return NextResponse.json({ error: "client et campagne sont requis." }, { status: 400 });
  }

  try {
    const result = await runAgent({ agent, client, campagne, contexte, format });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
