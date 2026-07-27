// apps/web/src/app/api/copilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { processThroughBrain } from "../../../../../../packages/brain/brain";
import { routeCompletion } from "../../../../../../packages/ai-router/services/router";
import type { RouterConfig } from "../../../../../../packages/ai-router/services/router";
import { enforceRequestLimits } from "packages/security";

export async function POST(req: NextRequest) {
  try {
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp);
    if (limitResponse) return limitResponse;

    const { messages, config, context, settings: clientSettings } = await req.json();

    // 1 & 2. AI Brain Orchestrator & Context compilation
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    
    const clientState = {
      profile: context?.profile || {},
      metrics: context?.metrics || {},
      resumeAnalysis: context?.resumeAnalysis,
      GitHubAnalysis: context?.GitHubAnalysis,
      linkedinAnalysis: context?.linkedinAnalysis,
      interviewSessions: context?.interviewSessions || [],
      jobApplications: context?.jobApplications || [],
      weeklyGoals: clientSettings?.weeklyGoals || [],
      learningProgress: clientSettings?.learningProgress || {}
    };

    const { systemPrompt, thinkingIndicator } = processThroughBrain(
      lastUserMessage,
      messages,
      clientState,
      context?.enabledPlugins || {}
    );

    // Construct final master system prompt
    let systemMessage = messages.find((m: any) => m.role === "system");

    if (systemMessage) {
      systemMessage.content = systemPrompt + "\n\n" + systemMessage.content;
    } else {
      messages.unshift({
        role: "system" as const,
        content: systemPrompt,
      });
    }

    // 3. Compile Gateway Config mapping rotated keys and endpoints
    const provider = config?.provider || "openai";
    
    const gatewayConfig: RouterConfig = {
      mode: clientSettings?.routerMode || "balanced",
      providerOrder: clientSettings?.providerOrder || ["groq", "gemini", "openai", "claude"],
      keys: clientSettings?.keys || {
        [provider]: [config?.apiKey || ""]
      },
      baseUrls: clientSettings?.baseUrls || {
        [provider]: config?.baseUrl || ""
      },
      modelNames: clientSettings?.modelNames || {
        [provider]: config?.model
      },
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens || 4096,
      streaming: true,
    };

    // Proxy stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        if (thinkingIndicator) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: thinkingIndicator } }] })}\n\n`));
        }

        try {
          await routeCompletion(
            messages,
            gatewayConfig,
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
                delta: { content: `\n\n*Gateway Connection Issue: ${e.message || "Failed to generate response."}*` },
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
