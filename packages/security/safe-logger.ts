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

/**
 * Scans strings and objects to redact credentials (passwords, cookies, JWTs, API keys).
 */
export function redactSensitiveData(input: any): any {
  if (typeof input === "string") {
    return input
      .replace(/(bearer\s+)[a-zA-Z0-9_\-\.]+/ig, "$1[REDACTED]")
      .replace(/(api[-_]?key\s*[:=]\s*)['"]?[a-zA-Z0-9_\-\.]+['"]?/ig, "$1[REDACTED]")
      .replace(/(password\s*[:=]\s*)['"]?[^'"]+['"]?/ig, "$1[REDACTED]")
      .replace(/(secret\s*[:=]\s*)['"]?[a-zA-Z0-9_\-\.]+['"]?/ig, "$1[REDACTED]")
      .replace(/(jwt\s*[:=]\s*)['"]?[a-zA-Z0-9_\-\.]+/ig, "$1[REDACTED]");
  }
  
  if (Array.isArray(input)) {
    return input.map(redactSensitiveData);
  }
  
  if (input !== null && typeof input === "object") {
    const redacted: Record<string, any> = {};
    const sensitiveKeys = [
      "password", "passwd", "secret", "apikey", "api_key", "authorization", 
      "cookie", "jwt", "token", "bearer", "sessionid", "session_id", "sk_", "key"
    ];
    
    for (const [key, val] of Object.entries(input)) {
      const lowerKey = key.toLowerCase();
      let isSensitive = false;
      for (const sk of sensitiveKeys) {
        if (lowerKey.includes(sk)) {
          isSensitive = true;
          break;
        }
      }
      
      if (isSensitive) {
        redacted[key] = "[REDACTED]";
      } else {
        redacted[key] = redactSensitiveData(val);
      }
    }
    return redacted;
  }
  
  return input;
}

export const safeLogger = {
  info(message: string, ...args: any[]) {
    const cleanMsg = redactSensitiveData(sanitizeLogContent(message));
    const cleanArgs = args.map(a => {
      const redacted = redactSensitiveData(a);
      return typeof redacted === "string" ? sanitizeLogContent(redacted) : redacted;
    });
    console.info(cleanMsg, ...cleanArgs);
  },
  warn(message: string, ...args: any[]) {
    const cleanMsg = redactSensitiveData(sanitizeLogContent(message));
    const cleanArgs = args.map(a => {
      const redacted = redactSensitiveData(a);
      return typeof redacted === "string" ? sanitizeLogContent(redacted) : redacted;
    });
    console.warn(cleanMsg, ...cleanArgs);
  },
  error(message: string, ...args: any[]) {
    const cleanMsg = redactSensitiveData(sanitizeLogContent(message));
    const cleanArgs = args.map(a => {
      const redacted = redactSensitiveData(a);
      return typeof redacted === "string" ? sanitizeLogContent(redacted) : redacted;
    });
    console.error(cleanMsg, ...cleanArgs);
  },
  log(message: string, ...args: any[]) {
    const cleanMsg = redactSensitiveData(sanitizeLogContent(message));
    const cleanArgs = args.map(a => {
      const redacted = redactSensitiveData(a);
      return typeof redacted === "string" ? sanitizeLogContent(redacted) : redacted;
    });
    console.log(cleanMsg, ...cleanArgs);
  }
};
