// packages/security/escape.ts

/**
 * Escapes characters for safe inclusion in HTML. Prevents Reflected & Stored XSS.
 */
export function escapeHTML(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#x27;";
      default: return m;
    }
  });
}

/**
 * Escapes special Markdown characters to prevent markdown formatting exploitation or script injection.
 */
export function escapeMarkdown(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/\\/g, "\\\\")
            .replace(/`/g, "\\`")
            .replace(/\*/g, "\\*")
            .replace(/_/g, "\\_")
            .replace(/\{/g, "\\{")
            .replace(/\}/g, "\\}")
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]")
            .replace(/\(/g, "\\(")
            .replace(/\)/g, "\\)")
            .replace(/#/g, "\\#")
            .replace(/\+/g, "\\+")
            .replace(/-/g, "\\-")
            .replace(/\./g, "\\.")
            .replace(/!/g, "\\!");
}

/**
 * Escapes special LaTeX characters to ensure correct compiling and prevent script shell executions.
 */
export function escapeLatex(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/\\/g, "\\textbackslash ")
            .replace(/%/g, "\\%")
            .replace(/\$/g, "\\$")
            .replace(/&/g, "\\&")
            .replace(/#/g, "\\#")
            .replace(/_/g, "\\_")
            .replace(/\{/g, "\\{")
            .replace(/\}/g, "\\}")
            .replace(/~/g, "\\textasciitilde ")
            .replace(/\^/g, "\\textasciicircum ");
}

/**
 * Escapes filenames to protect against Path Traversal and invalid filesystem naming schemes.
 */
export function escapeFilename(str: string): string {
  if (typeof str !== "string") return "file";
  // Remove path traversal directory indicators, control characters, and OS invalid chars
  return str.replace(/\.\./g, "")
            .replace(/[\/\\]/g, "")
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
            .trim();
}

/**
 * Escapes parameters for secure RFC 4180 CSV generation (combats CSV injection/Formula injection).
 */
export function escapeCSV(str: string): string {
  if (typeof str !== "string") return "";
  let clean = str;
  // If the cell starts with a formula character (+, -, =, @, \t, \r), prepends a single quote
  if (/^[+=@-]/g.test(clean)) {
    clean = `'${clean}`;
  }
  // Double internal quotes and wrap cell in double quotes if commas/quotes/newlines are present
  if (/[",\n\r]/.test(clean)) {
    return `"${clean.replace(/"/g, '""')}"`;
  }
  return clean;
}

/**
 * Escapes characters for valid and secure XML templates.
 */
export function escapeXML(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>&'"]/g, (m) => {
    switch (m) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return m;
    }
  });
}

/**
 * Escapes string inputs for safe inclusion in raw JSON payloads.
 */
export function escapeJSON(str: string): string {
  if (typeof str !== "string") return "";
  return JSON.stringify(str).slice(1, -1);
}

/**
 * Escapes characters for safe inclusion in HTML attributes.
 */
export function escapeAttribute(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#x27;";
      default: return m;
    }
  });
}

/**
 * Normalizes unicode, collapses spaces, removes control and null characters.
 */
export function normalizeAndSanitize(input: string, maxLength: number = 200): string {
  if (typeof input !== "string") return "";
  // 1. Normalize Unicode (NFKC)
  let clean = input.normalize("NFKC");
  // 2. Remove null bytes
  clean = clean.replace(/\x00/g, "");
  // 3. Remove control chars (\x00-\x1F and \x7F-\x9F)
  clean = clean.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  // 4. Strip dangerous unicode / characters
  clean = clean.replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, "");
  // 5. Strip dangerous characters for filesystem and command safety
  clean = clean.replace(/[\$'"\\;`|*?~<>^\(\)\[\]\{\}]/g, "");
  // 6. Trim and collapse spaces
  clean = clean.replace(/\s+/g, " ").trim();
  // 7. Max length
  return clean.slice(0, maxLength);
}
