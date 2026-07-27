// apps/web/src/lib/pdf/server.ts

export async function parsePdfServer(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  let parser: any = null;
  try {
    parser = new PDFParse({ data: new Uint8Array(buffer) });
    const parsed = await parser.getText();
    return parsed.text || "";
  } finally {
    if (parser && typeof parser.destroy === "function") {
      await parser.destroy().catch(() => {});
    }
  }
}
