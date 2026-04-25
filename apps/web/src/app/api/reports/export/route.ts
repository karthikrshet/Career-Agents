// apps/web/src/app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import ExcelJS from "exceljs";
import { escapeHTML } from "packages/security";

export async function POST(req: NextRequest) {
  try {
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
