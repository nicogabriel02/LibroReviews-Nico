import { Schema, model, models, Types } from "mongoose";

const VoteSchema = new Schema({
  reviewId: { type: Types.ObjectId, ref: "Review", required: true, index: true },
  userId:   { type: Types.ObjectId, ref: "User", required: true, index: true },
  value:    { type: Number, enum: [-1, 1], required: true },
}, { timestamps: true });

VoteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export type TVote = { _id: string; reviewId: string; userId: string; value: -1 | 1 };

export const Vote = models.Vote || model("Vote", VoteSchema);
