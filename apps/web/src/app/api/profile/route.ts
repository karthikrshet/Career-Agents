// api/profile/route.ts — Read/write user profile from local persistence

import { NextResponse } from "next/server";

let profileStore: Record<string, unknown> | null = null;

export async function GET() {
  return NextResponse.json({ profile: profileStore });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    profileStore = {
      ...profileStore,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ profile: profileStore });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
