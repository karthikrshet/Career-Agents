// apps/web/src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, properties, sessionId } = body;

    if (!eventName || !sessionId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    let userId: string | undefined = undefined;
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email || "" }
      });
      if (user) userId = user.id;
    }

    const newEvent = await prisma.analyticsEvent.create({
      data: {
        eventName,
        sessionId,
        userId: userId || null,
        properties: properties || {},
      }
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to log event" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin access control override check
    const isAdmin = session?.user?.email?.endsWith("@career-agents.com") || process.env.NODE_ENV === "development";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access to telemetry portal" }, { status: 401 });
    }

    // Aggregate telemetry data for the Admin Dashboard
    const totalEvents = await prisma.analyticsEvent.count();
    
    const eventsList = await prisma.analyticsEvent.findMany({
      take: 100,
      orderBy: { timestamp: "desc" }
    });

    // Count unique sessions
    const sessions = await prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      _count: { sessionId: true }
    });
    const uniqueSessionsCount = sessions.length;

    // Count events by name
    const groupedNames = await prisma.analyticsEvent.groupBy({
      by: ["eventName"],
      _count: { eventName: true },
      orderBy: {
        _count: {
          eventName: "desc"
        }
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalEvents,
        uniqueSessions: uniqueSessionsCount,
        popularEvents: groupedNames.map(g => ({ name: g.eventName, count: g._count.eventName })),
      },
      recentEvents: eventsList
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load metrics" }, { status: 500 });
  }
}
