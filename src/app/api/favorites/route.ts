import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listFavorites } from "@/services/favorites.mongo";

export const runtime = "nodejs";

export async function GET() {
  const me = await requireUser();
  const favs = await listFavorites(me.id);
  return NextResponse.json({ favorites: favs });
}
