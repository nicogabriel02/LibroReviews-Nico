// app/api/reviews/[id]/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const VoteSchema = z.object({ value: z.enum(["up", "down"]) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // reviewId
  const sid = cookies().get("sid")?.value ?? "";
  if (!sid) return NextResponse.json({ error: "No session" }, { status: 400 });

  const body = await req.json();
  const parsed = VoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad vote" }, { status: 400 });

  const newValue = parsed.data.value === "up" ? 1 : -1;

  const existing = await prisma.reviewVote.findUnique({
    where: { reviewId_sessionId: { reviewId: id, sessionId: sid } },
  });

  if (existing && existing.value === newValue) {
    await prisma.reviewVote.delete({ where: { id: existing.id } }); // toggle off
  } else if (existing) {
    await prisma.reviewVote.update({ where: { id: existing.id }, data: { value: newValue } });
  } else {
    await prisma.reviewVote.create({ data: { reviewId: id, sessionId: sid, value: newValue } });
  }

  // Devolver score actualizado
  const votes = await prisma.reviewVote.findMany({ where: { reviewId: id } });
  const score = votes.reduce((acc, v) => acc + v.value, 0);
  const myVote = votes.find((v) => v.sessionId === sid)?.value ?? 0;

  return NextResponse.json({ ok: true, score, myVote });
}
