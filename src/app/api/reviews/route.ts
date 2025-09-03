// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CreateReview as CreateReviewSchema } from "@/lib/validation";
import { listReviewsService, createReviewService } from "@/services/reviews";

// Prisma necesita Node runtime
export const runtime = "nodejs";

// GET /api/reviews?bookId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId") ?? "";
  if (!bookId) {
    return NextResponse.json({ error: "bookId requerido" }, { status: 400 });
  }

  const jar = await cookies(); // Next 15: async
  const sid = jar.get("sid")?.value ?? "anon";

  const reviews = await listReviewsService(bookId, sid);
  return NextResponse.json({ reviews });
}

// POST /api/reviews
// body: { bookId, authorName, rating, content }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 400 });
  }

  const id = await createReviewService(parsed.data);
  return NextResponse.json({ ok: true, id });
}
