import { connectMongo } from "@/lib/mongo";
import { Favorite } from "@/models/Favorite";

export async function listFavorites(userId: string) {
  await connectMongo();
  const rows = await Favorite.find({ userId }).lean();
  return rows.map(r => ({ id: String(r._id), bookId: r.bookId }));
}
export async function addFavorite(userId: string, bookId: string) {
  await connectMongo();
  await Favorite.updateOne({ userId, bookId }, { $set: { userId, bookId } }, { upsert: true });
}
export async function removeFavorite(userId: string, bookId: string) {
  await connectMongo();
  await Favorite.deleteOne({ userId, bookId });
}
