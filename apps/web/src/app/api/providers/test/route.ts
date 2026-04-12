// apps/web/src/app/api/providers/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/ai/provider-manager";

export async function POST(req: NextRequest) {
  try {
    const { provider, model, apiKey, baseUrl } = await req.json();

    if (!provider) {
      return NextResponse.json({ success: false, error: "No provider specified" }, { status: 400 });
    }

    const adapter = getProvider(provider);
    
    // Create config object
    const config = {
      provider: provider as any,
      model: model || adapter.models[0],
      apiKey,
      baseUrl,
      temperature: 0.0,
      maxTokens: 5,
      streaming: false,
    };

    const startTime = Date.now();
    
    try {
      await adapter.chat([{ role: "user", content: "Hello" }], config);
      const latency = Date.now() - startTime;

      return NextResponse.json({
        success: true,
        connected: true,
        provider: adapter.id,
        model: config.model,
        latency,
        tokenLimit: 4096,
        supportsVision: adapter.supportsVision,
        supportsFiles: adapter.supportsFiles,
        supportsStreaming: adapter.supportsStreaming,
      });
    } catch (e: any) {
      return NextResponse.json({
        success: false,
        connected: false,
        provider: adapter.id,
        error: e.message || "Failed to establish connection to AI provider API endpoint."
      }, { status: 200 });
    }
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message || "Invalid payload format"
    }, { status: 500 });
  }
}
