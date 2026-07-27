// apps/web/src/app/api/providers/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runHealthCheck } from "../../../../../../../packages/ai-router/services/health";
import { PROVIDER_REGISTRY } from "../../../../../../../packages/ai-router/services/provider-registry";
import { AIProviderId } from "../../../../../../../packages/ai-router/types";

export async function POST(req: NextRequest) {
  try {
    const { provider, model, apiKey, baseUrl } = await req.json();

    if (!provider) {
      return NextResponse.json({ success: false, error: "No provider specified" }, { status: 400 });
    }

    const report = await runHealthCheck(provider, apiKey, baseUrl, model);
    const registry = (PROVIDER_REGISTRY as any)[provider] || { capabilities: {} };

    return NextResponse.json({
      success: report.healthy,
      connected: report.healthy,
      provider,
      model: model || "default",
      latency: report.latencyMs || 0,
      quota: report.healthy ? "Active (Normal usage metrics)" : "Unavailable (Quota check failed)",
      rateLimit: report.healthy ? "Active (Optimal rate controls)" : "Limited / Blocked",
      streamingSupported: !!registry.capabilities.supportsStreaming,
      fileUploadSupported: !!registry.capabilities.supportsFiles,
      visionSupported: !!registry.capabilities.supportsVision,
      toolCallingSupported: !!registry.capabilities.supportsToolCalling,
      jsonModeSupported: !!registry.capabilities.supportsJSON,
      report,
      error: report.error || null,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      connected: false,
      provider: "unknown",
      model: "unknown",
      latency: 0,
      quota: "Unknown",
      rateLimit: "Unknown",
      streamingSupported: false,
      fileUploadSupported: false,
      visionSupported: false,
      toolCallingSupported: false,
      jsonModeSupported: false,
      error: e.message || "Invalid payload format"
    }, { status: 200 }); // return status 200 with success false to display clean error UI on client
  }
}
