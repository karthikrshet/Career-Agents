// apps/web/src/app/api/agents/validate/route.ts
import { NextResponse } from "next/server";
import { loadAgentRegistry, resolveWorkspacePath } from "../../../../../../../packages/agents/router";
import { validateAgentRegistry } from "../../../../../../../services/agent-validation.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const registry = loadAgentRegistry();

  if (!registry.agents || registry.agents.length === 0) {
    return NextResponse.json({
      success: false,
      error: "Agent registry is empty or failed to load.",
    }, { status: 400 });
  }

  const { errors, warnings } = validateAgentRegistry(registry.agents, resolveWorkspacePath);

  return NextResponse.json({
    success: errors.length === 0,
    totalAgents: registry.agents.length,
    errors,
    warnings,
  });
}
