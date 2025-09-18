import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getUserProfile } from "@/services/profile";

export const runtime = "nodejs";

export async function GET() {
  const me = await requireUser();
  const profileData = await getUserProfile(me.id);

  const profile = {
    user: {
      id: me.id,
      email: me.email,
      name: me.name,
    },
    ...profileData,
  };

  return NextResponse.json({ profile });
}