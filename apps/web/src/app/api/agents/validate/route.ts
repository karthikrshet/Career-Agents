// apps/web/src/app/api/agents/validate/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import { loadAgentRegistry, resolveWorkspacePath } from "../../../../../../../packages/agents/router";

export const dynamic = "force-dynamic";

function parseFrontmatter(text: string): Record<string, string> {
  const match = text.match(/^---([\s\S]*?)---/);
  if (!match) return {};
  const lines = match[1].split("\n");
  const obj: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
      obj[key] = val;
    }
  }
  return obj;
}

export async function GET() {
  const registry = loadAgentRegistry();
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  if (!registry.agents || registry.agents.length === 0) {
    return NextResponse.json({
      success: false,
      error: "Agent registry is empty or failed to load.",
    }, { status: 400 });
  }

  for (const agent of registry.agents) {
    // 1. Unique ID check
    if (seenIds.has(agent.id)) {
      errors.push(`Duplicate Agent ID registered: ${agent.id}`);
    } else {
      seenIds.add(agent.id);
    }

    // 2. File existence check
    const resolvedPath = resolveWorkspacePath(agent.filename);
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`Agent file does not exist: "${agent.filename}" (ID: ${agent.id})`);
      continue;
    }

    // Read file
    const content = fs.readFileSync(resolvedPath, "utf-8");

    // 3. Frontmatter parse check
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter.id || !frontmatter.name) {
      errors.push(`Missing or invalid frontmatter (id/name) in "${agent.filename}"`);
    } else if (frontmatter.id !== agent.id) {
      errors.push(`Registry ID mismatch in "${agent.filename}": Registry says "${agent.id}", file says "${frontmatter.id}"`);
    }

    // 4. Word count check (minimum 300 words)
    const cleanBody = content.replace(/^---[\s\S]*?---/, "").trim();
    const words = cleanBody.split(/\s+/).filter(Boolean).length;
    if (words < 300) {
      warnings.push(`Agent "${agent.filename}" body word count (${words}) is below 300 words.`);
    }

    // 5. Section headings check
    const requiredHeadings = [
      "## Persona",
      "## Role & Responsibilities",
      "## Core Capabilities",
      "## Guidelines & Directives"
    ];
    for (const heading of requiredHeadings) {
      if (!content.includes(heading)) {
        errors.push(`Agent "${agent.filename}" is missing required heading section: "${heading}"`);
      }
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    totalAgents: registry.agents.length,
    errors,
    warnings,
  });
}
