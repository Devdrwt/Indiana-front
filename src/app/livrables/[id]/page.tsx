import Link from "next/link";
import { notFound } from "next/navigation";
import { getLivrableById } from "@/lib/livrables";
import LivrablePreview from "@/components/LivrablePreview";

export const dynamic = "force-dynamic";

export default async function LivrablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const livrable = getLivrableById(decodeURIComponent(id));
  if (!livrable) notFound();

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg glass card-hover"
        style={{ color: "var(--muted)" }}
      >
        ← Retour
      </Link>
      <div className="mt-5">
        <LivrablePreview livrable={livrable} />
      </div>
    </div>
  );
}
