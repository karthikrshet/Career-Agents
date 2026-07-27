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

    return NextResponse.json({ success: false, error: "Invalid format specified" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to export report" }, { status: 500 });
  }
}
