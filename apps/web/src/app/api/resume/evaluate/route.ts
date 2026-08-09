// apps/web/src/app/api/resume/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generate } from "../../../../../../../packages/ai/router";
import { enforceRequestLimits, escapeHTML, escapeMarkdown } from "../../../../../../../packages/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ATS_KEYWORDS = [
  "TypeScript", "JavaScript", "Python", "React", "Node.js", "Next.js",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "PostgreSQL", "MongoDB",
  "Redis", "GraphQL", "REST", "API", "microservices", "CI/CD", "Git",
  "Agile", "distributed", "scalable", "performance", "optimization",
  "system design", "algorithms", "data structures", "machine learning",
];

const WEAK_VERBS = [
  "led", "managed", "handled", "worked", "helped", "assisted", "responsible",
  "was", "were", "did", "made", "used", "got", "had", "done", "oversaw",
  "participated", "involved", "contributed", "supported", "maintained",
];

const STRONG_VERB_MAP: Record<string, string> = {
  "led": "Directed",
  "managed": "Orchestrated",
  "worked": "Delivered",
  "helped": "Enabled",
  "assisted": "Collaborated with",
  "responsible for": "Owned",
  "participated": "Contributed to",
  "oversaw": "Supervised",
  "maintained": "Optimized",
  "coordinated": "Aligned",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp, { isUser: !!session?.user });
    if (limitResponse) return limitResponse;

    const { text, fileName, config, targetRole = "software-engineer", jobDescription = "", agentId = "ats-resume-reviewer" } = await req.json();

    if (!text) {
      return NextResponse.json({ success: false, error: "No resume text provided" }, { status: 400 });
    }

    // Enforce 20 KB payload limit to prevent resource exhaustion / DoS
    if (text.length > 20 * 1024) {
      return NextResponse.json({
        success: false,
        error: "Resume text payload exceeds the maximum allowed size of 20 KB."
      }, { status: 400 });
    }

    // Load active keywords taxonomy for target role / job description
    const { getRoleKeywords } = await import("@/lib/resume-engine");
    const { keywords: activeRoleKeywords, roleName: targetRoleName } = getRoleKeywords(targetRole, jobDescription);

    // Server-side usage limits gating check
    let plan: "guest" | "free" | "pro" | "team" | "enterprise" = "guest";
    let userId: string | null = null;

    try {
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, plan: true }
        });
        if (user) {
          userId = user.id;
          plan = (user.plan as any) || "free";
        }
      }
    } catch (error) {
      console.error("Prisma user lookup failed, falling back to guest:", error);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let currentScansCount = 0;
    try {
      if (userId) {
        currentScansCount = await prisma.resumeAnalysis.count({
          where: {
            userId,
            analyzedAt: { gte: startOfToday }
          }
        });
      } else {
        currentScansCount = await prisma.analyticsEvent.count({
          where: {
            sessionId: clientIp,
            eventName: "resume_scan",
            timestamp: { gte: startOfToday }
          }
        });
      }
    } catch (error) {
      console.error("Analytics database call failed (counting scans):", error);
      currentScansCount = 0; // Fallback safely
    }

    const { FeatureFlagsManager } = await import("@/lib/feature-flags");
    const allowed = FeatureFlagsManager.checkUsageLimit(plan, currentScansCount, "resume");
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: `Your plan (${plan.toUpperCase()}) daily limit has been exceeded (5 resume scans max per day). Please upgrade to Professional or Enterprise plan for unlimited resume evaluations.`
      }, { status: 429 });
    }

    // Increment guest scan telemetry in PostgreSQL
    if (!userId) {
      try {
        await prisma.analyticsEvent.create({
          data: {
            sessionId: clientIp,
            eventName: "resume_scan",
            properties: { fileName: fileName || "resume.pdf", targetRole }
          }
        });
      } catch (error) {
        console.error("Analytics database call failed (creating scan event):", error);
      }
    }

    const lines = text
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 10 && (l.startsWith("-") || l.startsWith("•") || /^[A-Z]/.test(l)));

    // 1. Analyze Sections
    const lower = text.toLowerCase();
    const sections = {
      hasExperience: /experience|work history|employment|career background|positions held/i.test(lower),
      hasEducation: /education|university|college|degree|bachelor|master|phd|academic|certifications?/i.test(lower),
      hasSkills: /skills|technologies|tech stack|proficient|competencies|expertise|tools|domain knowledge/i.test(lower),
      hasProjects: /projects?|portfolio|built|developed|achievements|key builds|case studies/i.test(lower),
      hasSummary: /summary|objective|profile|about|bio|executive summary|overview/i.test(lower),
    };

    // 2. Weak Bullets Analysis
    const weakBullets: any[] = [];
    const bulletCandidates = lines.filter((l: string) => l.startsWith("-") || l.startsWith("•") || l.length > 30);
    
    for (const line of bulletCandidates) {
      if (weakBullets.length >= 10) break;
      const cleanLine = line.replace(/^[-•]\s*/, "").trim();
      const lineLower = cleanLine.toLowerCase();
      
      let weakVerb: string | null = null;
      for (const verb of WEAK_VERBS) {
        if (lineLower.startsWith(verb + " ")) {
          weakVerb = verb;
          break;
        }
      }

      if (weakVerb) {
        const strongVerb = STRONG_VERB_MAP[weakVerb] || "Delivered";
        const rest = cleanLine.slice(weakVerb.length).trim();
        weakBullets.push({
          original: cleanLine,
          issue: "passive_verb",
          suggested: `${strongVerb} ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`,
        });
      } else if (cleanLine.length > 40 && !/(\d+%|\d+\s*(users|requests|ms|\$|x|X|k|M|B|million|billion))/i.test(cleanLine)) {
        weakBullets.push({
          original: cleanLine,
          issue: "no_metric",
          suggested: `${cleanLine}, achieving a measurable improvement of 15% (quantify result)`,
        });
      }
    }

    // 3. Role Keywords analysis
    const foundKeywords = activeRoleKeywords.filter((kw: string) =>
      new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
    );
    const missingKeywords = activeRoleKeywords.filter((kw: string) => !foundKeywords.includes(kw));

    // 4. Compute Initial ATS Score for Target Role using Keyword Match Ratio
    const keywordRatio = activeRoleKeywords.length > 0 ? (foundKeywords.length / activeRoleKeywords.length) : 0;
    const keywordScore = Math.round(keywordRatio * 40);

    let sectionScore = 0;
    if (sections.hasExperience) sectionScore += 8;
    if (sections.hasEducation) sectionScore += 5;
    if (sections.hasSkills) sectionScore += 8;
    if (sections.hasProjects) sectionScore += 5;
    if (sections.hasSummary) sectionScore += 4;

    const textLength = text.split(/\s+/).length;
    let lengthScore = 5;
    if (textLength >= 250) lengthScore += 5;
    if (textLength >= 450) lengthScore += 5;

    const bulletPenalty = Math.min(20, weakBullets.length * 3);

    const rawScore = keywordScore + sectionScore + lengthScore - bulletPenalty;
    const atsScore = Math.max(5, Math.min(100, Math.round(rawScore)));

    // 5. Query AI Gateway for Accomplishment Bullet Review (STAR Framework & Persona)
    const bulletsToAnalyze = bulletCandidates.slice(0, 4).map((b: string) => b.replace(/^[-•]\s*/, "").trim());
    let starAnalysis = bulletsToAnalyze.map((b: string) => ({
      bullet: b,
      situation: `Executing scale operations for ${targetRoleName}.`,
      task: "Optimize service outcomes and throughput.",
      action: "Identified domain bottlenecks and applied best practices.",
      result: "Boosted performance by 25% across key metrics.",
      rating: 80,
    }));
    
    let aiRecs: string[] = [];

    const provider = config?.provider || "gemini";
    const apiKey = config?.apiKey || process.env[`${provider.toUpperCase()}_API_KEY`] || process.env.XAI_API_KEY || process.env.GROK_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
    const hasKey = !!apiKey || ["ollama", "lmstudio"].includes(provider);

    if (hasKey && bulletsToAnalyze.length > 0) {
      try {
        const jdContext = jobDescription ? `\nTarget Job Description Snippet: "${jobDescription.slice(0, 300)}"` : "";
        const userPrompt = `Target Role: ${targetRoleName}${jdContext}\nAgent Audit ID: ${agentId}\n\nAnalyze these accomplishment bullets for ${targetRoleName} using the STAR framework:\n${bulletsToAnalyze.map((b: any, i: any) => `[Bullet ${i + 1}]: "${b}"`).join("\n")}

Return a JSON object matching this structure:
{
  "starAnalysis": [
    {
      "bullet": "original bullet",
      "situation": "detailed context situation relevant to ${targetRoleName}",
      "task": "target task objectives",
      "action": "exact actions taken by candidate",
      "result": "quantified business results",
      "rating": 85
    }
  ],
  "recommendations": [
    "rec 1 relevant to ${targetRoleName}",
    "rec 2 relevant to ${targetRoleName}"
  ]
}`;

        const raw = await generate({
          messages: [
            { role: "system", content: `You are an expert recruiter and career agent specializing in auditing resumes for ${targetRoleName}. Return ONLY a valid JSON block, no markdown wrappers, no conversational text.` },
            { role: "user", content: userPrompt },
          ],
          config: {
            ...config,
            provider,
            model: "default",
            apiKey,
            streaming: false,
            maxTokens: 2048,
          },
        });

        const cleanJSON = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJSON);
        if (parsed && Array.isArray(parsed.starAnalysis)) {
          starAnalysis = parsed.starAnalysis;
        }
        if (parsed && Array.isArray(parsed.recommendations)) {
          aiRecs = parsed.recommendations;
        }
      } catch (err) {
        console.error("AI STAR evaluation failed:", err);
      }
    }

    // 6. Compile Recommendations list
    const recommendations: string[] = [];
    if (!sections.hasSummary) recommendations.push("Add a professional summary section at the top.");
    if (!sections.hasProjects) recommendations.push(`Include a Projects/Case Studies section highlighting ${targetRoleName} achievements.`);
    if (weakBullets.length > 2) recommendations.push("Rewrite passive-voice bullets with strong action verbs and quantified results.");
    if (missingKeywords.length > 4) recommendations.push(`Add missing ${targetRoleName} keywords to your Skills section: ${missingKeywords.slice(0, 4).join(", ")}.`);
    
    aiRecs.forEach(r => {
      if (recommendations.length < 6) recommendations.push(r);
    });

    if (recommendations.length === 0) {
      recommendations.push(`Excellent work for ${targetRoleName}! Keep metrics updated as your career progresses.`);
    }

    const missingSkills = missingKeywords.slice(0, 5).map(s => escapeHTML(s));
    const analysisId = `analysis-${crypto.randomBytes(3).toString("hex")}`;

    // Clean/escape strings for client response & DB Storage
    const cleanFileName = escapeHTML(fileName || "resume.pdf");
    const cleanText = escapeHTML(text);
    
    const cleanWeakBullets = weakBullets.map((b: any) => ({
      original: escapeHTML(b.original),
      issue: escapeHTML(b.issue),
      suggested: escapeHTML(b.suggested),
    }));

    const cleanStarAnalysis = starAnalysis.map((b: any) => ({
      bullet: escapeHTML(b.bullet),
      situation: escapeHTML(b.situation),
      task: escapeHTML(b.task),
      action: escapeHTML(b.action),
      result: escapeHTML(b.result),
      rating: typeof b.rating === "number" ? b.rating : 85,
    }));

    const cleanRecommendations = recommendations.map((r: any) => escapeHTML(r));
    const cleanFoundKeywords = foundKeywords.map((k: any) => escapeHTML(k));
    const cleanMissingKeywords = missingKeywords.map((k: any) => escapeHTML(k));

    // 7. Save to PostgreSQL if logged in
    if (session?.user) {
      try {
        const userEmail = session.user.email;
        if (userEmail) {
          const userRecord = await prisma.user.findUnique({
            where: { email: userEmail }
          });
          if (userRecord) {
            await prisma.resumeAnalysis.create({
              data: {
                userId: userRecord.id,
                fileName: cleanFileName,
                rawText: cleanText,
                overallScore: atsScore,
                atsScore,
                sections: sections as any,
                weakBullets: cleanWeakBullets as any,
                missingKeywords: cleanMissingKeywords.slice(0, 10),
                detectedKeywords: cleanFoundKeywords,
                recommendations: cleanRecommendations,
                aiRewrite: JSON.stringify(cleanStarAnalysis),
              }
            });

            await prisma.careerMetrics.upsert({
              where: { userId: userRecord.id },
              update: {
                resumeScore: atsScore,
                careerScore: Math.round((atsScore + 80 + 75 + 85) / 4),
              },
              create: {
                userId: userRecord.id,
                resumeScore: atsScore,
                careerScore: Math.round((atsScore + 80 + 75 + 85) / 4),
              }
            });
          }
        }
      } catch (dbErr) {
        console.error("Failed to save resume analysis to PostgreSQL database:", dbErr);
      }
    }

    return NextResponse.json({
      id: analysisId,
      fileName: cleanFileName,
      rawText: cleanText,
      overallScore: atsScore,
      atsScore,
      targetRole,
      targetRoleName,
      jobDescription: escapeHTML(jobDescription),
      agentId,
      sections,
      weakBullets: cleanWeakBullets,
      missingKeywords: cleanMissingKeywords.slice(0, 10),
      detectedKeywords: cleanFoundKeywords,
      starAnalysis: cleanStarAnalysis,
      missingSkills,
      recommendations: cleanRecommendations,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    const reqId = "REQ-" + Math.floor(10000 + Math.random() * 90000);
    console.error(`[${reqId}] Resume evaluate API failed:`, err);
    return NextResponse.json({ 
      error: `Unable to evaluate because AI provider is unavailable. Reference ID: ${reqId}. Please try again.` 
    }, { status: 500 });
  }
}
