// packages/agents/cache.ts
import fs from "fs";
import path from "path";
import { resolveWorkspacePath } from "./router";

const promptCache: Record<string, string> = {};

export function getCachedAgentPrompt(filename: string): string {
  if (promptCache[filename]) return promptCache[filename];
  try {
    const agentFilePath = resolveWorkspacePath(filename);
    if (fs.existsSync(agentFilePath)) {
      const rawPrompt = fs.readFileSync(agentFilePath, "utf-8");
      // Remove frontmatter
      const cleanPrompt = rawPrompt.replace(/^---[\s\S]*?---/, "").trim();
      promptCache[filename] = cleanPrompt;
      return cleanPrompt;
    }
  } catch (err) {
    console.error("Failed to load prompt for", filename, err);
  }
  return "";
}

export function clearPromptCache(): void {
  for (const k in promptCache) {
    delete promptCache[k];
  }
}
