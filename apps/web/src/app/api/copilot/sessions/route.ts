// apps/web/src/app/api/copilot/sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ sessions: [] });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbSessions = await prisma.copilotSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ success: true, sessions: dbSessions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load chat sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, title, messages } = body;

    const chat = await prisma.copilotSession.upsert({
      where: { id: id || "temp-id-fallback" },
      update: {
        title: title || "Conversation",
        messages: messages || [],
        updatedAt: new Date(),
      },
      create: {
        id: id || undefined,
        userId: user.id,
        title: title || "New Conversation",
        messages: messages || [],
      }
    });

    return NextResponse.json({ success: true, session: chat });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to save session" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    await prisma.copilotSession.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Chat session deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete session" }, { status: 500 });
  }
}
