import { connectMongo } from "@/lib/mongo";
import { Review } from "@/models/Review";
import { Vote } from "@/models/Vote";

export async function listReviewsByBook(bookId: string, userId?: string) {
  await connectMongo();
  const rows = await Review.find({ bookId }).sort({ createdAt: -1 }).lean();
  const ids = rows.map(r => r._id);
  const votes = await Vote.find({ reviewId: { $in: ids } }).lean();

  return rows.map(r => {
    const vs = votes.filter(v => String(v.reviewId) === String(r._id));
    const score = vs.reduce((a, v) => a + v.value, 0);
    const my = userId ? vs.find(v => String(v.userId) === userId)?.value ?? 0 : 0;
    return {
      id: String(r._id),
      userId: String(r.userId),
      bookId: r.bookId,
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt,
      score,
      myVote: my as -1 | 0 | 1,
    };
  });
}

export async function createReview(userId: string, bookId: string, rating: number, content: string) {
  await connectMongo();
  const created = await Review.create({ userId, bookId, rating, content });
  return String(created._id);
}

export async function updateReview(userId: string, reviewId: string, data: { rating?: number; content?: string }) {
  await connectMongo();
  const r = await Review.findOne({ _id: reviewId, userId });
  if (!r) throw new Error("NOT_OWNER");
  if (data.rating !== undefined) r.rating = data.rating;
  if (data.content !== undefined) r.content = data.content;
  await r.save();
}

export async function deleteReview(userId: string, reviewId: string) {
  await connectMongo();
  const res = await Review.deleteOne({ _id: reviewId, userId });
  if (res.deletedCount === 0) throw new Error("NOT_OWNER");
}

export async function voteReview(userId: string, reviewId: string, dir: "up" | "down") {
  await connectMongo();
  const value = dir === "up" ? 1 : -1 as 1 | -1;
  const existing = await Vote.findOne({ reviewId, userId });
  if (existing && existing.value === value) {
    await Vote.deleteOne({ _id: existing._id });
  } else if (existing) {
    existing.value = value;
    await existing.save();
  } else {
    await Vote.create({ reviewId, userId, value });
  }
  const vs = await Vote.find({ reviewId }).lean();
  const score = vs.reduce((a, v) => a + v.value, 0);
  const myVote = vs.find(v => String(v.userId) === userId)?.value ?? 0;
  return { score, myVote: myVote as -1 | 0 | 1 };
}
