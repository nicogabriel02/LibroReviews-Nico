import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const cookieName = process.env.AUTH_COOKIE_NAME || "auth";

export type JWTPayload = { sub: string; email: string; name?: string };

export async function signUserJWT(payload: JWTPayload, expSeconds = 60 * 60 * 24 * 7) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(secret);
}

export async function verifyUserJWT(token: string) {
  const { payload } = await jwtVerify<JWTPayload>(token, secret);
  return payload;
}

export function getAuthCookieName() { return cookieName; }
