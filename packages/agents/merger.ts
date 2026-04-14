// packages/agents/merger.ts
export function mergeAgentOutputs(outputs: string[]): string {
  if (outputs.length === 0) return "";
  if (outputs.length === 1) return outputs[0];

  // Clean outputs and remove duplicated sentences/lines
  const linesSeen = new Set<string>();
  const mergedLines: string[] = [];

  for (const output of outputs) {
    const lines = output.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      // Keep structural blocks and headers, deduplicate text content
      if (trimmed.startsWith("#") || trimmed === "") {
        mergedLines.push(line);
      } else {
        if (!linesSeen.has(trimmed.toLowerCase())) {
          linesSeen.add(trimmed.toLowerCase());
          mergedLines.push(line);
        }
      }
    }
  }

  return mergedLines.join("\n");
}
