// src/app/api/reviews/[id]/vote/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { voteReviewService } from "@/services/reviews";

// Aseguramos runtime Node (Prisma no funciona en Edge)
export const runtime = "nodejs";

type Ctx = { params: { id: string } };

export async function POST(request: Request, context: Ctx) {
  const { id } = context.params;

  // cuerpo esperado: { value: "up" | "down" }
  const body = (await request.json().catch(() => null)) as { value?: "up" | "down" } | null;
  if (!body?.value || (body.value !== "up" && body.value !== "down")) {
    return NextResponse.json({ error: "invalid vote" }, { status: 400 });
  }

  const jar = await cookies();
  const sid = jar.get("sid")?.value ?? "anon";

  const result = await voteReviewService(id, sid, body.value);
  return NextResponse.json(result);
}
