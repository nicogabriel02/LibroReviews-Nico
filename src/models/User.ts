import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
}, { timestamps: true });

export type TUser = {
  _id: string;
  email: string;
  passwordHash: string;
  name?: string;
};

export const User = models.User || model("User", UserSchema);

