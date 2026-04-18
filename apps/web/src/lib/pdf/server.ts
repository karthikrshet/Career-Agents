// apps/web/src/lib/pdf/server.ts
import { PdfMetadata } from "./types";

export async function extractText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text || "";
  } finally {
    if (parser && typeof parser.destroy === "function") {
      await parser.destroy().catch(() => {});
    }
  }
}

export async function extractPages(buffer: Buffer): Promise<string[]> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.pages.map((p: any) => p.text || "");
  } finally {
    if (parser && typeof parser.destroy === "function") {
      await parser.destroy().catch(() => {});
    }
  }
}

export { extractText as parsePdfServer };

export async function extractMetadata(buffer: Buffer): Promise<PdfMetadata> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getInfo();
    return {
      info: result.info || {},
      metadata: result.metadata || null,
      fingerprints: result.fingerprints || null,
      outline: result.outline || null,
      permission: result.permission || null,
      totalPages: result.total || 0,
    };
  } finally {
    if (parser && typeof parser.destroy === "function") {
      await parser.destroy().catch(() => {});
    }
  }
}
