// packages/brain/summary.ts
import { BrainMessage } from "./types";

export function summarizeHistory(history: BrainMessage[]): string {
  if (!history || history.length === 0) return "";
  
  const userMessages = history.filter(m => m.role === "user");
  const topics = userMessages
    .map(m => {
      const content = typeof m.content === "string" ? m.content : "";
      return content.split(/\s+/).slice(0, 3).join(" ");
    })
    .filter(Boolean);

  return `Previous discussion overview covers candidate inquiries regarding: ${topics.slice(0, 5).join(", ")}.`;
}
