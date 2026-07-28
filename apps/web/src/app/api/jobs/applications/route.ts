// apps/web/src/app/api/jobs/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ applications: [] });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const apps = await prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { appliedDate: "desc" }
    });

    return NextResponse.json({ success: true, applications: apps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load applications" }, { status: 500 });
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
    const newApp = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        company: body.company,
        role: body.role,
        status: body.status || "Applied",
        location: body.location || "",
        salary: body.salary || "",
        referral: body.referral || "",
        recruiter: body.recruiter || "",
        notes: body.notes || "",
        url: body.url || "",
        tags: body.tags || [],
      }
    });

    // Recalculate applications count & update metrics
    const count = await prisma.jobApplication.count({
      where: { userId: user.id }
    });
    const score = Math.min(100, Math.round((count / 10) * 100));

    await prisma.careerMetrics.upsert({
      where: { userId: user.id },
      update: {
        applicationScore: score,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        applicationScore: score,
      }
    });

    return NextResponse.json({ success: true, application: newApp });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create application" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    const existingApp = await prisma.jobApplication.findUnique({
      where: { id }
    });

    if (!existingApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updatedApp = await prisma.jobApplication.update({
      where: { id },
      data: {
        company: updates.company,
        role: updates.role,
        status: updates.status,
        location: updates.location,
        salary: updates.salary,
        referral: updates.referral,
        recruiter: updates.recruiter,
        notes: updates.notes,
        url: updates.url,
        tags: updates.tags,
      }
    });

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update application" }, { status: 500 });
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
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    await prisma.jobApplication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete application" }, { status: 500 });
  }
}
