// apps/web/src/app/api/parse-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { extractText, extractPages, extractMetadata } from "@/lib/pdf/server";
import { indexDocument } from "packages/brain/knowledge";

export async function POST(req: NextRequest) {
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

    filename = file.name;
    size = file.size;
    mime = file.type || "application/octet-stream";

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

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
        const zip = await JSZip.loadAsync(buffer as any);
        const docXml = await zip.file("word/document.xml")?.async("text");
        text = docXml ? docXml.replace(/<[^>]+>/g, " ").trim() : "";
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
        metadata = { sheets: Object.keys(sheets) };
      } catch (err: any) {
        errors.push(`Excel parsing failed: ${err.message}`);
      }
    } else if (ext === "csv") {
      try {
        text = buffer.toString("utf-8");
        pages = [text];
      } catch (err: any) {
        errors.push(`CSV parsing failed: ${err.message}`);
      }
    } else if (ext === "zip") {
      try {
        const zip = await JSZip.loadAsync(buffer as any);
        const filesList: string[] = [];
        const configs: Record<string, string> = {};
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
          if (!extractedResumeText && ["pdf", "docx", "doc", "txt", "md", "json"].includes(innerExt)) {
            const fileBuffer = Buffer.from(await fileObj.async("arraybuffer"));
            if (innerExt === "pdf") {
              try {
                extractedResumeText = await extractText(fileBuffer);
                extractedResumeName = fn;
              } catch {}
            } else if (innerExt === "docx") {
              try {
                const docZip = await JSZip.loadAsync(fileBuffer as any);
                const docXml = await docZip.file("word/document.xml")?.async("text");
                extractedResumeText = docXml ? docXml.replace(/<[^>]+>/g, " ").trim() : "";
                extractedResumeName = fn;
              } catch {}
            } else if (["txt", "md", "json"].includes(innerExt)) {
              const rawTxt = fileBuffer.toString("utf-8");
              extractedResumeText = rawTxt;
              extractedResumeName = fn;
            }
          }
        }
        
        metadata = { filesList, configs, extractedResumeName };
        if (extractedResumeText) {
          text = extractedResumeText;
        } else {
          text = `ZIP archive file: ${file.name}. Contained ${filesList.length} files. Configs: ${Object.keys(configs).join(", ")}`;
        }
        pages = [text];
      } catch (err: any) {
        errors.push(`ZIP parsing failed: ${err.message}`);
      }
    } else if (mime.startsWith("image/")) {
      try {
        const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
        images.push({ dataUrl, name: file.name });
        text = `[Image Content: ${file.name}]`;
        pages = [text];
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
      // JSON, TXT, MD, etc.
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

    // Index the file in the RAG Knowledge Base automatically!
    if (text && text.trim().length > 0) {
      try {
        indexDocument(filename, mime, text);
      } catch (err) {
        console.error("Knowledge indexing failed", err);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      filename,
      mime,
      pages,
      text,
      images,
      metadata,
      data: metadata, // backward compatibility
      size,
      language,
      tokens,
      errors,
    });
  } catch (e: any) {
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
      errors: [e.message || "File parsing failed."],
    });
  }
}
