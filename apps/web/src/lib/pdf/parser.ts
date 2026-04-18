// apps/web/src/lib/pdf/parser.ts
import { PdfMetadata } from "./types";

export async function parsePdfToText(bufferOrFile: any): Promise<string> {
  if (typeof window !== "undefined") {
    // Browser parser context stub
    return "";
  } else {
    // Server parser context (Buffer)
    const { extractText } = await import("./server");
    return extractText(bufferOrFile);
  }
}

export async function parsePdfToPages(bufferOrFile: any): Promise<string[]> {
  if (typeof window !== "undefined") {
    return [];
  } else {
    const { extractPages } = await import("./server");
    return extractPages(bufferOrFile);
  }
}

export async function parsePdfToMetadata(bufferOrFile: any): Promise<PdfMetadata | null> {
  if (typeof window !== "undefined") {
    return null;
  } else {
    const { extractMetadata } = await import("./server");
    return extractMetadata(bufferOrFile);
  }
}

export * from "./types";
