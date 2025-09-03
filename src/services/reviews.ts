// src/services/reviews.ts
import { prisma } from "@/lib/prisma";
import type { CreateReviewInput } from "@/lib/validation";
import type { Review, ReviewVote } from "@prisma/client";

type VoteRow = { sessionId: string; value: -1 | 1 };
type ReviewRow = {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  createdAt: Date;
  votes: VoteRow[];
};

export function mapReviewsWithVotes(rows: ReviewRow[], sid: string) {
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
      myVote: (mine as -1 | 0 | 1),
    };
  });
}

type VoteDir = "up" | "down";
type VoteResult = { newMyVote: -1 | 0 | 1; delta: -2 | -1 | 1 | 2 };

export function applyVoteOptimistic(prevMyVote: -1 | 0 | 1, dir: VoteDir): VoteResult {
  const target: 1 | -1 = dir === "up" ? 1 : -1;

  if (prevMyVote === target) {
    const delta = (target * -1) as -1 | 1;
    return { newMyVote: 0, delta };
  }
  if (prevMyVote === target * -1) {
    const delta = (target * 2) as 2 | -2;
    return { newMyVote: target, delta };
  }
  return { newMyVote: target, delta: target };
}

type ReviewWithVotes = Review & { votes: Pick<ReviewVote, "sessionId" | "value">[] };

export async function listReviewsService(bookId: string, sid: string) {
  const rows = (await prisma.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    include: { votes: { select: { sessionId: true, value: true } } },
  })) as ReviewWithVotes[];

  const normalized: ReviewRow[] = rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt,
    votes: r.votes.map((v) => ({ sessionId: v.sessionId, value: (v.value === 1 ? 1 : -1) as -1 | 1 })),
  }));

  return mapReviewsWithVotes(normalized, sid);
}

export async function createReviewService(input: CreateReviewInput) {
  const created = await prisma.review.create({ data: input });
  return created.id;
}

export async function voteReviewService(reviewId: string, sid: string, dir: VoteDir) {
  const target: 1 | -1 = dir === "up" ? 1 : -1;

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
  return { score, myVote: (myVote as -1 | 0 | 1) };
}
