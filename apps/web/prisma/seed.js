import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed script...");

  // 1. Create default demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@careeragents.com" },
    update: {},
    create: {
      name: "Demo Candidate",
      email: "demo@careeragents.com",
      targetRole: "Senior Full Stack Engineer",
      targetCompany: "Google",
      plan: "pro",
    },
  });

  console.log(`✓ Demo user configured: ${user.email}`);

  // 2. Create UserSettings
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      aiProvider: "groq",
      aiModel: "llama3-70b-8192",
      temperature: 0.7,
      theme: "dark",
      notifications: true,
    },
  });

  console.log("✓ User settings configured");

  // 3. Create CareerMetrics
  await prisma.careerMetrics.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      careerScore: 82,
      resumeScore: 78,
      githubScore: 85,
      linkedinScore: 80,
      interviewScore: 88,
      applicationScore: 75,
    },
  });

  console.log("✓ Career metrics configured");

  // 4. Create standard Workflow template
  await prisma.workflow.create({
    data: {
      userId: user.id,
      name: "Standard FAANG Prep Pipeline",
      steps: [
        { id: "resume-tailor", type: "resume", config: { target: "Google SWE" } },
        { id: "github-audit", type: "github", config: { repoLimit: 5 } },
        { id: "behavioral-prep", type: "interview", config: { round: "behavioral" } },
      ],
    },
  });

  console.log("✓ Initial workflow template seeded");

  // 5. Seed Analytics Events
  const events = [
    { sessionId: "session-123", eventName: "user_login", properties: { method: "credentials" } },
    { sessionId: "session-123", eventName: "resume_analyzed", properties: { score: 78 } },
    { sessionId: "session-123", eventName: "playground_code_executed", properties: { language: "javascript" } },
  ];

  for (const e of events) {
    await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        sessionId: e.sessionId,
        eventName: e.eventName,
        properties: e.properties,
      },
    });
  }

  console.log("✓ Analytics events populated");
  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
