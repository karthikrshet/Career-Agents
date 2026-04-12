// apps/web/src/app/api/copilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig, AIMessage } from "@/types";
import { getProvider } from "@/lib/ai/provider-manager";
import fs from "fs";
import path from "path";

// Load registry dynamically from workspace root
const agentRegistryPath = path.join(process.cwd(), "../../agent-registry.json");
let agentRegistry: { agents: any[] } = { agents: [] };
try {
  agentRegistry = JSON.parse(fs.readFileSync(agentRegistryPath, "utf-8"));
} catch (err) {
  console.error("Failed to load agent-registry.json", err);
}

function findBestAgents(query: string): any[] {
  const lq = query.toLowerCase();
  const scoredAgents: { agent: any; score: number }[] = [];

  for (const agent of agentRegistry.agents) {
    let score = 0;
    const nameLower = agent.name.toLowerCase();
    const descLower = agent.description.toLowerCase();

    // Match full name
    if (lq.includes(nameLower)) {
      score += 15;
    }

    // Keyword matching
    const keywords = nameLower.split(/\s+/);
    for (const kw of keywords) {
      if (kw.length > 3 && lq.includes(kw)) score += 3;
    }

    // Match tags
    for (const tag of agent.tags || []) {
      if (lq.includes(tag.toLowerCase())) score += 2;
    }

    // Match skills
    for (const skill of agent.skills || []) {
      if (lq.includes(skill.toLowerCase())) score += 2;
    }

    if (score >= 5) {
      scoredAgents.push({ agent, score });
    }
  }

  // Sort by score descending and take top 3
  return scoredAgents
    .sort((a, b) => b.score - a.score)
    .map((s) => s.agent)
    .slice(0, 3);
}

export async function POST(req: NextRequest) {
  try {
    const { messages, config, context } = await req.json();

    const providerConfig = config as AIProviderConfig;
    const activeProvider = getProvider(providerConfig.provider);

    // 1. Context Engine Integration
    let contextPrompt = `\n\n[Candidate Portfolio Context Index]`;
    if (context) {
      const { profile, metrics, resumeAnalysis, GitHubAnalysis, linkedinAnalysis, jobApplications } = context;
      
      contextPrompt += `
Candidate Profile:
- Name: ${profile?.name || "Guest User"}
- Target Role: ${profile?.targetRole || "Software Engineer"}
- Target Company: ${profile?.targetCompany || "Not specified"}

Performance Metrics:
- Overall Career Score: ${metrics?.careerScore || 0}/100
- Resume Score: ${metrics?.resumeScore || 0}/100
- GitHub Score: ${metrics?.githubScore || 0}/100
- LinkedIn Score: ${metrics?.linkedinScore || 0}/100
- Interview Score: ${metrics?.interviewScore || 0}/100

Resume Audit:
- ATS Compatibility: ${resumeAnalysis?.atsScore || "N/A"}%
- Weak Bullets Highlighted: ${resumeAnalysis?.weakBullets ? JSON.stringify(resumeAnalysis.weakBullets.slice(0, 4)) : "None"}
- Missing Keywords: ${resumeAnalysis?.missingKeywords ? JSON.stringify(resumeAnalysis.missingKeywords) : "None"}

GitHub Portfolio:
- Public Repos: ${GitHubAnalysis?.publicRepos || 0}
- Stars Count: ${GitHubAnalysis?.totalStars || 0}
- README Quality: ${GitHubAnalysis?.readmeGrade || "N/A"}

LinkedIn Status:
- Headline Analysis: ${linkedinAnalysis?.headlineAnalysis?.current || "N/A"}
- Recruiter Visibility: ${linkedinAnalysis?.visibilityIndex || "N/A"}

Job Tracking Summary (Last 5 applications):
${jobApplications ? JSON.stringify(jobApplications.slice(0, 5)) : "No active tracker data"}
`;
    }

    // 2. Multi-Agent Router & Orchestrator
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const selectedAgents = findBestAgents(lastUserMessage);

    let thinkingIndicator = "";
    let agentPrompts = "";

    if (selectedAgents.length > 0) {
      const agentNames = selectedAgents.map((a) => `${a.name} (${a.emoji || "🤖"})`).join(", ");
      thinkingIndicator = `<thinking>Orchestrating career agent team: ${agentNames}. Merging system prompt requirements...</thinking>\n\n`;

      for (const agent of selectedAgents) {
        try {
          const agentFilePath = path.join(process.cwd(), "../../", agent.filename);
          if (fs.existsSync(agentFilePath)) {
            const rawPrompt = fs.readFileSync(agentFilePath, "utf-8");
            const cleanPrompt = rawPrompt.replace(/^---[\s\S]*?---/, "").trim();
            agentPrompts += `\n\n[Agent Role: ${agent.name}]\n${cleanPrompt}`;
          }
        } catch (err) {
          console.error(`Failed to load agent file: ${agent.filename}`, err);
        }
      }
    }

    // Construct final master system prompt
    let systemMessage = messages.find((m: any) => m.role === "system");
    const masterSystemContext = `You are Career Copilot, an AI career workspace assistant. Always use candidates' dossier metrics to deliver hyper-personalized guidance.
${contextPrompt}
${agentPrompts}`;

    if (systemMessage) {
      systemMessage.content = masterSystemContext + "\n\n" + systemMessage.content;
    } else {
      messages.unshift({
        role: "system" as const,
        content: masterSystemContext,
      });
    }

    // Verify key configured or exist in server environment variables
    const serverKey = process.env[`${providerConfig.provider.toUpperCase()}_API_KEY` || ""];
    const hasKey = !!serverKey || !!providerConfig.apiKey || ["ollama", "lmstudio"].includes(providerConfig.provider);

    if (!hasKey) {
      return NextResponse.json({
        success: false,
        provider: providerConfig.provider,
        error: "API key not configured"
      }, { status: 200 }); // return 200 with success: false to handle cleanly in UI
    }

    // Proxy stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        if (thinkingIndicator) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: thinkingIndicator } }] })}\n\n`));
        }

        try {
          await activeProvider.stream(
            messages,
            providerConfig,
            (text) => {
              const payload = {
                choices: [
                  {
                    delta: { content: text },
                  },
                ],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            }
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e: any) {
          const errPayload = {
            choices: [
              {
                delta: { content: `\n\n*Connection Issue: ${e.message || "Failed to generate response."}*` },
              },
            ],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errPayload)}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Internal server error" }, { status: 500 });
  }
}
