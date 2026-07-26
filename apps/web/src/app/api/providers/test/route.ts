// apps/web/src/app/api/providers/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runHealthCheck } from "../../../../../../../packages/ai-router/services/health";

export async function POST(req: NextRequest) {
  try {
    const { provider, model, apiKey, baseUrl } = await req.json();

    if (!provider) {
      return NextResponse.json({ success: false, error: "No provider specified" }, { status: 400 });
    }

    const report = await runHealthCheck(provider, apiKey, baseUrl, model);

    return NextResponse.json({
      success: report.healthy,
      connected: report.healthy,
      provider,
      model: model || "default",
      latency: report.latencyMs || 0,
      report,
      error: report.error || "Failed dynamic completion diagnostics check.",
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message || "Invalid payload format"
    }, { status: 500 });
  }
}
