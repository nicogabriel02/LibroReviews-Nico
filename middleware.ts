// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const sid = req.cookies.get("sid")?.value;
  if (!sid) {
    res.cookies.set("sid", crypto.randomUUID(), {
      path: "/",
      httpOnly: false, // lo leemos en server; público está OK para ejemplo
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
