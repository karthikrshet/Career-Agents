// apps/web/src/app/api/parse-file/route.ts
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import pdfParser from "pdf-parse";
import ExcelJS from "exceljs";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase();

    let text = "";
    let data: any = null;

    if (ext === "pdf") {
      try {
        const parsed = await pdfParser(buffer as any);
        text = parsed.text || "";
        data = { type: "pdf", textLength: text.length };
      } catch (err: any) {
        throw new Error(`PDF Parsing failed: ${err.message}`);
      }
    } else if (ext === "docx") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const docXml = await zip.file("word/document.xml")?.async("text");
        text = docXml ? docXml.replace(/<[^>]+>/g, " ").trim() : "";
        data = { type: "docx", textLength: text.length };
      } catch (err: any) {
        throw new Error(`DOCX Parsing failed: ${err.message}`);
      }
    } else if (ext === "odt") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const contentXml = await zip.file("content.xml")?.async("text");
        text = contentXml ? contentXml.replace(/<[^>]+>/g, " ").trim() : "";
        data = { type: "odt", textLength: text.length };
      } catch (err: any) {
        throw new Error(`ODT Parsing failed: ${err.message}`);
      }
    } else if (ext === "rtf") {
      try {
        const rawRtf = buffer.toString("utf-8");
        text = rawRtf.replace(/\\([a-z]{1,32})(-?\d+)? ?/g, "").replace(/\{[^}]+\}/g, "").trim();
        data = { type: "rtf", textLength: text.length };
      } catch (err: any) {
        throw new Error(`RTF Parsing failed: ${err.message}`);
      }
    } else if (ext === "doc") {
      try {
        // Strip non-printable ASCII characters for basic .doc extraction
        text = buffer.toString("binary").replace(/[^\x20-\x7E\s]/g, " ").replace(/\s+/g, " ").trim();
        data = { type: "doc", textLength: text.length };
      } catch (err: any) {
        throw new Error(`DOC Parsing failed: ${err.message}`);
      }
    } else if (ext === "xlsx" || ext === "xls") {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);

        const sheets: Record<string, any[]> = {};
        workbook.eachSheet((sheet) => {
          const rows: any[] = [];
          sheet.eachRow((row) => {
            // exceljs rows are 1-indexed, values can be array
            const rowValues = Array.isArray(row.values) ? row.values.slice(1) : row.values;
            // Clean values (formulas, objects, etc.)
            const cleaned = (rowValues as any[]).map(v => {
              if (v && typeof v === "object" && "result" in v) return v.result;
              return v;
            });
            rows.push(cleaned);
          });
          sheets[sheet.name] = rows;
        });

        data = { type: "excel", sheets };
        text = JSON.stringify(sheets);
      } catch (err: any) {
        throw new Error(`Excel Parsing failed: ${err.message}`);
      }
    } else if (ext === "csv") {
      text = buffer.toString("utf-8");
      const rows = text.split("\n").map((line) => line.split(",").map(c => c.trim()));
      data = { type: "excel", sheets: { default: rows } };
    } else if (ext === "zip") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const filesList: string[] = [];
        const configs: Record<string, string> = {};

        // Find relevant config files in ZIP
        for (const [filename, fileObj] of Object.entries(zip.files)) {
          if (fileObj.dir) continue;
          filesList.push(filename);

          const lowerName = filename.toLowerCase();
          const baseName = lowerName.split("/").pop() || "";

          const targetConfigs = [
            "package.json",
            "readme.md",
            "requirements.txt",
            "dockerfile",
            "schema.prisma",
            "next.config.js",
            "next.config.mjs",
          ];

          if (targetConfigs.includes(baseName) || baseName.includes("workflow")) {
            const content = await fileObj.async("text");
            configs[filename] = content.slice(0, 10000); // cap text to 10kb
          }
        }

        data = {
          type: "zip",
          filesList: filesList.slice(0, 100), // cap directory listings
          configs,
        };
        text = `ZIP archive file: ${file.name}. Contained ${filesList.length} files. Configs extracted: ${Object.keys(configs).join(", ")}`;
      } catch (err: any) {
        throw new Error(`ZIP Archive Extraction failed: ${err.message}`);
      }
    } else {
      // MD, TXT, JSON, CSV, Source Code files
      text = buffer.toString("utf-8");
      data = { type: "text", textLength: text.length };
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      ext,
      text,
      data,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message || "File parsing failed."
    }, { status: 200 }); // return 200 with success: false to match schema errors gracefully
  }
}
