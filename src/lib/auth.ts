import { cookies } from "next/headers";
import { getAuthCookieName, verifyUserJWT } from "./jwt";
import { connectMongo } from "./mongo";
import { User } from "@/models/User";

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(getAuthCookieName())?.value;
  if (!token) return null;
  try {
    const payload = await verifyUserJWT(token);
    await connectMongo();
    const user = await User.findById(payload.sub).lean();
    if (!user) return null;
    return { id: String(user._id), email: user.email, name: user.name };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error("UNAUTHORIZED");
  return u;
}
