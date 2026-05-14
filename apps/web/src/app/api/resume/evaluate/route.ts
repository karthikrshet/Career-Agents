// apps/web/src/app/api/resume/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generate } from "../../../../../../../packages/ai/router";
import { enforceRequestLimits } from "../../../../../../../packages/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp);
    if (limitResponse) return limitResponse;

    const { text, fileName, config } = await req.json();

    if (!text) {
      return NextResponse.json({ success: false, error: "No resume text provided" }, { status: 400 });
    }

    const lines = text
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 10 && (l.startsWith("-") || l.startsWith("•") || /^[A-Z]/.test(l)));

    // 1. Analyze Sections
    const lower = text.toLowerCase();
    const sections = {
      hasExperience: /experience|work history|employment/i.test(lower),
      hasEducation: /education|university|degree|bachelor|master|phd/i.test(lower),
      hasSkills: /skills|technologies|tech stack|proficient/i.test(lower),
      hasProjects: /projects?|portfolio|built|developed/i.test(lower),
      hasSummary: /summary|objective|profile|about/i.test(lower),
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

    // 3. Keywords analysis
    const foundKeywords = ATS_KEYWORDS.filter((kw) =>
      new RegExp(`\\b${kw.replace(/[.+]/g, "\\$&")}\\b`, "i").test(text)
    );
    const missingKeywords = ATS_KEYWORDS.filter((kw) => !foundKeywords.includes(kw));

    // 4. Compute Initial ATS Score
    let score = 50;
    if (sections.hasExperience) score += 8;
    if (sections.hasEducation) score += 5;
    if (sections.hasSkills) score += 8;
    if (sections.hasProjects) score += 5;
    if (sections.hasSummary) score += 4;
    score += Math.min(10, Math.round(text.split(/\s+/).length / 60));
    score -= Math.min(20, weakBullets.length * 3);
    score -= Math.min(10, missingKeywords.length);
    const atsScore = Math.max(10, Math.min(100, score));

    // 5. Query AI Gateway for Accomplishment Bullet Review (STAR Framework)
    const bulletsToAnalyze = bulletCandidates.slice(0, 4).map((b: string) => b.replace(/^[-•]\s*/, "").trim());
    let starAnalysis = bulletsToAnalyze.map((b: string) => ({
      bullet: b,
      situation: "Executing scale optimization routines.",
      task: "Optimize service latencies and throughput.",
      action: "Identified application bottlenecks and refactored code modules.",
      result: "Boosted performance by 25% across microservices.",
      rating: 80,
    }));
    
    let aiRecs: string[] = [];

    const provider = config?.provider || "gemini";
    const apiKey = config?.apiKey || process.env[`${provider.toUpperCase()}_API_KEY` || ""];
    const hasKey = !!apiKey || ["ollama", "lmstudio"].includes(provider);

    if (hasKey && bulletsToAnalyze.length > 0) {
      try {
        const userPrompt = `Analyze these resume accomplishment bullets using the STAR framework:\n${bulletsToAnalyze.map((b: any, i: any) => `[Bullet ${i + 1}]: "${b}"`).join("\n")}

Return a JSON object matching this structure:
{
  "starAnalysis": [
    {
      "bullet": "original bullet",
      "situation": "detailed context situation (e.g. legacy codebase scaling challenges)",
      "task": "target task objectives",
      "action": "exact actions taken by candidate",
      "result": "quantified business results",
      "rating": 85
    }
  ],
  "recommendations": [
    "rec 1",
    "rec 2"
  ]
}`;

        const raw = await generate({
          messages: [
            { role: "system", content: "You are an ATS resume auditor. Return ONLY a valid JSON block, no markdown wrappers, no conversational text." },
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
    if (!sections.hasProjects) recommendations.push("Include a Projects section showcasing 2-3 key builds.");
    if (weakBullets.length > 2) recommendations.push("Rewrite passive-voice bullets with strong action verbs and quantified results.");
    if (missingKeywords.length > 4) recommendations.push(`Add missing keywords to your Skills section: ${missingKeywords.slice(0, 4).join(", ")}.`);
    
    aiRecs.forEach(r => {
      if (recommendations.length < 6) recommendations.push(r);
    });

    if (recommendations.length === 0) {
      recommendations.push("Excellent work! Focus on keeping metrics up to date as your roles progress.");
    }

    const missingSkills = missingKeywords.slice(0, 5);
    const analysisId = Math.random().toString(36).slice(2, 9);

    // 7. Save to PostgreSQL if logged in
    const session = await getServerSession(authOptions);
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
                fileName,
                rawText: text,
                overallScore: atsScore,
                atsScore,
                sections: sections as any,
                weakBullets: weakBullets as any,
                missingKeywords: missingKeywords.slice(0, 10),
                detectedKeywords: foundKeywords,
                recommendations,
                aiRewrite: JSON.stringify(starAnalysis),
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
      fileName,
      rawText: text,
      overallScore: atsScore,
      atsScore,
      sections,
      weakBullets,
      missingKeywords: missingKeywords.slice(0, 10),
      detectedKeywords: foundKeywords,
      starAnalysis,
      missingSkills,
      recommendations,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to analyze resume" }, { status: 500 });
  }
}
