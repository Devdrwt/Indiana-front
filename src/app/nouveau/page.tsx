"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AGENTS, CLIENTS, RUNNABLE_AGENT_KEYS, DRWINTECH } from "@/lib/constants";

const RUNNABLE = AGENTS.filter((a) =>
  (RUNNABLE_AGENT_KEYS as readonly string[]).includes(a.key),
);

const FORMATS = ["linkedin-long", "linkedin-carrousel", "reels-instagram", "tiktok", "youtube-long", "youtube-short"];

export default function NouvellePage() {
  const router = useRouter();
  const [agent, setAgent] = useState<string>(RUNNABLE[0].key);
  const [client, setClient] = useState<string>(CLIENTS[0]);
  const [campagne, setCampagne] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [contexte, setContexte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = RUNNABLE.find((a) => a.key === agent)!;
  const showFormat = agent === "createur";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!campagne.trim()) {
      setError("Renseigne une campagne.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent,
          client,
          campagne: campagne.trim(),
          contexte: contexte.trim() || undefined,
          format: showFormat ? format : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Échec de la génération.");
        return;
      }
      router.push(`/livrables/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <header className="glass-strong accent-top p-8">
        <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: DRWINTECH.or }}>
          Orchestration
        </p>
        <h1 className="text-4xl font-black text-gradient">Nouvelle production</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Lance un agent directement depuis le dashboard. Le livrable est écrit puis affiché.
        </p>
      </header>

      <form onSubmit={submit} className="glass p-6 flex flex-col gap-5">
        <Field label="Agent">
          <select value={agent} onChange={(e) => setAgent(e.target.value)} className="input">
            {RUNNABLE.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label} · {a.group}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Client">
          <select value={client} onChange={(e) => setClient(e.target.value)} className="input">
            {CLIENTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Campagne">
          <input
            value={campagne}
            onChange={(e) => setCampagne(e.target.value)}
            placeholder="ex : lancement-2026"
            className="input"
          />
        </Field>

        {showFormat && (
          <Field label="Format">
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="input">
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Contexte / objectif (optionnel)">
          <textarea
            value={contexte}
            onChange={(e) => setContexte(e.target.value)}
            rows={4}
            placeholder="ex : générer des demandes de démo auprès des hôtels indépendants…"
            className="input resize-y"
          />
        </Field>

        {error && (
          <div
            className="text-sm px-4 py-3 rounded-lg border"
            style={{ color: "#fca5a5", borderColor: "#ef444455", background: "#ef444418" }}
          >
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            style={{ background: DRWINTECH.or }}
            className="text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {loading ? `${meta.label} au travail…` : `Lancer ${meta.label}`}
          </button>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Modèle Claude · peut prendre 30–90 s
          </span>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
          color: var(--ink);
          font-size: 14px;
          outline: none;
        }
        .input:focus { border-color: rgba(217,118,6,0.5); }
        select.input option { background: #0A1F44; color: #e8eefc; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
