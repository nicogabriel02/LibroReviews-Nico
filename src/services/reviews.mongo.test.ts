import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { setupMemoryMongo, teardownMemoryMongo } from "@/test/mongoTest";
import { User } from "@/models/User";
import { createReview, listReviewsByBook, voteReview, updateReview, deleteReview } from "@/services/reviews.mongo";
import bcrypt from "bcryptjs";

async function createUser(email: string) {
  const passwordHash = await bcrypt.hash("x12345678", 10);
  const u = await User.create({ email, passwordHash, name: "Test" });
  return String(u._id);
}

describe("reviews mongo", () => {
  beforeAll(setupMemoryMongo);
  afterAll(teardownMemoryMongo);

  it("crud + votes", async () => {
    const uid = await createUser("x@y.com");
    const bookId = "book1";
    const id = await createReview(uid, bookId, 5, "Excelente");
    let list = await listReviewsByBook(bookId, uid);
    expect(list[0].score).toBe(0);

    let res = await voteReview(uid, id, "up");
    expect(res.score).toBe(1);
    expect(res.myVote).toBe(1);

    await updateReview(uid, id, { content: "Genial" });
    list = await listReviewsByBook(bookId, uid);
    expect(list[0].content).toBe("Genial");

    await deleteReview(uid, id);
    list = await listReviewsByBook(bookId, uid);
    expect(list.length).toBe(0);
  });
});
