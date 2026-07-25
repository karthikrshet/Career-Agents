// apps/web/src/app/api/copilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";
import { generate } from "packages/ai/router";
import fs from "fs";
import path from "path";

// Load registries dynamically at runtime
const agentRegistryPath = path.join(process.cwd(), "../../agent-registry.json");
const agentRegistry = JSON.parse(fs.readFileSync(agentRegistryPath, "utf-8"));

function findBestAgent(query: string) {
  const lq = query.toLowerCase();
  let bestAgent = null;
  let bestScore = 0;

  for (const agent of agentRegistry.agents) {
    let score = 0;
    const nameLower = agent.name.toLowerCase();

    // Exact name match or contains full name
    if (lq.includes(nameLower)) {
      score += 15;
    }

    // Keyword matches
    const nameKeywords = nameLower.split(/\s+/);
    for (const kw of nameKeywords) {
      if (kw.length > 3 && lq.includes(kw)) {
        score += 3;
      }
    }

    // Tag matches
    for (const tag of agent.tags || []) {
      if (lq.includes(tag.toLowerCase())) {
        score += 2;
      }
    }

    // Skill matches
    for (const skill of agent.skills || []) {
      if (lq.includes(skill.toLowerCase())) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestAgent = agent;
    }
  }

  // Only use if we have a reasonable confidence match
  return bestScore >= 5 ? bestAgent : null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, config }: { messages: any[]; config: AIProviderConfig } = await req.json();

    // 1. Run the Agent Planner
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const activeAgent = findBestAgent(lastUserMessage);

    let systemPromptAddition = "";
    let thinkingIndicator = "";

    if (activeAgent) {
      thinkingIndicator = `<thinking>Orchestrating specialized career agent: ${activeAgent.name} (${activeAgent.emoji || "🤖"}). Loading prompt context...</thinking>\n\n`;

      try {
        // Read prompt file from root of workspace
        const agentFilePath = path.join(process.cwd(), "../../", activeAgent.filename);
        if (fs.existsSync(agentFilePath)) {
          const rawPrompt = fs.readFileSync(agentFilePath, "utf-8");
          // Remove frontmatter if present
          const cleanPrompt = rawPrompt.replace(/^---[\s\S]*?---/, "").trim();
          systemPromptAddition = `\n\n[Active Agent Context: ${activeAgent.name}]\n${cleanPrompt}`;
        }
      } catch (e) {
        console.error("Failed to load agent prompt file:", e);
      }
    }

    // Update or inject system prompt
    let systemMessage = messages.find((m) => m.role === "system");
    if (systemMessage) {
      systemMessage.content += systemPromptAddition;
    } else {
      messages.unshift({
        role: "system",
        content: `You are Career Copilot, an AI career assistant.${systemPromptAddition}`,
      });
    }

    // Check key requirements for non-local providers
    if (!config.apiKey && !["ollama", "lmstudio"].includes(config.provider)) {
      return NextResponse.json({ error: "Missing API key in settings." }, { status: 400 });
    }

    // Return stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send thinking indicator first if we loaded an agent
        if (thinkingIndicator) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: thinkingIndicator } }] })}\n\n`));
        }

        try {
          await generate({
            messages,
            config: config as any,
            onChunk: (text) => {
              // Format chunk as standard OpenAI SSE line
              const payload = {
                choices: [
                  {
                    delta: { content: text },
                  },
                ],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            },
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e: any) {
          const errPayload = {
            choices: [
              {
                delta: { content: `\n\n*Error generating response: ${e.message || "Unknown error"}*` },
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
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
