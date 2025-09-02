import { CreateReview } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("bookId") ?? "";
  const sid = cookies().get("sid")?.value ?? "";

  if (!bookId) return NextResponse.json({ reviews: [] });

  const reviews = await prisma.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    include: { votes: true },
  });

  const mapped = reviews.map((r) => {
    const up = r.votes.filter((v) => v.value === 1).length;
    const down = r.votes.filter((v) => v.value === -1).length;
    const myVote = r.votes.find((v) => v.sessionId === sid)?.value ?? 0;
    return {
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt,
      score: up - down,
      myVote,
    };
  });

  return NextResponse.json({ reviews: mapped });
}

const CreateReview = z.object({
  bookId: z.string().min(1),
  authorName: z.string().trim().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(3).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateReview.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const { bookId, authorName, rating, content } = parsed.data;

  const created = await prisma.review.create({
    data: { bookId, authorName, rating, content },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
