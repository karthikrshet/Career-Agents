import { PdfMetadata } from "./types";

/**
 * Sanitizes PDF text output, stripping away binary font garbage / Mojibake artifacts.
 */
function sanitizePdfText(text: string): string {
  if (!text) return "";
  
  // Replace non-standard binary characters with spaces
  const cleaned = text
    .replace(/[^\x20-\x7E\n\r\t\u00A0-\u00FF]/g, " ")
    // Filter out isolated garbled tokens containing weird symbols
    .split(/\s+/)
    .filter((word) => {
      // Remove tokens that are pure noise (e.g., "NfS`'£?ìH$V=³")
      const nonAsciiCount = (word.match(/[^\x20-\x7E]/g) || []).length;
      return nonAsciiCount <= word.length * 0.2;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

/**
 * Validates if the extracted text contains meaningful readable content.
 */
function isValidReadableText(text: string): boolean {
  if (!text || text.length < 30) return false;
  const words = text.split(/\s+/).filter(w => w.length > 2);
  if (words.length < 5) return false;
  
  // Check ratio of readable dictionary-like words vs symbol noise
  const alphaWords = words.filter(w => /^[a-zA-Z0-9,.:;()\-\/]+$/.test(w));
  return (alphaWords.length / words.length) >= 0.5;
}

function extractRawStringsFromPdfBuffer(buffer: Buffer): string {
  try {
    const raw = buffer.toString("binary");
    
    // Extract text blocks inside TJ/Tj operators or Parentheses
    const matches = raw.match(/\(([^()\\]|\\[\s\S])*\)\s*(TJ|Tj)/g) || raw.match(/\(([^()\\]|\\[\s\S])*\)/g);
    if (matches && matches.length > 0) {
      const extracted = matches
        .map((m) => m.replace(/^\(/, "").replace(/\)\s*(TJ|Tj)?$/, "").replace(/\\/g, ""))
        .filter((s) => s.trim().length > 1)
        .join(" ");
      const cleaned = sanitizePdfText(extracted);
      if (isValidReadableText(cleaned)) {
        return cleaned;
      }
    }
    
    // Fallback: extract plain printable ASCII text chunks
    const printable = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ");
    const words = printable.split(/\s+/).filter((w) => w.length >= 2 && /^[a-zA-Z0-9.,;:!?()'"/\-\\_+@#]+$/.test(w));
    return sanitizePdfText(words.join(" "));
  } catch {
    return "";
  }
}

export async function extractText(buffer: Buffer): Promise<string> {
  let primaryText = "";
  try {
    const pdfModule = (await import("pdf-parse")) as any;
    const pdf = pdfModule.default || pdfModule;
    const data = await pdf(buffer, {
      pagerender: (pageData: any) => {
        return pageData.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false,
        }).then((textContent: any) => {
          return textContent.items.map((item: any) => item.str).join(" ");
        });
      }
    });
    primaryText = sanitizePdfText(data.text || "");
    if (isValidReadableText(primaryText)) {
      return primaryText;
    }
  } catch (err: any) {
    console.warn("pdf-parse extraction warning:", err?.message);
  }

  const fallback = extractRawStringsFromPdfBuffer(buffer);
  if (isValidReadableText(fallback)) {
    return fallback;
  }

  if (primaryText.trim().length > 20) {
    return primaryText;
  }

  throw new Error("Unable to extract readable text from this PDF file. Please ensure it is not a scanned image PDF.");
}

export async function extractPages(buffer: Buffer): Promise<string[]> {
  try {
    const text = await extractText(buffer);
    return text.split(/\f/).map((p: string) => p.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export { extractText as parsePdfServer };

export async function extractMetadata(buffer: Buffer): Promise<PdfMetadata> {
  try {
    const pdfModule = (await import("pdf-parse")) as any;
    const pdf = pdfModule.default || pdfModule;
    const data = await pdf(buffer);
    return {
      info: data.info || {},
      metadata: data.metadata || null,
      fingerprints: null,
      outline: null,
      permission: null,
      totalPages: data.numpages || 1,
    };
  } catch {
    return {
      info: {},
      metadata: null,
      fingerprints: null,
      outline: null,
      permission: null,
      totalPages: 1,
    };
  }
}
