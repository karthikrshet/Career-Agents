// packages/ai/router.ts
import { AICompletionOptions } from "./provider";
import { routeCompletion, RouterConfig } from "../ai-router/services/router";
import { AIMessage, AIProviderId } from "../ai-router/types";

export async function generate(options: AICompletionOptions): Promise<string> {
  const providerName = String(options.config.provider || "openai").toLowerCase().trim() as AIProviderId;

  const gatewayConfig: RouterConfig = {
    mode: "balanced",
    providerOrder: [providerName],
    keys: {
      [providerName]: [options.config.apiKey || ""]
    } as any,
    baseUrls: {
      [providerName]: options.config.baseUrl || ""
    } as any,
    modelNames: {
      [providerName]: options.config.model
    } as any,
    temperature: options.config.temperature ?? 0.7,
    maxTokens: options.config.maxTokens || 4096,
    streaming: !!options.onChunk && options.config.streaming,
  };

  return routeCompletion(
    options.messages as AIMessage[],
    gatewayConfig,
    options.onChunk,
    options.signal
  );
}
