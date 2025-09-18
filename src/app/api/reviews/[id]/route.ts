import { NextResponse } from "next/server";
import { UpdateReviewSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";
import { updateReview, deleteReview } from "@/services/reviews";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  try {
    await updateReview(me.id, id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (String(e.message).includes("NOT_OWNER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  try {
    await deleteReview(me.id, id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (String(e.message).includes("NOT_OWNER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
