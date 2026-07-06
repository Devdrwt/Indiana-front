"use client";

import { useState } from "react";
import { DRWINTECH } from "@/lib/constants";

export default function DeckActions({ livrableId }: { livrableId: string }) {
  const [loading, setLoading] = useState(false);

  async function downloadPdf() {
    setLoading(true);
    try {
      const res = await fetch("/api/presentations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ livrableId }),
      });
      if (!res.ok) {
        alert("Échec de la génération PDF : " + (await res.text()));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${livrableId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={downloadPdf}
      disabled={loading}
      style={{ background: DRWINTECH.or }}
      className="text-white text-sm px-4 py-2 rounded font-medium disabled:opacity-50"
    >
      {loading ? "Génération…" : "Télécharger le PDF"}
    </button>
  );
}
