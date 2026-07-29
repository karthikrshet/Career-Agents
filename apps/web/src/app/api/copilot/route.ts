// apps/web/src/app/api/copilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { processThroughBrain } from "../../../../../../packages/brain/brain";
import { routeCompletion } from "../../../../../../packages/ai-router/services/router";
import type { RouterConfig } from "../../../../../../packages/ai-router/services/router";
import { enforceRequestLimits } from "packages/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp, { isUser: !!session?.user });
    if (limitResponse) return limitResponse;

    const { messages, config, context, settings: clientSettings } = await req.json();

    // Server-side usage limits gating check
    let plan: "guest" | "free" | "pro" | "team" | "enterprise" = "guest";
    let userId: string | null = null;

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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let currentPromptCount = 0;
    if (userId) {
      currentPromptCount = await prisma.analyticsEvent.count({
        where: {
          userId,
          eventName: "copilot_prompt",
          timestamp: { gte: startOfToday }
        }
      });
    } else {
      currentPromptCount = await prisma.analyticsEvent.count({
        where: {
          sessionId: clientIp,
          eventName: "copilot_prompt",
          timestamp: { gte: startOfToday }
        }
      });
    }

    const { FeatureFlagsManager } = await import("@/lib/feature-flags");
    const allowed = FeatureFlagsManager.checkUsageLimit(plan, currentPromptCount, "copilot");
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: `Your plan (${plan.toUpperCase()}) daily limit has been exceeded (20 prompts max per day). Please upgrade to Professional or Enterprise plan for unlimited Copilot chats.`
      }, { status: 429 });
    }

    // Store copilot prompt telemetry event in database
    await prisma.analyticsEvent.create({
      data: {
        userId,
        sessionId: clientIp,
        eventName: "copilot_prompt",
        properties: { model: config?.model || "default" }
      }
    });

    // 1 & 2. AI Brain Orchestrator & Context compilation
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    
    // Check internetMode toggle and fetch search results
    let webCitations = "";
    if (clientSettings?.internetMode) {
      try {
        const { searchInternet, formatSearchCitations } = await import("../../../../../../packages/brain/brain");
        const searchResults = await searchInternet(lastUserMessage);
        webCitations = formatSearchCitations(searchResults);
      } catch (err) {
        console.error("Failed to run web search", err);
      }
    }

    const clientState = {
      profile: context?.profile || {},
      metrics: context?.metrics || {},
      resumeAnalysis: clientSettings?.memoryEnabled !== false ? context?.resumeAnalysis : null,
      GitHubAnalysis: clientSettings?.memoryEnabled !== false ? context?.GitHubAnalysis : null,
      linkedinAnalysis: clientSettings?.memoryEnabled !== false ? context?.linkedinAnalysis : null,
      interviewSessions: clientSettings?.memoryEnabled !== false ? (context?.interviewSessions || []) : [],
      jobApplications: clientSettings?.memoryEnabled !== false ? (context?.jobApplications || []) : [],
      weeklyGoals: clientSettings?.weeklyGoals || [],
      learningProgress: clientSettings?.learningProgress || {},
      activeModel: config?.model || "default",
      activeProvider: config?.provider || "default"
    };

    // 3. Compile Gateway Config mapping rotated keys and endpoints
    const provider = String(config?.provider || "openai").toLowerCase().trim();
    const ALLOWED_PROVIDERS = new Set([
      "openai", "anthropic", "claude", "gemini", "groq", "openrouter",
      "together", "deepseek", "mistral", "cohere", "azure", "ollama",
      "lmstudio", "xai", "fireworks", "perplexity", "ai21", "openai-compat", "custom"
    ]);
    if (!ALLOWED_PROVIDERS.has(provider)) {
      return NextResponse.json({ success: false, error: "Invalid AI provider specified" }, { status: 400 });
    }
    
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
      retryCount: clientSettings?.retryCount ?? 3,
      retryDelayMs: clientSettings?.retryDelayMs ?? 1000,
      demoMode: clientSettings?.demoMode || config?.demoMode || false,
    };

    let { systemPrompt, thinkingIndicator } = await processThroughBrain(
      lastUserMessage,
      messages,
      clientState,
      context?.enabledPlugins || {},
      gatewayConfig
    );

    if (webCitations) {
      systemPrompt += webCitations;
    }

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
