// packages/security/safe-logger.ts

/**
 * Normalizes log inputs to prevent log injection and log forging.
 * Strips out carriage returns (CR), line feeds (LF), tabs, ANSI escape sequences,
 * and Unicode control characters.
 */
export function sanitizeLogContent(content: string): string {
  if (typeof content !== "string") return "";
  
  return content
    // Strip ANSI escape sequences (e.g. terminal colors)
    .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")
    // Strip carriage returns and line feeds to block log injection
    .replace(/[\r\n]+/g, " ")
    // Replace tabs with spaces
    .replace(/\t/g, " ")
    // Strip Unicode control characters and formatting characters
    .replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, "")
    // Trim extra spaces
    .replace(/\s+/g, " ")
    .trim();
}

export const safeLogger = {
  info(message: string, ...args: any[]) {
    const cleanMsg = sanitizeLogContent(message);
    const cleanArgs = args.map(a => typeof a === "string" ? sanitizeLogContent(a) : a);
    console.info(cleanMsg, ...cleanArgs);
  },
  warn(message: string, ...args: any[]) {
    const cleanMsg = sanitizeLogContent(message);
    const cleanArgs = args.map(a => typeof a === "string" ? sanitizeLogContent(a) : a);
    console.warn(cleanMsg, ...cleanArgs);
  },
  error(message: string, ...args: any[]) {
    const cleanMsg = sanitizeLogContent(message);
    const cleanArgs = args.map(a => typeof a === "string" ? sanitizeLogContent(a) : a);
    console.error(cleanMsg, ...cleanArgs);
  },
  log(message: string, ...args: any[]) {
    const cleanMsg = sanitizeLogContent(message);
    const cleanArgs = args.map(a => typeof a === "string" ? sanitizeLogContent(a) : a);
    console.log(cleanMsg, ...cleanArgs);
  }
};
