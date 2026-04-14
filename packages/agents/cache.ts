// packages/agents/cache.ts
import fs from "fs";
import path from "path";

const promptCache: Record<string, string> = {};

export function getCachedAgentPrompt(filename: string): string {
  if (promptCache[filename]) {
    return promptCache[filename];
  }

  try {
    const agentFilePath = path.join(process.cwd(), "../../", filename);
    if (fs.existsSync(agentFilePath)) {
      const rawPrompt = fs.readFileSync(agentFilePath, "utf-8");
      // Remove YAML frontmatter cleanly
      const cleanPrompt = rawPrompt.replace(/^---[\s\S]*?---/, "").trim();
      promptCache[filename] = cleanPrompt;
      return cleanPrompt;
    }
  } catch (err) {
    console.error(`Failed to read agent prompt file: ${filename}`, err);
  }

  return "";
}

export function clearPromptCache(): void {
  for (const key in promptCache) {
    delete promptCache[key];
  }
}
