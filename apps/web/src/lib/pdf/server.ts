// apps/web/src/lib/pdf/server.ts
import { PdfMetadata } from "./types";

export async function extractText(buffer: Buffer): Promise<string> {
  try {
    const pdfImport = (await import("pdf-parse")) as any;
    const pdf = pdfImport.default || pdfImport;
    const data = await pdf(buffer);
    return data.text || "";
  } catch (err: any) {
    throw new Error(`Failed to parse PDF text: ${err.message}`);
  }
}

export async function extractPages(buffer: Buffer): Promise<string[]> {
  try {
    const pdfImport = (await import("pdf-parse")) as any;
    const pdf = pdfImport.default || pdfImport;
    const data = await pdf(buffer);
    const text = data.text || "";
    const pages = text.split(/\u000c/);
    return pages.map((p: string) => p.trim()).filter(Boolean);
  } catch (err: any) {
    throw new Error(`Failed to parse PDF pages: ${err.message}`);
  }
}

export { extractText as parsePdfServer };

export async function extractMetadata(buffer: Buffer): Promise<PdfMetadata> {
  try {
    const pdfImport = (await import("pdf-parse")) as any;
    const pdf = pdfImport.default || pdfImport;
    const data = await pdf(buffer);
    return {
      info: data.info || {},
      metadata: data.metadata || null,
      fingerprints: null,
      outline: null,
      permission: null,
      totalPages: data.numpages || 0,
    };
  } catch (err: any) {
    throw new Error(`Failed to parse PDF metadata: ${err.message}`);
  }
}
