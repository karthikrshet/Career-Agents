// apps/web/src/app/api/copilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { AIProviderConfig } from "@/types";
import { getProvider } from "@/lib/ai/provider-manager";
import { compileAndExecuteAgents } from "../../../../../../packages/agents/executor";

export async function POST(req: NextRequest) {
  try {
    const { messages, config, context } = await req.json();

    const providerConfig = config as AIProviderConfig;
    const activeProvider = getProvider(providerConfig.provider);

    // 1 & 2. Agent Orchestrator & Context compilation
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const { systemPrompt, thinkingIndicator } = compileAndExecuteAgents(
      lastUserMessage,
      context || {},
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
