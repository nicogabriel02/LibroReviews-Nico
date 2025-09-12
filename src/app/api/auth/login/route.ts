import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validation";
import { loginUser } from "@/services/auth";
import { signUserJWT, getAuthCookieName } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { email, password } = parsed.data;
  try {
    const u = await loginUser(email, password);
    const token = await signUserJWT({ sub: u.id, email: u.email, name: u.name });
    const res = NextResponse.json({ ok: true, user: u });
    res.cookies.set(getAuthCookieName(), token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
    return res;
  } catch {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
}
