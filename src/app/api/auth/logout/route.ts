import { NextResponse } from "next/server";
import { getAuthCookieName } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getAuthCookieName(), "", { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    expires: new Date(0), 
    path: "/",
    sameSite: "lax"
  });
  return res;
}
