// apps/web/src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

let tempGuestProfile: Record<string, any> = {
  name: "Guest Developer",
  email: "guest@career-agents.com",
  targetRole: "Senior Software Engineer",
  targetCompany: "Google",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { metrics: true, settings: true }
      });
      if (dbUser) {
        return NextResponse.json({ profile: dbUser });
      }
    }
    return NextResponse.json({ profile: tempGuestProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email) {
      const dbUser = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          name: body.name,
          githubUsername: body.githubUsername,
          linkedinUrl: body.linkedinUrl,
          targetRole: body.targetRole,
          targetCompany: body.targetCompany,
        }
      });
      return NextResponse.json({ profile: dbUser });
    }
    
    tempGuestProfile = {
      ...tempGuestProfile,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ profile: tempGuestProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}
