import { NextResponse } from "next/server";
import { VoteSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";
import { voteReview } from "@/services/reviews.mongo";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = VoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const out = await voteReview(me.id, id, parsed.data.value);
  return NextResponse.json(out);
}
