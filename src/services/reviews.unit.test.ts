import { describe, it, expect } from "vitest";
import { mapReviewsWithVotes, applyVoteOptimistic } from "@/services/reviews";

describe("mapReviewsWithVotes", () => {
  it("calcula score y myVote", () => {
    const rows = [{
      id: "r1", authorName: "A", rating: 4, content: "Bien", createdAt: new Date(),
      votes: [{ sessionId: "s1", value: 1 }, { sessionId: "s2", value: -1 }, { sessionId: "s1", value: 1 }],
    }];
    const out = mapReviewsWithVotes(rows as any, "s1");
    expect(out[0].score).toBe(1 + -1 + 1); // 1
    expect(out[0].myVote).toBe(1);
  });
});

describe("applyVoteOptimistic", () => {
  it("agrega voto nuevo", () => {
    expect(applyVoteOptimistic(0, "up")).toEqual({ newMyVote: 1, delta: 1 });
    expect(applyVoteOptimistic(0, "down")).toEqual({ newMyVote: -1, delta: -1 });
  });
  it("quita el mismo voto (toggle off)", () => {
    expect(applyVoteOptimistic(1, "up")).toEqual({ newMyVote: 0, delta: -1 });
    expect(applyVoteOptimistic(-1, "down")).toEqual({ newMyVote: 0, delta: 1 });
  });
  it("cambia de up a down / down a up", () => {
    expect(applyVoteOptimistic(1, "down")).toEqual({ newMyVote: -1, delta: -2 });
    expect(applyVoteOptimistic(-1, "up")).toEqual({ newMyVote: 1, delta: 2 });
  });
});
