import { Schema, model, models, Types } from "mongoose";

const FavoriteSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
  bookId: { type: String, required: true, index: true },
}, { timestamps: true });

FavoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export type TFavorite = { _id: string; userId: string; bookId: string };

export const Favorite = models.Favorite || model("Favorite", FavoriteSchema);
