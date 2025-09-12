import { NextResponse } from "next/server";
import { getAuthCookieName } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getAuthCookieName(), "", { httpOnly: true, secure: true, expires: new Date(0), path: "/" });
  return res;
}
