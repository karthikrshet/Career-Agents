// apps/web/src/app/api/parse-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extractText, extractPages, extractMetadata } from "@/lib/pdf/server";
import { indexDocument } from "packages/brain/knowledge";
import { normalizeAndSanitize } from "packages/security";

// Polyfill DOMMatrix for serverless/node environments where browser canvas globals are missing
if (typeof global !== "undefined" && !(global as any).DOMMatrix) {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}

export async function POST(req: NextRequest) {
  const JSZip = (await import("jszip")).default;
  const errors: string[] = [];
  let filename = "uploaded-file";
  let size = 0;
  let mime = "application/octet-stream";
  
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: "No file provided", 
        errors: ["No file provided"] 
      }, { status: 400 });
    }

    // Enforce 20 MB size limit
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: "File size exceeds the 20 MB limit",
        errors: ["File size exceeds the 20 MB limit"]
      }, { status: 400 });
    }

    // Sanitize filename
    const sanitizedFilename = normalizeAndSanitize(file.name, 100);
    if (!sanitizedFilename) {
      return NextResponse.json({
        success: false,
        error: "Invalid file name",
        errors: ["Invalid file name"]
      }, { status: 400 });
    }
    filename = sanitizedFilename;
    size = file.size;
    mime = file.type || "application/octet-stream";

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = filename.split(".").pop()?.toLowerCase() || "";

    const ALLOWED_EXTENSIONS = new Set(["pdf", "docx", "pptx", "xlsx", "csv", "txt", "json", "zip", "md", "markdown"]);
    const DISALLOWED_EXTENSIONS = new Set(["exe", "bat", "cmd", "sh", "msi", "vbs", "js", "ts", "com", "scr", "pif"]);

    if (!ALLOWED_EXTENSIONS.has(ext) || DISALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({
        success: false,
        error: `File extension '.${ext}' is not allowed or is blocked.`,
        errors: [`File extension '.${ext}' is not allowed or is blocked.`]
      }, { status: 400 });
    }

    // Set correct mime if empty based on ext
    if (!file.type) {
      if (ext === "pdf") mime = "application/pdf";
      else if (ext === "docx") mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (ext === "zip") mime = "application/zip";
      else if (ext === "json") mime = "application/json";
      else if (ext === "txt") mime = "text/plain";
    }

    let text = "";
    let pages: string[] = [];
    let images: any[] = [];
    let metadata: any = {};

    if (ext === "pdf") {
      try {
        text = await extractText(buffer);
        pages = await extractPages(buffer);
        const meta = await extractMetadata(buffer);
        metadata = meta;
      } catch (err: any) {
        errors.push(`PDF parsing failed: ${err.message}`);
      }
    } else if (ext === "docx") {
      try {
        const mammoth = await import("mammoth");
        const mammothRes = await mammoth.extractRawText({ buffer });
        text = mammothRes.value;

        const htmlRes = await mammoth.convertToHtml({ buffer });
        const headings = htmlRes.value.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)?.map(h => h.replace(/<[^>]+>/g, "").trim()) || [];
        const links = htmlRes.value.match(/href="([^"]+)"/gi)?.map(l => l.slice(6, -1)) || [];
        
        metadata = { headings, links };
        pages = [text];
      } catch (err: any) {
        errors.push(`DOCX parsing failed: ${err.message}`);
      }
    } else if (ext === "odt") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const contentXml = await zip.file("content.xml")?.async("text");
        text = contentXml ? contentXml.replace(/<[^>]+>/g, " ").trim() : "";
        pages = [text];
      } catch (err: any) {
        errors.push(`ODT parsing failed: ${err.message}`);
      }
    } else if (ext === "rtf") {
      try {
        const rawRtf = buffer.toString("utf-8");
        text = rawRtf.replace(/\\([a-z]{1,32})(-?\d+)? ?/g, "").replace(/\{[^}]+\}/g, "").trim();
        pages = [text];
      } catch (err: any) {
        errors.push(`RTF parsing failed: ${err.message}`);
      }
    } else if (ext === "doc") {
      try {
        text = buffer.toString("binary").replace(/[^\x20-\x7E\s]/g, " ").replace(/\s+/g, " ").trim();
        pages = [text];
      } catch (err: any) {
        errors.push(`DOC parsing failed: ${err.message}`);
      }
    } else if (ext === "xlsx" || ext === "xls") {
      try {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);
        const sheets: Record<string, any[]> = {};
        workbook.eachSheet((sheet) => {
          const rows: any[] = [];
          sheet.eachRow((row) => {
            const rowValues = Array.isArray(row.values) ? row.values.slice(1) : row.values;
            const cleaned = (rowValues as any[]).map(v => {
              if (v && typeof v === "object" && "result" in v) return v.result;
              return v;
            });
            rows.push(cleaned);
          });
          sheets[sheet.name] = rows;
        });
        text = JSON.stringify(sheets);
        pages = [text];
        metadata = { sheets: Object.keys(sheets), tables: sheets };
      } catch (err: any) {
        errors.push(`Excel parsing failed: ${err.message}`);
      }
    } else if (ext === "csv") {
      try {
        const csvContent = buffer.toString("utf-8");
        const lines = csvContent.split(/\r?\n/).filter(Boolean);
        const rows = lines.map(line => {
          const cells: string[] = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cells.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          cells.push(current.trim());
          return cells;
        });
        text = csvContent;
        pages = [text];
        metadata = { rows };
      } catch (err: any) {
        errors.push(`CSV parsing failed: ${err.message}`);
      }
    } else if (ext === "pptx") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const slideFiles = Object.keys(zip.files).filter(fn => fn.startsWith("ppt/slides/slide") && fn.endsWith(".xml"));
        let pptxText = "";
        for (const sf of slideFiles) {
          const xml = await zip.files[sf].async("text");
          pptxText += xml.replace(/<[^>]+>/g, " ").trim() + "\n";
        }
        text = pptxText.trim();
        pages = [text];
        metadata = { slideCount: slideFiles.length };
      } catch (err: any) {
        errors.push(`PPTX parsing failed: ${err.message}`);
      }
    } else if (ext === "zip") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const filesList: string[] = [];
        const configs: Record<string, string> = {};
        const parsedTexts: string[] = [];
        let extractedResumeText = "";
        let extractedResumeName = "";
        
        for (const [fn, fileObj] of Object.entries(zip.files)) {
          if (fileObj.dir) continue;
          filesList.push(fn);
          
          const baseName = fn.toLowerCase().split("/").pop() || "";
          const targetConfigs = ["package.json", "readme.md", "requirements.txt", "dockerfile", "schema.prisma", "next.config.js"];
          
          if (targetConfigs.includes(baseName)) {
            const content = await fileObj.async("text");
            configs[fn] = content.slice(0, 10000);
          }
          
          const innerExt = baseName.split(".").pop()?.toLowerCase() || "";
          const fileBuffer = Buffer.from(await fileObj.async("arraybuffer"));
          
          let parsed = "";
          if (innerExt === "pdf") {
            try { parsed = await extractText(fileBuffer); } catch {}
          } else if (innerExt === "docx") {
            try {
              const mammoth = await import("mammoth");
              parsed = (await mammoth.extractRawText({ buffer: fileBuffer })).value;
            } catch {}
          } else if (["txt", "md", "csv", "json", "xml", "html"].includes(innerExt)) {
            parsed = fileBuffer.toString("utf-8");
          }
          
          if (parsed) {
            parsedTexts.push(`--- File: ${fn} ---\n${parsed}`);
            if (!extractedResumeText && ["pdf", "docx", "txt", "md"].includes(innerExt)) {
              extractedResumeText = parsed;
              extractedResumeName = fn;
            }
          }
        }
        
        metadata = { filesList, fileCount: filesList.length, configs, extractedResumeName };
        if (extractedResumeText) {
          text = extractedResumeText;
        } else {
          text = parsedTexts.join("\n\n") || `ZIP archive containing ${filesList.length} files.`;
        }
        pages = [text];
      } catch (err: any) {
        errors.push(`ZIP parsing failed: ${err.message}`);
      }
    } else if (mime.startsWith("image/")) {
      try {
        const sharp = (await import("sharp")).default;
        const img = sharp(buffer);
        const meta = await img.metadata();
        metadata = {
          width: meta.width,
          height: meta.height,
          format: meta.format,
          space: meta.space,
          density: meta.density,
          hasAlpha: meta.hasAlpha,
        };
        text = `Image details: ${filename} (${meta.width}x${meta.height}px, format: ${meta.format})`;
        pages = [text];
        const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
        images.push({ dataUrl, name: filename });
      } catch (err: any) {
        errors.push(`Image parsing failed: ${err.message}`);
      }
    } else if (ext === "json") {
      try {
        const jsonText = buffer.toString("utf-8");
        const jsonObj = JSON.parse(jsonText);
        
        if (jsonObj.basics || jsonObj.work || jsonObj.education || jsonObj.skills) {
          let md = `# Resume: ${jsonObj.basics?.name || "Candidate"}\n`;
          if (jsonObj.basics?.label) md += `Role: ${jsonObj.basics.label}\n`;
          if (jsonObj.basics?.email) md += `Email: ${jsonObj.basics.email}\n`;
          if (jsonObj.basics?.summary) md += `\n## Summary\n${jsonObj.basics.summary}\n`;
          
          if (Array.isArray(jsonObj.work) && jsonObj.work.length > 0) {
            md += `\n## Work Experience\n`;
            for (const job of jsonObj.work) {
              md += `### ${job.position} - ${job.name}\n`;
              md += `Period: ${job.startDate || ""} to ${job.endDate || "Present"}\n`;
              if (job.summary) md += `${job.summary}\n`;
              if (Array.isArray(job.highlights)) {
                for (const h of job.highlights) {
                  md += `- ${h}\n`;
                }
              }
            }
          }
          
          if (Array.isArray(jsonObj.education) && jsonObj.education.length > 0) {
            md += `\n## Education\n`;
            for (const edu of jsonObj.education) {
              md += `- ${edu.studyType || ""} in ${edu.area || ""}, ${edu.institution || ""} (${edu.endDate || ""})\n`;
            }
          }
          
          if (Array.isArray(jsonObj.skills) && jsonObj.skills.length > 0) {
            md += `\n## Skills\n`;
            for (const skill of jsonObj.skills) {
              md += `- **${skill.name}**: ${(skill.keywords || []).join(", ")}\n`;
            }
          }
          text = md;
        } else {
          text = JSON.stringify(jsonObj, null, 2);
        }
        pages = [text];
        metadata = jsonObj;
      } catch (err: any) {
        errors.push(`JSON Resume parsing failed: ${err.message}`);
      }
    } else {
      try {
        text = buffer.toString("utf-8");
        pages = [text];
      } catch (err: any) {
        errors.push(`Text file parsing failed: ${err.message}`);
      }
    }

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const tokens = Math.round(wordCount * 1.3);
    const language = text.toLowerCase().includes("the") || text.toLowerCase().includes("experience") ? "en" : "unknown";

    // Index parsed text directly in the persistent RAG knowledge base
    if (text && text.trim().length > 0) {
      try {
        await indexDocument(filename, mime, text);
      } catch (err) {
        console.error("Knowledge indexing failed", err);
      }
    }

    if (errors.length > 0 || !text || text.trim().length === 0) {
      console.warn("Parsing validation failed. Errors:", errors);
      return NextResponse.json({
        success: false,
        filename,
        mime,
        pages: [],
        text: "",
        images: [],
        metadata: {},
        size,
        language: "unknown",
        tokens: 0,
        errors: ["Cannot parse document. Supported formats: PDF, DOCX, TXT, Markdown."],
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      filename,
      mime,
      pages,
      text,
      images,
      metadata,
      data: metadata,
      size,
      language,
      tokens,
      errors: [],
    });
  } catch (e: any) {
    console.error("File parsing error (internal):", e);
    return NextResponse.json({
      success: false,
      filename,
      mime,
      pages: [],
      text: "",
      images: [],
      metadata: {},
      size,
      language: "unknown",
      tokens: 0,
      errors: ["Cannot parse document. Supported formats: PDF, DOCX, TXT, Markdown."],
    }, { status: 400 });
  }
}
