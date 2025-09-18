import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validation";
import { registerUser } from "@/services/auth";
import { signUserJWT, getAuthCookieName } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { email, password, name } = parsed.data;
  try {
    const u = await registerUser(email, password, name);
    const token = await signUserJWT({ sub: u.id, email: u.email, name: u.name });
    const res = NextResponse.json({ ok: true, user: u });
    res.cookies.set(getAuthCookieName(), token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 días en segundos
    });
    return res;
  } catch (e: any) {
    if (String(e.message).includes("EMAIL_TAKEN")) {
      return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
