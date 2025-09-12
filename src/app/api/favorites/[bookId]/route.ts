import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { addFavorite, removeFavorite } from "@/services/favorites.mongo";

export const runtime = "nodejs";

export async function PUT(_req: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const me = await requireUser();
  const { bookId } = await params;
  await addFavorite(me.id, bookId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const me = await requireUser();
  const { bookId } = await params;
  await removeFavorite(me.id, bookId);
  return NextResponse.json({ ok: true });
}
