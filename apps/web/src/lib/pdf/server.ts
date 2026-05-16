import { PdfMetadata } from "./types";

export async function extractText(buffer: Buffer): Promise<string> {
  try {
    const pdfModule = (await import("pdf-parse")) as any;
    const pdf = pdfModule.default || pdfModule;
    const data = await pdf(buffer);
    return data.text || "";
  } catch (err: any) {
    throw new Error(`Failed to parse PDF text: ${err.message}`);
  }
}

export async function extractPages(buffer: Buffer): Promise<string[]> {
  try {
    const pdfModule = (await import("pdf-parse")) as any;
    const pdf = pdfModule.default || pdfModule;
    const data = await pdf(buffer);
    const text = data.text || "";
    // split by form feed character (page breaks) or return as single element array
    return text.split(/\f/).map((p: string) => p.trim()).filter(Boolean);
  } catch (err: any) {
    throw new Error(`Failed to parse PDF pages: ${err.message}`);
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
      totalPages: data.numpages || 0,
    };
  } catch (err: any) {
    throw new Error(`Failed to parse PDF metadata: ${err.message}`);
  }
}
