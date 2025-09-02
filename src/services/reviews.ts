// src/services/reviews.ts
import { prisma } from "@/lib/prisma";
import type { CreateReviewInput } from "@/lib/validation";

/** Fusiona votos en score y calcula mi voto actual */
export function mapReviewsWithVotes(
  rows: Array<{ id: string; authorName: string; rating: number; content: string; createdAt: Date; votes: { sessionId: string; value: number }[] }>,
  sid: string
) {
  return rows.map((r) => {
    const score = r.votes.reduce((acc, v) => acc + v.value, 0);
    const mine = r.votes.find((v) => v.sessionId === sid)?.value ?? 0;
    return {
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt,
      score,
      myVote: mine as -1 | 0 | 1,
    };
  });
}

/** Lógica del cliente para actualizar optimistamente el voto */
export function applyVoteOptimistic(prevMyVote: -1 | 0 | 1, dir: "up" | "down") {
  const target = dir === "up" ? 1 : -1;
  // si repetís el mismo voto → lo quitás
  if (prevMyVote === target) return { newMyVote: 0 as 0, delta: -target };
  // si cambiás de voto opuesto → sumás 2 o restás 2
  if (prevMyVote === -target) return { newMyVote: target as 1 | -1, delta: 2 * target };
  // si no habías votado → agregás 1 o -1
  return { newMyVote: target as 1 | -1, delta: target };
}

/** Lista reseñas con cálculos */
export async function listReviewsService(bookId: string, sid: string) {
  const rows = await prisma.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    include: { votes: true },
  });
  return mapReviewsWithVotes(rows as any, sid);
}

/** Crea reseña válida */
export async function createReviewService(input: CreateReviewInput) {
  const created = await prisma.review.create({ data: input });
  return created.id;
}

/** Aplica/vuelve atrás/alternar voto y devuelve score + mi voto */
export async function voteReviewService(reviewId: string, sid: string, dir: "up" | "down") {
  const target = dir === "up" ? 1 : -1;

  const existing = await prisma.reviewVote.findUnique({
    where: { reviewId_sessionId: { reviewId, sessionId: sid } },
  });

  if (existing && existing.value === target) {
    await prisma.reviewVote.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.reviewVote.update({ where: { id: existing.id }, data: { value: target } });
  } else {
    await prisma.reviewVote.create({ data: { reviewId, sessionId: sid, value: target } });
  }

  const votes = await prisma.reviewVote.findMany({ where: { reviewId } });
  const score = votes.reduce((a, v) => a + v.value, 0);
  const myVote = votes.find((v) => v.sessionId === sid)?.value ?? 0;
  return { score, myVote: myVote as -1 | 0 | 1 };
}
