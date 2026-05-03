// apps/web/src/app/api/providers/health/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runHealthCheck } from "../../../../../../../packages/ai-router/services/health";
import { PROVIDER_REGISTRY } from "../../../../../../../packages/ai-router/services/provider-registry";
import { fetchAvailableModels } from "../../../../../../../packages/ai-router/services/discovery";
import { AIProviderId } from "../../../../../../../packages/ai-router/types";

const ENV_KEY_MAP: Record<string, string> = {
  openai: "OPENAI_API_KEY",
  claude: "ANTHROPIC_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  mistral: "MISTRAL_API_KEY",
  cohere: "COHERE_API_KEY",
  together: "TOGETHER_API_KEY",
  xai: "XAI_API_KEY",
  azure: "AZURE_OPENAI_API_KEY",
};

function mapReportStatusToUserLabel(status: string): string {
  const mapping: Record<string, string> = {
    connected: "Connected",
    healthy: "Connected",
    offline: "Offline",
    missing_key: "Missing API Key",
    invalid_key: "Invalid Key",
    quota_exceeded: "Quota Exceeded",
    rate_limited: "Rate Limited",
    auth_failed: "Authentication Failed",
    model_not_found: "Model Not Found",
    unavailable: "Offline",
  };
  return mapping[status] || "Offline";
}

async function handleHealthRequest(provider: AIProviderId, apiKey?: string, baseUrl?: string, model?: string) {
  const registry = PROVIDER_REGISTRY[provider];
  if (!registry) {
    return NextResponse.json({ error: `Provider ${provider} is not supported.` }, { status: 400 });
  }

  // Resolve API key
  let resolvedKey = apiKey;
  if (!resolvedKey && registry.authType !== "none") {
    const envVar = ENV_KEY_MAP[provider];
    resolvedKey = envVar ? process.env[envVar] : undefined;
  }

  const report = await runHealthCheck(provider, resolvedKey, baseUrl, model);
  
  // Discover available models
  let availableModels: string[] = [];
  try {
    availableModels = await fetchAvailableModels(provider, resolvedKey, baseUrl);
  } catch {}

  const statusLabel = mapReportStatusToUserLabel(report.status);

  return NextResponse.json({
    provider,
    status: statusLabel,
    latency: report.latencyMs || 0,
    authenticated: report.healthy,
    availableModels,
    contextWindow: registry.maxContext,
    supportsVision: !!registry.capabilities.supportsVision,
    supportsStreaming: !!registry.capabilities.supportsStreaming,
    supportsTools: !!registry.capabilities.supportsToolCalling,
    report,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey, baseUrl, model } = await req.json();
    if (!provider) {
      return NextResponse.json({ error: "provider is required" }, { status: 400 });
    }
    return await handleHealthRequest(provider, apiKey, baseUrl, model);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const provider = searchParams.get("provider") as AIProviderId;
    const apiKey = searchParams.get("apiKey") || undefined;
    const baseUrl = searchParams.get("baseUrl") || undefined;
    const model = searchParams.get("model") || undefined;

    if (!provider) {
      return NextResponse.json({ error: "provider query param is required" }, { status: 400 });
    }
    return await handleHealthRequest(provider, apiKey, baseUrl, model);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process request" }, { status: 500 });
  }
}
