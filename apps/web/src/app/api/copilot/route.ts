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

    let currentPromptCount = 0;
    try {
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
    } catch (error) {
      console.error("Analytics database call failed (counting prompts):", error);
      currentPromptCount = 0; // Fallback safely
    }

    // Unlimited Copilot access for all users
    const allowed = true;

    // Store copilot prompt telemetry event in database
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          sessionId: clientIp,
          eventName: "copilot_prompt",
          properties: { model: config?.model || "default" }
        }
      });
    } catch (error) {
      console.error("Analytics database call failed (creating prompt event):", error);
    }

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
      "lmstudio", "xai", "grok", "fireworks", "perplexity", "ai21", "openai-compat", "custom"
    ]);
    if (!ALLOWED_PROVIDERS.has(provider)) {
      return NextResponse.json({ success: false, error: "Invalid AI provider specified" }, { status: 400 });
    }
    
    const mergedKeys: Record<string, string[]> = { ...(clientSettings?.keys || {}) };
    if (config?.apiKey && config.apiKey.trim()) {
      mergedKeys[provider] = Array.from(new Set([config.apiKey, ...(mergedKeys[provider] || [])]));
      if (provider === "grok") mergedKeys["xai"] = Array.from(new Set([config.apiKey, ...(mergedKeys["xai"] || [])]));
      if (provider === "xai") mergedKeys["grok"] = Array.from(new Set([config.apiKey, ...(mergedKeys["grok"] || [])]));
    }

    const gatewayConfig: RouterConfig = {
      mode: clientSettings?.routerMode || "balanced",
      providerOrder: clientSettings?.providerOrder || ["groq", "gemini", "openai", "claude"],
      keys: mergedKeys,
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
          const reqId = "REQ-" + Math.floor(10000 + Math.random() * 90000);
          console.error(`[${reqId}] Copilot stream execution failed:`, e);
          const rawMsg = e?.message || "";
          let userMsg = `AI Gateway connection error. (Ref: ${reqId})`;
          if (rawMsg.includes("API Key is missing") || rawMsg.includes("all configured providers") || rawMsg.includes("model_not_found")) {
            userMsg = "The active AI Provider model is unavailable or misconfigured. Please switch providers to Groq/Gemini in Settings or enable Demo Mode.";
          } else if (rawMsg.includes("quota") || rawMsg.includes("429")) {
            userMsg = "API quota exceeded for active provider. Please switch providers to Groq/Gemini in Settings.";
          }

          const errPayload = {
            choices: [
              {
                delta: { content: `\n\n${userMsg}` },
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
    const reqId = "REQ-" + Math.floor(10000 + Math.random() * 90000);
    console.error(`[${reqId}] Copilot API route failed:`, e);
    return NextResponse.json({
      success: false,
      error: `Execution failed (Ref: ${reqId}). Please check AI provider settings.`
    }, { status: 500 });
  }
}
