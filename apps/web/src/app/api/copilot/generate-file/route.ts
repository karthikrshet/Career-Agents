import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import JSZip from "jszip";
import ExcelJS from "exceljs";

function cleanDocumentContent(rawContent: string): string {
  if (!rawContent) return "";
  let clean = rawContent.replace(/\[FILE_GENERATE:\s*type=["'][^"']+["']\s*filename=["'][^"']+["'](?:\s*title=["'][^"']+["'])?\]/gi, "").trim();
  
  // Remove introductory preamble lines (e.g., "Here is your ATS resume:", "Sure! Below is...")
  const lines = clean.split("\n");
  let startIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const lineLower = lines[i].toLowerCase().trim();
    if (
      lineLower.startsWith("here is") ||
      lineLower.startsWith("sure,") ||
      lineLower.startsWith("certainly!") ||
      lineLower.startsWith("i've created") ||
      lineLower.startsWith("below is") ||
      lineLower.startsWith("here's your")
    ) {
      startIndex = i + 1;
    } else {
      break;
    }
  }
  return lines.slice(startIndex).join("\n").trim();
}

function wordWrapLine(line: string, maxChars: number = 75): string[] {
  if (line.length <= maxChars) return [line];
  const words = line.split(" ");
  const result: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) result.push(current);
      current = word;
    }
  }
  if (current) result.push(current);
  return result;
}

function generateBinaryPdf(title: string, content: string): Buffer {
  const chunks: string[] = [];
  chunks.push("%PDF-1.4\n");

  const objectOffsets: number[] = [];
  const addObj = (c: string) => {
    const offset = chunks.join("").length;
    objectOffsets.push(offset);
    chunks.push(`${objectOffsets.length} 0 obj\n${c}\nendobj\n`);
  };

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const cleanText = cleanDocumentContent(content);
  const rawLines = cleanText.split("\n");

  let streamContent = `BT\n/F1 16 Tf\n50 800 Td\n(${title.replace(/\\/g, "\\\\").replace(/[\(\)]/g, "\\$&")}) Tj\n/F2 10 Tf\n0 -20 Td\n`;

  let yPosition = 780;
  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      streamContent += "0 -10 Td\n";
      yPosition -= 10;
      continue;
    }

    const isHeading = trimmed.startsWith("#");
    const plainLine = trimmed.replace(/^#+\s*/, "").replace(/[*_~`]/g, "");
    const wrappedLines = wordWrapLine(plainLine, isHeading ? 55 : 80);

    for (let i = 0; i < wrappedLines.length; i++) {
      const lineStr = wrappedLines[i].replace(/\\/g, "\\\\").replace(/[\(\)]/g, "\\$&");
      const fontChoice = isHeading ? "/F1 12 Tf" : "/F2 10 Tf";
      const fontReset = isHeading ? "/F2 10 Tf" : "";
      const leading = isHeading ? -18 : -14;

      streamContent += `${fontChoice}\n0 ${leading} Td\n(${lineStr}) Tj\n${fontReset}\n`;
      yPosition += leading;

      if (yPosition < 50) {
        break; // Keep within single page boundaries cleanly
      }
    }
  }
  streamContent += "ET";

  addObj(`<< /Length ${Buffer.byteLength(streamContent)} >>\nstream\n${streamContent}\nendstream`);

  const xrefOffset = chunks.join("").length;
  let xref = `xref\n0 ${objectOffsets.length + 1}\n0000000000 65535 f \n`;
  for (const offset of objectOffsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  chunks.push(xref);
  chunks.push(`trailer\n<< /Size ${objectOffsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return Buffer.from(chunks.join(""), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const { filename = "Document", type = "pdf", content = "", title = "Career Document" } = await req.json();
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-.]/g, "_");
    const cleanContent = cleanDocumentContent(content);

    // 1. DOCX (Word Document)
    if (type === "docx" || safeFilename.endsWith(".docx")) {
      const paragraphs: Paragraph[] = [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
      ];

      const lines = cleanContent.split("\n");
      for (const line of lines) {
        if (line.startsWith("# ")) {
          paragraphs.push(new Paragraph({ text: line.replace("# ", "").replace(/[*_~`]/g, ""), heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }));
        } else if (line.startsWith("## ")) {
          paragraphs.push(new Paragraph({ text: line.replace("## ", "").replace(/[*_~`]/g, ""), heading: HeadingLevel.HEADING_2, spacing: { before: 150, after: 80 } }));
        } else if (line.startsWith("### ")) {
          paragraphs.push(new Paragraph({ text: line.replace("### ", "").replace(/[*_~`]/g, ""), heading: HeadingLevel.HEADING_3, spacing: { before: 100, after: 60 } }));
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          paragraphs.push(new Paragraph({ text: line.replace(/^[-*]\s+/, "").replace(/[*_~`]/g, ""), bullet: { level: 0 } }));
        } else if (line.trim().length > 0) {
          paragraphs.push(new Paragraph({ children: [new TextRun(line.replace(/[*_~`]/g, ""))] }));
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });

      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeFilename.endsWith(".docx") ? safeFilename : safeFilename + ".docx"}"`,
        },
      });
    }

    // 2. EXCEL / CSV Spreadsheet
    if (type === "excel" || type === "csv" || safeFilename.endsWith(".xlsx") || safeFilename.endsWith(".csv")) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Career Data");
      
      const lines = cleanContent.split("\n").filter((l: string) => l.trim().length > 0);
      lines.forEach((line: string) => {
        const cells = line.includes(",") ? line.split(",") : line.split("\t");
        worksheet.addRow(cells.map((c: string) => c.replace(/^[-*|]\s*/, "").replace(/[*_~`]/g, "").trim()));
      });

      if (type === "csv" || safeFilename.endsWith(".csv")) {
        const csvContent = lines.map((l: string) => l.replace(/^[-*|]\s*/, "").replace(/[*_~`]/g, "").trim()).join("\n");
        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${safeFilename.endsWith(".csv") ? safeFilename : safeFilename + ".csv"}"`,
          },
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${safeFilename.endsWith(".xlsx") ? safeFilename : safeFilename + ".xlsx"}"`,
        },
      });
    }

    // 3. ZIP Archive
    if (type === "zip" || safeFilename.endsWith(".zip")) {
      const zip = new JSZip();
      zip.file("README.md", `# ${title}\n\nGenerated by Career Copilot AI.\n\n${cleanContent}`);
      zip.file("Document.txt", cleanContent);

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      return new NextResponse(new Uint8Array(zipBuffer), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${safeFilename.endsWith(".zip") ? safeFilename : safeFilename + ".zip"}"`,
        },
      });
    }

    // 4. JSON
    if (type === "json" || safeFilename.endsWith(".json")) {
      let jsonPayload: any = { title, date: new Date().toISOString(), content: cleanContent };
      try {
        jsonPayload = JSON.parse(cleanContent);
      } catch {}

      return new NextResponse(JSON.stringify(jsonPayload, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${safeFilename.endsWith(".json") ? safeFilename : safeFilename + ".json"}"`,
        },
      });
    }

    // 5. MARKDOWN / TXT
    if (type === "md" || type === "txt" || safeFilename.endsWith(".md") || safeFilename.endsWith(".txt")) {
      return new NextResponse(cleanContent, {
        headers: {
          "Content-Type": type === "md" ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeFilename}"`,
        },
      });
    }

    // 6. DEFAULT / REAL BINARY PDF DOCUMENT
    const pdfBuffer = generateBinaryPdf(title, cleanContent);
    const pdfName = safeFilename.endsWith(".pdf") ? safeFilename : `${safeFilename}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfName}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
