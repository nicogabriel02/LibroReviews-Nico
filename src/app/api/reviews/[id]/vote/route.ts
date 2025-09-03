// src/app/api/reviews/[id]/vote/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { voteReviewService } from "@/services/reviews";

// Prisma necesita Node runtime (no Edge)
export const runtime = "nodejs";

// 👇 params es Promise<{ id: string }>
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 👈 clave

  // cuerpo esperado: { value: "up" | "down" }
  const body = (await request.json().catch(() => null)) as { value?: "up" | "down" } | null;
  if (!body?.value || (body.value !== "up" && body.value !== "down")) {
    return NextResponse.json({ error: "invalid vote" }, { status: 400 });
  }

  const jar = await cookies(); // cookies también es async en Next 15
  const sid = jar.get("sid")?.value ?? "anon";

  const result = await voteReviewService(id, sid, body.value);
  return NextResponse.json(result);
}
