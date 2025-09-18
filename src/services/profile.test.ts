import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { setupMemoryMongo, teardownMemoryMongo } from "@/test/mongoTest";
import { connectMongo } from "@/lib/mongo";
import { registerUser } from "@/services/auth";
import { createReview } from "@/services/reviews.mongo";
import { addFavorite } from "@/services/favorites.mongo";
import { getUserProfile, getUserReviews } from "@/services/profile";
import { User } from "@/models/User";
import { Review } from "@/models/Review";
import { Favorite } from "@/models/Favorite";

describe("Profile Service", () => {
  beforeAll(setupMemoryMongo);
  afterAll(teardownMemoryMongo);

  beforeEach(async () => {
    await connectMongo();
    await User.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});
  });

  it("should get user profile with stats", async () => {
    // Create a user
    const user = await registerUser("test@example.com", "password123", "Test User");
    
    // Create some reviews
    await createReview(user.id, "book1", 5, "Great book!");
    await createReview(user.id, "book2", 4, "Good read");
    await createReview(user.id, "book3", 3, "Okay book");
    
    // Add some favorites
    await addFavorite(user.id, "book1");
    await addFavorite(user.id, "book4");

    const profile = await getUserProfile(user.id);

    expect(profile.stats.totalReviews).toBe(3);
    expect(profile.stats.totalFavorites).toBe(2);
    expect(profile.stats.avgRating).toBe(4.0); // (5+4+3)/3 = 4.0
    expect(profile.recentReviews).toHaveLength(3);
    expect(profile.favorites).toHaveLength(2);
  });

  it("should handle user with no reviews or favorites", async () => {
    const user = await registerUser("empty@example.com", "password123", "Empty User");
    
    const profile = await getUserProfile(user.id);

    expect(profile.stats.totalReviews).toBe(0);
    expect(profile.stats.totalFavorites).toBe(0);
    expect(profile.stats.avgRating).toBe(0);
    expect(profile.recentReviews).toHaveLength(0);
    expect(profile.favorites).toHaveLength(0);
  });

  it("should limit recent reviews to 10", async () => {
    const user = await registerUser("prolific@example.com", "password123", "Prolific User");
    
    // Create 15 reviews
    for (let i = 1; i <= 15; i++) {
      await createReview(user.id, `book${i}`, 5, `Review ${i}`);
    }

    const profile = await getUserProfile(user.id);

    expect(profile.stats.totalReviews).toBe(15);
    expect(profile.recentReviews).toHaveLength(10);
  });

  it("should get paginated user reviews", async () => {
    const user = await registerUser("reader@example.com", "password123", "Avid Reader");
    
    // Create 25 reviews
    for (let i = 1; i <= 25; i++) {
      await createReview(user.id, `book${i}`, 5, `Review ${i}`);
    }

    // Test first page
    const firstPage = await getUserReviews(user.id, 10, 0);
    expect(firstPage).toHaveLength(10);

    // Test second page
    const secondPage = await getUserReviews(user.id, 10, 10);
    expect(secondPage).toHaveLength(10);

    // Test third page
    const thirdPage = await getUserReviews(user.id, 10, 20);
    expect(thirdPage).toHaveLength(5);

    // Verify no duplicate reviews between pages
    const firstIds = firstPage.map(r => r.id);
    const secondIds = secondPage.map(r => r.id);
    const overlap = firstIds.filter(id => secondIds.includes(id));
    expect(overlap).toHaveLength(0);
  });

  it("should return reviews in descending order by creation date", async () => {
    const user = await registerUser("ordered@example.com", "password123", "Ordered User");
    
    // Create reviews with slight delays to ensure different timestamps
    const review1 = await createReview(user.id, "book1", 5, "First review");
    await new Promise(resolve => setTimeout(resolve, 10));
    const review2 = await createReview(user.id, "book2", 4, "Second review");
    await new Promise(resolve => setTimeout(resolve, 10));
    const review3 = await createReview(user.id, "book3", 3, "Third review");

    const reviews = await getUserReviews(user.id);

    expect(reviews[0].content).toBe("Third review");
    expect(reviews[1].content).toBe("Second review");
    expect(reviews[2].content).toBe("First review");
  });
});