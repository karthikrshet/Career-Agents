// packages/ai-router/services/token-optimizer.ts
import { AIMessage } from "../types";

export type CompressionLevel = "none" | "low" | "medium" | "aggressive";

export interface OptimizationResult {
  optimizedMessages: AIMessage[];
  originalTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
  savingsPercentage: number;
}

/**
 * Fast heuristic token estimation (1 token ≈ 4 characters for English / Code).
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Strip redundant boilerplate, whitespace, repeated newlines, and ASCII decorative borders.
 */
export function minifyPromptText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/={5,}/g, "===")
    .replace(/-{5,}/g, "---")
    .replace(/\*{5,}/g, "***")
    .trim();
}

/**
 * Summarize or compress older assistant messages in multi-turn history.
 * Retains system prompt and latest N turns completely intact,
 * while trimming older assistant responses to concise bullet highlights.
 */
export function optimizeMessages(
  messages: AIMessage[],
  level: CompressionLevel = "aggressive"
): OptimizationResult {
  if (level === "none" || !messages || messages.length === 0) {
    const rawLen = messages.reduce((acc, m) => acc + estimateTokens(m.content), 0);
    return {
      optimizedMessages: messages,
      originalTokens: rawLen,
      optimizedTokens: rawLen,
      tokensSaved: 0,
      savingsPercentage: 0,
    };
  }

  const originalTokens = messages.reduce((acc, m) => acc + estimateTokens(m.content), 0);

  // Configuration thresholds by level
  const maxHistoryTurns = level === "aggressive" ? 3 : level === "medium" ? 6 : 10;
  const maxOldAssistantChars = level === "aggressive" ? 180 : level === "medium" ? 350 : 600;

  const systemMessage = messages.find((m) => m.role === "system");
  const nonSystemMessages = messages.filter((m) => m.role !== "system");

  // Keep latest turns intact
  const recentTurns = nonSystemMessages.slice(-maxHistoryTurns);
  const olderTurns = nonSystemMessages.slice(0, -maxHistoryTurns);

  const optimizedOlderTurns: AIMessage[] = olderTurns.map((msg) => {
    if (msg.role === "assistant") {
      const minified = minifyPromptText(msg.content);
      if (minified.length > maxOldAssistantChars) {
        // Take first heading or first few sentences
        const truncated = minified.slice(0, maxOldAssistantChars) + "... [context compressed]";
        return { role: "assistant", content: truncated };
      }
      return { role: "assistant", content: minified };
    }
    return { role: msg.role, content: minifyPromptText(msg.content) };
  });

  const optimizedRecentTurns: AIMessage[] = recentTurns.map((msg) => ({
    role: msg.role,
    content: minifyPromptText(msg.content),
  }));

  const resultMessages: AIMessage[] = [];

  if (systemMessage) {
    resultMessages.push({
      role: "system",
      content: minifyPromptText(systemMessage.content),
    });
  }

  resultMessages.push(...optimizedOlderTurns, ...optimizedRecentTurns);

  const optimizedTokens = resultMessages.reduce((acc, m) => acc + estimateTokens(m.content), 0);
  const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
  const savingsPercentage = originalTokens > 0 ? Math.round((tokensSaved / originalTokens) * 100) : 0;

  return {
    optimizedMessages: resultMessages,
    originalTokens,
    optimizedTokens,
    tokensSaved,
    savingsPercentage,
  };
}
