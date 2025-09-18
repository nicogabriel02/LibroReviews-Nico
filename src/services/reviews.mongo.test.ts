import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { setupMemoryMongo, teardownMemoryMongo } from "@/test/mongoTest";
import { connectMongo } from "@/lib/mongo";
import { User } from "@/models/User";
import { Review } from "@/models/Review";
import { Vote } from "@/models/Vote";
import { createReview, listReviewsByBook, voteReview, updateReview, deleteReview } from "@/services/reviews.mongo";
import bcrypt from "bcryptjs";

async function createUser(email: string) {
  const passwordHash = await bcrypt.hash("x12345678", 10);
  const u = await User.create({ email, passwordHash, name: "Test" });
  return String(u._id);
}

describe("Reviews MongoDB Service", () => {
  beforeAll(setupMemoryMongo);
  afterAll(teardownMemoryMongo);

  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    await connectMongo();
    await User.deleteMany({});
    await Review.deleteMany({});
    await Vote.deleteMany({});
    
    user1Id = await createUser("user1@example.com");
    user2Id = await createUser("user2@example.com");
  });

  describe("Basic CRUD operations", () => {
    it("should perform full CRUD + vote cycle", async () => {
      const bookId = "book1";
      const id = await createReview(user1Id, bookId, 5, "Excelente");
      
      let list = await listReviewsByBook(bookId, user1Id);
      expect(list[0].score).toBe(0);
      expect(list[0].content).toBe("Excelente");

      let res = await voteReview(user1Id, id, "up");
      expect(res.score).toBe(1);
      expect(res.myVote).toBe(1);

      await updateReview(user1Id, id, { content: "Genial" });
      list = await listReviewsByBook(bookId, user1Id);
      expect(list[0].content).toBe("Genial");

      await deleteReview(user1Id, id);
      list = await listReviewsByBook(bookId, user1Id);
      expect(list.length).toBe(0);
    });
  });

  describe("Authorization tests", () => {
    it("should prevent updating another user's review", async () => {
      const reviewId = await createReview(user1Id, "book1", 5, "User 1 review");
      
      await expect(
        updateReview(user2Id, reviewId, { content: "Hacked!" })
      ).rejects.toThrow("NOT_OWNER");
    });

    it("should prevent deleting another user's review", async () => {
      const reviewId = await createReview(user1Id, "book1", 5, "User 1 review");
      
      await expect(
        deleteReview(user2Id, reviewId)
      ).rejects.toThrow("NOT_OWNER");
    });

    it("should allow different users to vote on same review", async () => {
      const reviewId = await createReview(user1Id, "book1", 5, "Review to vote on");
      
      await voteReview(user1Id, reviewId, "up");
      const result = await voteReview(user2Id, reviewId, "down");
      
      expect(result.score).toBe(0); // +1 from user1, -1 from user2
    });
  });

  describe("Vote mechanics", () => {
    let reviewId: string;

    beforeEach(async () => {
      reviewId = await createReview(user2Id, "book1", 4, "Review to vote on");
    });

    it("should toggle vote when clicking same direction twice", async () => {
      // First upvote
      let result = await voteReview(user1Id, reviewId, "up");
      expect(result.score).toBe(1);
      expect(result.myVote).toBe(1);

      // Second upvote should remove the vote
      result = await voteReview(user1Id, reviewId, "up");
      expect(result.score).toBe(0);
      expect(result.myVote).toBe(0);
    });

    it("should change vote when clicking opposite direction", async () => {
      // First upvote
      await voteReview(user1Id, reviewId, "up");
      
      // Then downvote should change the vote
      const result = await voteReview(user1Id, reviewId, "down");
      expect(result.score).toBe(-1);
      expect(result.myVote).toBe(-1);
    });
  });

  describe("Listing and sorting", () => {
    it("should return reviews sorted by creation date (newest first)", async () => {
      const review1Id = await createReview(user1Id, "book1", 5, "First review");
      await new Promise(resolve => setTimeout(resolve, 10));
      const review2Id = await createReview(user2Id, "book1", 4, "Second review");
      
      const reviews = await listReviewsByBook("book1");
      
      expect(reviews).toHaveLength(2);
      expect(reviews[0].content).toBe("Second review");
      expect(reviews[1].content).toBe("First review");
    });

    it("should include correct vote information for authenticated user", async () => {
      const reviewId = await createReview(user2Id, "book1", 4, "Review");
      await voteReview(user1Id, reviewId, "up");
      
      const reviews = await listReviewsByBook("book1", user1Id);
      
      expect(reviews[0].score).toBe(1);
      expect(reviews[0].myVote).toBe(1);
    });

    it("should show neutral votes for unauthenticated requests", async () => {
      const reviewId = await createReview(user1Id, "book1", 5, "Review");
      await voteReview(user2Id, reviewId, "up");
      
      const reviews = await listReviewsByBook("book1"); // No user context
      
      expect(reviews[0].score).toBe(1);
      expect(reviews[0].myVote).toBe(0); // No user context
    });
  });
});
