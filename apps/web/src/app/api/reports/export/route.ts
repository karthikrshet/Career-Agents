import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import { escapeHTML, enforceRequestLimits } from "packages/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const limitResponse = enforceRequestLimits(req, clientIp, { isUser: !!session?.user });
    if (limitResponse) return limitResponse;

    const { format, reportData } = await req.json();

    if (!reportData) {
      return NextResponse.json({ success: false, error: "No report data provided" }, { status: 400 });
    }

    const { profile, metrics, resumeAnalysis, GitHubAnalysis, linkedinAnalysis, interviewSessions = [], jobApplications = [] } = reportData;
    const dateStr = new Date().toLocaleDateString();

    const cleanProfile = {
      name: escapeHTML(profile?.name || "Candidate"),
      targetRole: escapeHTML(profile?.targetRole || "Not specified"),
    };

    if (format === "json") {
      return new NextResponse(JSON.stringify(reportData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="career-report-${Date.now()}.json"`
        }
      });
    }

    if (format === "html") {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Career Progress & Intelligence Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f1f5f9; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #38bdf8; border-bottom: 2px solid #1e293b; padding-bottom: 12px; }
    h2 { color: #818cf8; margin-top: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
    .card { background: #111827; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
    .metric { font-size: 18px; font-weight: bold; color: #10b981; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #1e293b; }
    th { background: #1f2937; }
  </style>
</head>
<body>
  <h1>Career Progress & Intelligence Report</h1>
  <p><strong>Candidate Name:</strong> ${cleanProfile.name}</p>
  <p><strong>Target Role:</strong> ${cleanProfile.targetRole}</p>
  <p><strong>Date Generated:</strong> ${dateStr}</p>

  <h2>Performance Overview</h2>
  <ul>
    <li>Overall Career Score: <span class="metric">${metrics?.careerScore || 0}/100</span></li>
    <li>Resume Score: <span class="metric">${metrics?.resumeScore || 0}/100</span></li>
    <li>GitHub Score: <span class="metric">${metrics?.githubScore || 0}/100</span></li>
    <li>LinkedIn Score: <span class="metric">${metrics?.linkedinScore || 0}/100</span></li>
    <li>Interview Score: <span class="metric">${metrics?.interviewScore || 0}/100</span></li>
  </ul>

  ${resumeAnalysis ? `
  <h2>Resume ATS Scan Summary</h2>
  <div class="card">
    <p><strong>File:</strong> ${escapeHTML(resumeAnalysis.fileName || "resume.pdf")}</p>
    <p><strong>ATS Score:</strong> ${resumeAnalysis.overallScore || 0}/100</p>
    <p><strong>Missing Keywords:</strong> ${resumeAnalysis.missingKeywords?.map((k: string) => escapeHTML(k)).join(", ") || "None"}</p>
    <p><strong>Recommendations:</strong></p>
    <ul>
      ${resumeAnalysis.recommendations?.map((r: string) => `<li>${escapeHTML(r)}</li>`).join("") || "<li>None</li>"}
    </ul>
  </div>
  ` : ""}

  ${GitHubAnalysis ? `
  <h2>GitHub Portfolio Audit</h2>
  <div class="card">
    <p><strong>Username:</strong> @${escapeHTML(GitHubAnalysis.username || "candidate")}</p>
    <p><strong>Portfolio Score:</strong> ${GitHubAnalysis.portfolioScore || 0}/100</p>
    <p><strong>Total Repositories:</strong> ${GitHubAnalysis.publicRepos || 0}</p>
    <p><strong>Total Stars:</strong> ${GitHubAnalysis.totalStars || 0}</p>
    <p><strong>Recommendations:</strong></p>
    <ul>
      ${GitHubAnalysis.recommendations?.map((r: string) => `<li>${escapeHTML(r)}</li>`).join("") || "<li>None</li>"}
    </ul>
  </div>
  ` : ""}

  <h2>Job Application Log</h2>
  <p>Total Applications: ${jobApplications.length}</p>
  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>Role</th>
        <th>Status</th>
        <th>Applied Date</th>
      </tr>
    </thead>
    <tbody>
      ${jobApplications.map((j: any) => `
        <tr>
          <td>${escapeHTML(j.company)}</td>
          <td>${escapeHTML(j.role)}</td>
          <td>${escapeHTML(j.status)}</td>
          <td>${escapeHTML(j.appliedDate || "N/A")}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="career-report-${Date.now()}.html"`
        }
      });
    }

    if (format === "pdf") {
      const pdfLines: string[] = [
        `Candidate: ${cleanProfile.name}`,
        `Target Role: ${cleanProfile.targetRole}`,
        `Generated: ${dateStr}`,
        "",
        "SCORES MATRIX:",
        `- Overall Career Score: ${metrics?.careerScore || 0}/100`,
        `- Resume Score: ${metrics?.resumeScore || 0}/100`,
        `- GitHub Score: ${metrics?.githubScore || 0}/100`,
        `- LinkedIn Score: ${metrics?.linkedinScore || 0}/100`,
        `- Interview Score: ${metrics?.interviewScore || 0}/100`,
        "",
      ];

      if (resumeAnalysis) {
        pdfLines.push("RESUME AUDIT:", `- Score: ${resumeAnalysis.overallScore || 0}/100`, `- File: ${resumeAnalysis.fileName || ""}`);
        (resumeAnalysis.recommendations || []).forEach((r: string) => pdfLines.push(`* Rec: ${r}`));
        pdfLines.push("");
      }

      if (GitHubAnalysis) {
        pdfLines.push("GITHUB AUDIT:", `- Score: ${GitHubAnalysis.portfolioScore || 0}/100`, `- Username: @${GitHubAnalysis.username || ""}`);
        (GitHubAnalysis.recommendations || []).forEach((r: string) => pdfLines.push(`* Rec: ${r}`));
        pdfLines.push("");
      }

      pdfLines.push("JOB APPLICATIONS LOG:");
      jobApplications.forEach((app: any) => {
        pdfLines.push(`- ${app.company} | ${app.role} | ${app.status}`);
      });

      const buffer = generateSimplePdf("Career Progress & Intelligence Report", pdfLines);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="career-report-${Date.now()}.pdf"`
        }
      });
    }

    if (format === "markdown") {
      let md = `# Career Progress & Intelligence Report\n\n` +
        `**Generated:** ${dateStr}\n` +
        `**Candidate:** ${cleanProfile.name}\n` +
        `**Target Role:** ${cleanProfile.targetRole}\n\n` +
        `## 1. Overall Career Score Summary\n\n` +
        `| Module | Score | Grade |\n` +
        `| :--- | :--- | :--- |\n` +
        `| Overall Career Score | ${metrics?.careerScore || 0}/100 | - |\n` +
        `| Resume Studio | ${metrics?.resumeScore || 0}/100 | - |\n` +
        `| GitHub Wrapped | ${metrics?.githubScore || 0}/100 | - |\n` +
        `| LinkedIn Optimizer | ${metrics?.linkedinScore || 0}/100 | - |\n` +
        `| Interview Lab | ${metrics?.interviewScore || 0}/100 | - |\n\n`;

      if (resumeAnalysis) {
        md += `## 2. Resume ATS Scan Summary\n\n` +
          `- **File:** ${escapeHTML(resumeAnalysis.fileName || "resume.pdf")}\n` +
          `- **ATS Score:** ${resumeAnalysis.overallScore || 0}/100\n` +
          `- **Missing Keywords:** ${resumeAnalysis.missingKeywords?.map((k: string) => escapeHTML(k)).join(", ") || "None"}\n` +
          `- **Recommendations:**\n` +
          (resumeAnalysis.recommendations?.map((r: string) => `  - ${escapeHTML(r)}`).join("\n") || "  - None") + "\n\n";
      }

      if (GitHubAnalysis) {
        md += `## 3. GitHub Portfolio Audit\n\n` +
          `- **Username:** @${escapeHTML(GitHubAnalysis.username || "candidate")}\n` +
          `- **Portfolio Score:** ${GitHubAnalysis.portfolioScore || 0}/100\n` +
          `- **Total Repositories:** ${GitHubAnalysis.publicRepos || 0}\n` +
          `- **Total Stars:** ${GitHubAnalysis.totalStars || 0}\n` +
          `- **Recommendations:**\n` +
          (GitHubAnalysis.recommendations?.map((r: string) => `  - ${escapeHTML(r)}`).join("\n") || "  - None") + "\n\n";
      }

      md += `## 4. Job Search & Application Log\n\n` +
        `Total Applications: ${jobApplications.length}\n` +
        `Active Leads: ${jobApplications.filter((j: any) => !["Rejected", "Withdrawn"].includes(j.status)).length}\n\n` +
        `| Company | Role | Status | Applied Date |\n` +
        `| :--- | :--- | :--- | :--- |\n` +
        jobApplications.map((j: any) => `| ${escapeHTML(j.company)} | ${escapeHTML(j.role)} | ${escapeHTML(j.status)} | ${escapeHTML(j.appliedDate || "N/A")} |`).join("\n") + "\n";

      return new NextResponse(md, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="career-report-${Date.now()}.md"`
        }
      });
    }

    if (format === "doc" || format === "docx") {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ text: "Career Progress & Intelligence Report", heading: HeadingLevel.TITLE }),
              new Paragraph({ text: `Candidate: ${profile?.name || "Candidate"}\nGenerated: ${dateStr}\n` }),
              new Paragraph({ text: "Module Scores Matrix", heading: HeadingLevel.HEADING_2 }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Module")] }),
                      new TableCell({ children: [new Paragraph("Score")] })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Overall Career Score")] }),
                      new TableCell({ children: [new Paragraph(`${metrics?.careerScore || 0}/100`)] })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Resume Score")] }),
                      new TableCell({ children: [new Paragraph(`${metrics?.resumeScore || 0}/100`)] })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("GitHub Score")] }),
                      new TableCell({ children: [new Paragraph(`${metrics?.githubScore || 0}/100`)] })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("LinkedIn Score")] }),
                      new TableCell({ children: [new Paragraph(`${metrics?.linkedinScore || 0}/100`)] })
                    ]
                  })
                ]
              }),
              new Paragraph({ text: "\nJob Search History Log", heading: HeadingLevel.HEADING_2 }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Company")] }),
                      new TableCell({ children: [new Paragraph("Role")] }),
                      new TableCell({ children: [new Paragraph("Status")] })
                    ]
                  }),
                  ...(jobApplications.map((app: any) =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(app.company)] }),
                        new TableCell({ children: [new Paragraph(app.role)] }),
                        new TableCell({ children: [new Paragraph(app.status)] })
                      ]
                    })
                  ))
                ]
              })
            ]
          }
        ]
      });

      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer as any, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="career-report-${Date.now()}.docx"`
        }
      });
    }

    if (format === "xlsx" || format === "xls") {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Scores");
      sheet.columns = [
        { header: "Module", key: "module", width: 30 },
        { header: "Score", key: "score", width: 15 }
      ];
      sheet.addRow({ module: "Overall Career Score", score: metrics?.careerScore || 0 });
      sheet.addRow({ module: "Resume Score", score: metrics?.resumeScore || 0 });
      sheet.addRow({ module: "GitHub Score", score: metrics?.githubScore || 0 });
      sheet.addRow({ module: "LinkedIn Score", score: metrics?.linkedinScore || 0 });
      sheet.addRow({ module: "Interview Score", score: metrics?.interviewScore || 0 });

      const appsSheet = workbook.addWorksheet("Job Applications");
      appsSheet.columns = [
        { header: "Company", key: "company", width: 25 },
        { header: "Role", key: "role", width: 30 },
        { header: "Status", key: "status", width: 15 },
        { header: "Applied Date", key: "appliedDate", width: 20 }
      ];
      jobApplications.forEach((app: any) => {
        appsSheet.addRow({
          company: app.company,
          role: app.role,
          status: app.status,
          appliedDate: app.appliedDate || "N/A"
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer as any, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="career-data-${Date.now()}.xlsx"`
        }
      });
    }

    return NextResponse.json({ success: false, error: "Unsupported export format" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to generate report" }, { status: 500 });
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

  let streamContent = `BT\n/F1 16 Tf\n70 780 Td\n(${title.replace(/[\(\)]/g, "\\$&")}) Tj\n/F1 9 Tf\n`;
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
