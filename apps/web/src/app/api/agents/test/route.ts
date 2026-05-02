// apps/web/src/app/api/agents/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loadAgentRegistry } from "../../../../../../../packages/agents/router";
import { getCachedAgentPrompt } from "../../../../../../../packages/agents/cache";
import { generate } from "../../../../../../../packages/ai/router";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { provider = "gemini", apiKey } = body;

    const registry = loadAgentRegistry();
    if (!registry.agents || registry.agents.length === 0) {
      return NextResponse.json({ success: false, error: "Registry not found" }, { status: 404 });
    }

    const testedAgents: { id: string; name: string; promptLoaded: boolean; apiVerified?: boolean; error?: string }[] = [];
    let apiVerifyCount = 0;

    // Resolve API key
    const resolvedKey = apiKey || process.env[`${provider.toUpperCase()}_API_KEY` || ""];

    for (const agent of registry.agents) {
      const prompt = getCachedAgentPrompt(agent.filename);
      const isLoaded = !!prompt && prompt.length > 50;

      const result: typeof testedAgents[0] = {
        id: agent.id,
        name: agent.name,
        promptLoaded: isLoaded,
      };

      // Test API completion for first 2 agents to verify the router works
      if (isLoaded && apiVerifyCount < 2 && resolvedKey) {
        try {
          const response = await generate({
            messages: [
              { role: "system", content: `${prompt}\nRespond with exactly "Ack: ${agent.name}"` },
              { role: "user", content: "Test ping" }
            ],
            config: {
              provider,
              model: "default",
              apiKey: resolvedKey,
              streaming: false,
              temperature: 0.1,
              maxTokens: 10,
            }
          });
          result.apiVerified = response.trim().toLowerCase().includes("ack");
          apiVerifyCount++;
        } catch (err: any) {
          result.apiVerified = false;
          result.error = err.message || "Gateway error during agent prompt execution test";
          apiVerifyCount++; // count failed tests too
        }
      }

      testedAgents.push(result);
    }

    const failedPrompts = testedAgents.filter(t => !t.promptLoaded);
    const failedApi = testedAgents.filter(t => t.apiVerified === false);

    return NextResponse.json({
      success: failedPrompts.length === 0 && failedApi.length === 0,
      totalChecked: registry.agents.length,
      testedCount: testedAgents.length,
      apiVerifiedCount: apiVerifyCount,
      failedPromptsCount: failedPrompts.length,
      failedApiCount: failedApi.length,
      results: testedAgents.slice(0, 10), // return a sample of detail results to avoid large payload
      failedPrompts,
      failedApi,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to run agent tests" }, { status: 500 });
  }
}
