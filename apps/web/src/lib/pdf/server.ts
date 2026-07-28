import { PdfMetadata } from "./types";

export async function extractText(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = (await import("pdf-parse")) as any;
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    return textResult.text || "";
  } catch (err: any) {
    throw new Error(`Failed to parse PDF text: ${err.message}`);
  }
}

export async function extractPages(buffer: Buffer): Promise<string[]> {
  try {
    const { PDFParse } = (await import("pdf-parse")) as any;
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    return textResult.pages.map((p: any) => p.text.trim()).filter(Boolean);
  } catch (err: any) {
    throw new Error(`Failed to parse PDF pages: ${err.message}`);
  }
}

export { extractText as parsePdfServer };

export async function extractMetadata(buffer: Buffer): Promise<PdfMetadata> {
  try {
    const { PDFParse } = (await import("pdf-parse")) as any;
    const parser = new PDFParse({ data: buffer });
    const info = await parser.getInfo();
    return {
      info: info.info || {},
      metadata: info.metadata || null,
      fingerprints: info.fingerprints || null,
      outline: info.outline || null,
      permission: info.permission || null,
      totalPages: info.total || 0,
    };
  } catch (err: any) {
    throw new Error(`Failed to parse PDF metadata: ${err.message}`);
  }
}
