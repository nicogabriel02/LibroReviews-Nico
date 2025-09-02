// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const db = {
  reviews: [] as any[],
  votes: [] as any[],
};

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      review: {
        // ⬇️ Reemplazá findMany por esta versión que respeta include.votes
        findMany: vi.fn(async ({ where, include }: any) => {
          const rows = db.reviews.filter(r => r.bookId === where.bookId);
          return rows.map(r => ({
            ...r,
            votes: include?.votes ? db.votes.filter(v => v.reviewId === r.id) : [],
          }));
        }),
        create: vi.fn(async ({ data }: any) => {
          const row = { ...data, id: String(Date.now()), createdAt: new Date() };
          db.reviews.push({ ...row }); // votos se “unen” en findMany
          return row;
        }),
      },
      reviewVote: {
        findUnique: vi.fn(async ({ where }: any) =>
          db.votes.find(
            (v) =>
              v.reviewId === where.reviewId_sessionId.reviewId &&
              v.sessionId === where.reviewId_sessionId.sessionId
          ) || null
        ),
        create: vi.fn(async ({ data }: any) => {
          db.votes.push({ id: String(Math.random()), ...data });
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const v = db.votes.find((x) => x.id === where.id);
          if (v) v.value = data.value;
        }),
        delete: vi.fn(async ({ where }: any) => {
          const i = db.votes.findIndex((x) => x.id === where.id);
          if (i >= 0) db.votes.splice(i, 1);
        }),
        findMany: vi.fn(async ({ where }: any) =>
          db.votes.filter((v) => v.reviewId === where.reviewId)
        ),
      },
    },
  };
});

import { listReviewsService, createReviewService, voteReviewService } from "@/services/reviews";

beforeEach(() => {
  db.reviews.length = 0;
  db.votes.length = 0;
});

describe("reviews services with prisma mock", () => {
  it("listReviewsService mapea score y myVote", async () => {
    const rId = await createReviewService({ bookId: "b1", authorName: "F", rating: 5, content: "ok" });
    // seed votes
    db.votes.push({ id: "v1", reviewId: rId, sessionId: "s1", value: 1 });
    db.votes.push({ id: "v2", reviewId: rId, sessionId: "s2", value: -1 });

    const out = await listReviewsService("b1", "s1");
    expect(out[0].score).toBe(0);
    expect(out[0].myVote).toBe(1);
  });

  it("voteReviewService toggle / switch", async () => {
    const rId = await createReviewService({ bookId: "b1", authorName: "F", rating: 4, content: "nice" });

    // upvote (no existía)
    let res = await voteReviewService(rId, "sid", "up");
    expect(res).toMatchObject({ score: 1, myVote: 1 });

    // upvote de nuevo → lo quita
    res = await voteReviewService(rId, "sid", "up");
    expect(res).toMatchObject({ score: 0, myVote: 0 });

    // downvote (nuevo)
    res = await voteReviewService(rId, "sid", "down");
    expect(res).toMatchObject({ score: -1, myVote: -1 });

    // cambiar a up
    res = await voteReviewService(rId, "sid", "up");
    expect(res).toMatchObject({ score: 1, myVote: 1 });
  });
});
