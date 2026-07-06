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
      <Link href="/" className="text-sm text-slate-500 hover:underline">
        ← Retour
      </Link>
      <div className="mt-4">
        <LivrablePreview livrable={livrable} />
      </div>
    </div>
  );
}
