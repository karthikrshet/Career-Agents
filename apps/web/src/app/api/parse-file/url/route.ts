// apps/web/src/app/api/parse-file/url/route.ts
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import { PDFParse } from "pdf-parse";
import JSZip from "jszip";
import { secureFetch, enforceRequestLimits } from "packages/security";

export async function POST(req: NextRequest) {
  try {
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp, { maxSize: 10 * 1024 * 1024 });
    if (limitResponse) return limitResponse;

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "No URL provided" });
    }

    // Secure fetch request with max response size 10MB and timeout 15s
    const response = await secureFetch(url, {
      maxResponseSize: 10 * 1024 * 1024,
      timeout: 15000,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Auto-detect extension from path or content-type
    const urlObj = new URL(url);
    let ext = urlObj.pathname.split(".").pop()?.toLowerCase();
    const contentType = response.headers.get("content-type") || "";
    
    if (!ext || ext.length > 5) {
      if (contentType.includes("pdf")) ext = "pdf";
      else if (contentType.includes("officedocument.wordprocessingml")) ext = "docx";
      else if (contentType.includes("text/markdown") || contentType.includes("text/x-markdown")) ext = "md";
      else ext = "txt";
    }

    let text = "";
    if (ext === "pdf") {
      let parser: any = null;
      try {
        parser = new PDFParse({ data: new Uint8Array(buffer) });
        const parsed = await parser.getText();
        text = parsed.text || "";
      } finally {
        if (parser && typeof parser.destroy === "function") {
          await parser.destroy().catch(() => {});
        }
      }
    } else if (ext === "docx") {
      const zip = await JSZip.loadAsync(buffer as any);
      const docXml = await zip.file("word/document.xml")?.async("text");
      text = docXml ? docXml.replace(/<[^>]+>/g, " ").trim() : "";
    } else if (ext === "odt") {
      const zip = await JSZip.loadAsync(buffer as any);
      const contentXml = await zip.file("content.xml")?.async("text");
      text = contentXml ? contentXml.replace(/<[^>]+>/g, " ").trim() : "";
    } else if (ext === "rtf") {
      const rawRtf = buffer.toString("utf-8");
      text = rawRtf.replace(/\\([a-z]{1,32})(-?\d+)? ?/g, "").replace(/\{[^}]+\}/g, "").trim();
    } else if (ext === "doc") {
      text = buffer.toString("binary").replace(/[^\x20-\x7E\s]/g, " ").replace(/\s+/g, " ").trim();
    } else {
      text = buffer.toString("utf-8");
    }

    return NextResponse.json({
      success: true,
      filename: urlObj.pathname.split("/").pop() || "downloaded-resume",
      ext,
      text,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message || "Failed to download and parse URL."
    });
  }
}
