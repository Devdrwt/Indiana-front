import { NextResponse } from "next/server";
import { getLivrables } from "@/lib/livrables";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getLivrables());
}
