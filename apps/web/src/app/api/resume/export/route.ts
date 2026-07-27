// apps/web/src/app/api/resume/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export async function POST(req: NextRequest) {
  try {
    const { format, analysis } = await req.json();

    if (!analysis) {
      return NextResponse.json({ success: false, error: "No analysis data provided" }, { status: 400 });
    }

    const dateStr = new Date(analysis.analyzedAt || Date.now()).toLocaleDateString();

    if (format === "markdown") {
      const md = `# ATS Resume Analysis Report\n\n` +
        `**File:** ${analysis.fileName}\n` +
        `**Date:** ${dateStr}\n` +
        `**Overall ATS Score:** ${analysis.overallScore}/100\n\n` +
        `## Section Audit\n` +
        Object.entries(analysis.sections || {})
          .map(([k, v]) => `- **${k}**: ${v ? "✓ Present" : "✗ Missing"}`)
          .join("\n") +
        `\n\n## Missing Keywords\n` +
        (analysis.missingKeywords?.join(", ") || "None") +
        `\n\n## Recommendations\n` +
        (analysis.recommendations?.map((r: string) => `- ${r}`).join("\n") || "None") +
        `\n\n## STAR Impact Bullets Analysis\n` +
        (analysis.starAnalysis?.map((s: any) => 
          `### Rating: ${s.rating}/10\n` +
          `- **Original:** ${s.bullet}\n` +
          `- **Situation/Task:** ${s.situation}\n` +
          `- **Action:** ${s.action}\n` +
          `- **Result:** ${s.result}`
        ).join("\n\n") || "None") + "\n";

      return new NextResponse(md, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="ats-report-${Date.now()}.md"`
        }
      });
    }

    if (format === "json") {
      return new NextResponse(JSON.stringify(analysis, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="ats-report-${Date.now()}.json"`
        }
      });
    }

    if (format === "html") {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ATS Resume Analysis Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #0b0f19; color: #f1f5f9; }
    h1 { color: #38bdf8; border-bottom: 2px solid #1e293b; padding-bottom: 12px; }
    h2 { color: #818cf8; margin-top: 24px; }
    .metric { font-size: 24px; font-weight: bold; color: #10b981; }
    ul { line-height: 1.6; }
    li { margin-bottom: 8px; }
    .card { background: #111827; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>ATS Resume Analysis Report</h1>
  <p><strong>File Name:</strong> ${analysis.fileName}</p>
  <p><strong>Date Analyzed:</strong> ${dateStr}</p>
  <p><strong>Overall ATS Score:</strong> <span class="metric">${analysis.overallScore}/100</span></p>

  <h2>Section Audit</h2>
  <ul>
    ${Object.entries(analysis.sections || {}).map(([k, v]) => `<li><strong>${k}</strong>: ${v ? "✓ Present" : "✗ Missing"}</li>`).join("")}
  </ul>

  <h2>Missing Keywords</h2>
  <div class="card">${analysis.missingKeywords?.join(", ") || "None identified"}</div>

  <h2>Recommendations</h2>
  <ul>
    ${analysis.recommendations?.map((r: string) => `<li>${r}</li>`).join("") || "<li>None</li>"}
  </ul>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="ats-report-${Date.now()}.html"`
        }
      });
    }

    if (format === "latex") {
      const latex = `% LaTeX Resume Export Template\n` +
        `\\documentclass[letterpaper,11pt]{article}\n` +
        `\\usepackage[empty]{fullpage}\n` +
        `\\usepackage{titlesec}\n` +
        `\\usepackage{hyperref}\n` +
        `\\begin{document}\n` +
        `\\begin{center}\n` +
        `  {\\Huge \\scshape Candidate Name} \\\\\n` +
        `  \\href{mailto:email@domain.com}{email@domain.com} | Phone | GitHub | LinkedIn\n` +
        `\\end{center}\n\n` +
        `\\section{Summary}\n` +
        `ATS Score: ${analysis.overallScore}/100. Optimized for keywords including: ${analysis.detectedKeywords?.slice(0, 10).join(", ") || ""}.\n\n` +
        `\\section{Skills}\n` +
        ` ${analysis.detectedKeywords?.join(", ") || ""}\n\n` +
        `\\section{Experience}\n` +
        `\\textbf{Software Engineer} \\\\ \n` +
        `Tech Corp \\hfill City, State \\\\\n` +
        `\\begin{itemize}\n` +
        (analysis.starAnalysis?.map((s: any) => `  \\item ${s.bullet}`).join("\n") || "  \\item Developed scalable services and APIs.") +
        `\n\\end{itemize}\n` +
        `\\end{document}\n`;

      return new NextResponse(latex, {
        headers: {
          "Content-Type": "application/x-latex",
          "Content-Disposition": `attachment; filename="resume-${Date.now()}.tex"`
        }
      });
    }

    if (format === "doc" || format === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "ATS Resume Analysis Report",
                heading: HeadingLevel.TITLE
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `File: ${analysis.fileName}`, bold: true }),
                  new TextRun({ text: `\nDate: ${dateStr}` }),
                  new TextRun({ text: `\nOverall ATS Score: ${analysis.overallScore}/100\n\n`, color: "10b981", bold: true })
                ]
              }),
              new Paragraph({
                text: "Section Audit",
                heading: HeadingLevel.HEADING_2
              }),
              ...Object.entries(analysis.sections || {}).map(([k, v]) => 
                new Paragraph({
                  text: `• ${k}: ${v ? "Present" : "Missing"}`
                })
              ),
              new Paragraph({
                text: "\nMissing Keywords",
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                text: analysis.missingKeywords?.join(", ") || "None"
              }),
              new Paragraph({
                text: "\nRecommendations",
                heading: HeadingLevel.HEADING_2
              }),
              ... (analysis.recommendations || []).map((r: string) => 
                new Paragraph({
                  text: `• ${r}`
                })
              )
            ]
          }
        ]
      });

      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer as any, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="ats-report-${Date.now()}.docx"`
        }
      });
    }

    if (format === "pdf") {
      const pdfLines: string[] = [
        `File Name: ${analysis.fileName}`,
        `Date Analyzed: ${dateStr}`,
        `Overall ATS Score: ${analysis.overallScore}/100`,
        `Grade: ${analysis.overallScore >= 80 ? "A" : analysis.overallScore >= 60 ? "B" : "C"}`,
        "",
        "SECTION AUDIT:",
      ];

      Object.entries(analysis.sections || {}).forEach(([k, v]) => {
        pdfLines.push(`- ${k}: ${v ? "Present" : "Missing"}`);
      });

      pdfLines.push("", "MISSING KEYWORDS:");
      if (Array.isArray(analysis.missingKeywords) && analysis.missingKeywords.length > 0) {
        pdfLines.push(analysis.missingKeywords.join(", "));
      } else {
        pdfLines.push("None identified");
      }

      pdfLines.push("", "RECOMMENDATIONS:");
      (analysis.recommendations || []).forEach((r: string) => {
        pdfLines.push(`* ${r}`);
      });

      pdfLines.push("", "STAR ACCOMPLISHMENTS AUDIT:");
      (analysis.starAnalysis || []).forEach((s: any, idx: number) => {
        pdfLines.push(`Accomplishment #${idx + 1} (Score: ${s.rating}/100):`);
        pdfLines.push(` - Bullet: ${s.bullet}`);
        pdfLines.push(` - Situation/Task: ${s.situation}`);
        pdfLines.push(` - Action: ${s.action}`);
        pdfLines.push(` - Result: ${s.result}`);
      });

      const buffer = generateSimplePdf("ATS Resume Analysis Report", pdfLines);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="ats-report-${Date.now()}.pdf"`
        }
      });
    }

    return NextResponse.json({ success: false, error: "Invalid format specified" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to export report" }, { status: 500 });
  }
}

function generateSimplePdf(title: string, lines: string[]): Buffer {
  const chunks: string[] = [];
  chunks.push("%PDF-1.4\n");
  
  const objectOffsets: number[] = [];
  const addObj = (content: string) => {
    const offset = chunks.join("").length;
    objectOffsets.push(offset);
    chunks.push(`${objectOffsets.length} 0 obj\n${content}\nendobj\n`);
  };

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let streamContent = `BT\n/F1 18 Tf\n70 780 Td\n(${title.replace(/[\(\)]/g, "\\$&")}) Tj\n/F1 9 Tf\n`;
  for (const line of lines) {
    const escaped = line.replace(/[\(\)]/g, "\\$&");
    streamContent += `0 -14 Td\n(${escaped}) Tj\n`;
  }
  streamContent += "ET";

  addObj(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nstreamend\nendstream`);

  const xrefOffset = chunks.join("").length;
  let xref = `xref\n0 ${objectOffsets.length + 1}\n0000000000 65535 f \n`;
  for (const offset of objectOffsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  chunks.push(xref);

  chunks.push(`trailer\n<< /Size ${objectOffsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return Buffer.from(chunks.join(""), "utf-8");
}
