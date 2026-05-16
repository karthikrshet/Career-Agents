// apps/web/src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Global in-memory event buffer cache (persists across serverless/dev request contexts)
const inMemoryBuffer: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, properties, sessionId } = body;

    if (!eventName || !sessionId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    let userId: string | undefined = undefined;
    
    // Check user record if authenticated
    try {
      if (session?.user?.email && process.env.DATABASE_URL) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email || "" }
        });
        if (user) userId = user.id;
      }
    } catch (_) {}

    let newEvent = null;
    try {
      if (process.env.DATABASE_URL) {
        newEvent = await prisma.analyticsEvent.create({
          data: {
            eventName,
            sessionId,
            userId: userId || null,
            properties: properties || {},
          }
        });
      }
    } catch (dbErr) {
      console.warn("Analytics DB write failed. Falling back to in-memory store:", dbErr);
    }

    if (!newEvent) {
      // Create mockup/in-memory event object with secure log ID
      newEvent = {
        id: `mem-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
        eventName,
        sessionId,
        userId: userId || null,
        properties: properties || {},
        timestamp: new Date().toISOString()
      };
      inMemoryBuffer.unshift(newEvent);
      if (inMemoryBuffer.length > 500) {
        inMemoryBuffer.pop(); // Cap at 500 items to prevent memory leaks
      }
    }

    return NextResponse.json({ success: true, event: newEvent, storage: newEvent.id.startsWith("mem-") ? "memory" : "db" });
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

    let totalEvents = inMemoryBuffer.length;
    let eventsList = [...inMemoryBuffer];
    let uniqueSessionsCount = new Set(inMemoryBuffer.map(e => e.sessionId)).size;
    
    // Group names in-memory
    const counts: Record<string, number> = {};
    for (const event of inMemoryBuffer) {
      counts[event.eventName] = (counts[event.eventName] || 0) + 1;
    }
    let popularEvents = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    try {
      if (process.env.DATABASE_URL) {
        const dbTotal = await prisma.analyticsEvent.count();
        const dbEvents = await prisma.analyticsEvent.findMany({
          take: 100,
          orderBy: { timestamp: "desc" }
        });
        const sessions = await prisma.analyticsEvent.groupBy({
          by: ["sessionId"],
          _count: { sessionId: true }
        });
        const groupedNames = await prisma.analyticsEvent.groupBy({
          by: ["eventName"],
          _count: { eventName: true },
          orderBy: {
            _count: {
              eventName: "desc"
            }
          }
        });

        totalEvents = dbTotal;
        eventsList = dbEvents;
        uniqueSessionsCount = sessions.length;
        popularEvents = groupedNames.map(g => ({ name: g.eventName, count: g._count.eventName }));
      }
    } catch (dbErr) {
      console.warn("Analytics DB read failed. Serving in-memory fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalEvents,
        uniqueSessions: uniqueSessionsCount,
        popularEvents,
      },
      recentEvents: eventsList
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load metrics" }, { status: 500 });
  }
}
