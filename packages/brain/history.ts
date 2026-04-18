// packages/brain/history.ts
import { BrainMessage } from "./types";

export function formatConversationHistory(history: BrainMessage[]): string {
  if (!history || history.length === 0) return "";
  
  return history
    .map(m => {
      const contentStr = typeof m.content === "string" 
        ? m.content 
        : Array.isArray(m.content)
          ? m.content.map(p => typeof p === "string" ? p : p.text || "").join(" ")
          : "";
      return `${m.role.toUpperCase()}: ${contentStr}`;
    })
    .join("\n\n");
}
