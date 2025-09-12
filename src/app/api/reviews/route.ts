import { NextResponse } from "next/server";
import { CreateReviewSchema, UpdateReviewSchema } from "@/lib/validation";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { listReviewsByBook, createReview } from "@/services/reviews.mongo";

export const runtime = "nodejs";

// GET /api/reviews?bookId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId") ?? "";
  if (!bookId) return NextResponse.json({ error: "bookId requerido" }, { status: 400 });

  const me = await getCurrentUser();
  const reviews = await listReviewsByBook(bookId, me?.id);
  return NextResponse.json({ reviews });
}

// POST /api/reviews
export async function POST(req: Request) {
  const me = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = CreateReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { bookId, rating, content } = parsed.data;
  const id = await createReview(me.id, bookId, rating, content);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
