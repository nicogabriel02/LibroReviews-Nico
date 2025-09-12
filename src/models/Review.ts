import { Schema, model, models, Types } from "mongoose";

const ReviewSchema = new Schema({
  bookId: { type: String, required: true, index: true },
  userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

ReviewSchema.index({ bookId: 1, createdAt: -1 });

export type TReview = {
  _id: string;
  bookId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Date;
};

export const Review = models.Review || model("Review", ReviewSchema);
