import { connectMongo } from "@/lib/mongo";
import { Review } from "@/models/Review";
import { Favorite } from "@/models/Favorite";
import type { TReview } from "@/models/Review";
import type { TFavorite } from "@/models/Favorite";

export async function getUserProfile(userId: string) {
  await connectMongo();
  
  const reviews = await Review.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const favorites = await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return {
    stats: {
      totalReviews: reviews.length,
      totalFavorites: favorites.length,
      avgRating: reviews.length > 0 
        ? Number((reviews.reduce((sum, r) => sum + (r as any).rating, 0) / reviews.length).toFixed(1))
        : 0,
    },
    recentReviews: reviews.slice(0, 10).map(r => ({
      id: String((r as any)._id),
      bookId: (r as any).bookId,
      rating: (r as any).rating,
      content: (r as any).content,
      createdAt: (r as any).createdAt,
    })),
    favorites: favorites.map(f => ({
      id: String((f as any)._id),
      bookId: (f as any).bookId,
      createdAt: (f as any).createdAt,
    })),
  };
}

export async function getUserReviews(userId: string, limit = 20, offset = 0) {
  await connectMongo();
  
  const reviews = await Review.find({ userId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  return reviews.map(r => ({
    id: String((r as any)._id),
    bookId: (r as any).bookId,
    rating: (r as any).rating,
    content: (r as any).content,
    createdAt: (r as any).createdAt,
  }));
}