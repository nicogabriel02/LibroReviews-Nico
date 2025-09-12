import { connectMongo } from "@/lib/mongo";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(email: string, password: string, name?: string) {
  await connectMongo();
  const exists = await User.findOne({ email });
  if (exists) throw new Error("EMAIL_TAKEN");
  const passwordHash = await bcrypt.hash(password, 10);
  const created = await User.create({ email, passwordHash, name });
  return { id: String(created._id), email: created.email, name: created.name };
}

export async function loginUser(email: string, password: string) {
  await connectMongo();
  const user = await User.findOne({ email });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");
  return { id: String(user._id), email: user.email, name: user.name };
}
