"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Download, FileText, FileJson, Code, Loader2,
  CheckCircle, Calendar, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn, scoreToColor, scoreToGrade, generateId } from "@/lib/utils";

export default function ReportsPage() {
  const metrics = useStore((s) => s.metrics);
  const profile = useStore((s) => s.profile);
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);
  const GitHubAnalysis = useStore((s) => s.GitHubAnalysis);
  const linkedinAnalysis = useStore((s) => s.linkedinAnalysis);
  const interviewSessions = useStore((s) => s.interviewSessions);
  const jobApplications = useStore((s) => s.jobApplications);

  const [generating, setGenerating] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; name: string; date: string; format: string; version: number }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("career-reports-history");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const hasData = metrics.careerScore > 0 || resumeAnalysis || GitHubAnalysis;

  function generateMarkdown() {
    const sections = [];
    sections.push(`# Career Agents Report`);
    sections.push(`**Generated:** ${new Date().toLocaleDateString()}`);
    if (profile) sections.push(`**Candidate:** ${profile.name} | **Target:** ${profile.targetRole || "Not specified"}`);
    sections.push("\n## Career Scores\n");
    sections.push(`| Module | Score | Grade |`);
    sections.push(`| :--- | :--- | :--- |`);
    sections.push(`| Overall | ${metrics.careerScore}/100 | ${scoreToGrade(metrics.careerScore)} |`);
    sections.push(`| Resume | ${metrics.resumeScore}/100 | ${scoreToGrade(metrics.resumeScore)} |`);
    sections.push(`| GitBranch | ${metrics.githubScore}/100 | ${scoreToGrade(metrics.githubScore)} |`);
    sections.push(`| Link2 | ${metrics.linkedinScore}/100 | ${scoreToGrade(metrics.linkedinScore)} |`);
    sections.push(`| Interview | ${metrics.interviewScore}/100 | ${scoreToGrade(metrics.interviewScore)} |`);
    if (resumeAnalysis) {
      sections.push(`\n## Resume Analysis\n`);
      sections.push(`**File:** ${resumeAnalysis.fileName}`);
      sections.push(`**ATS Score:** ${resumeAnalysis.atsScore}/100`);
      sections.push(`\n**Missing Keywords:** ${resumeAnalysis.missingKeywords.join(", ")}`);
      sections.push(`\n**Recommendations:**`);
      resumeAnalysis.recommendations.forEach((r) => sections.push(`- ${r}`));
    }
    if (GitHubAnalysis) {
      sections.push(`\n## GitBranch Portfolio\n`);
      sections.push(`**Profile:** @${GitHubAnalysis.username} | **Stars:** ${GitHubAnalysis.totalStars} | **Repos:** ${GitHubAnalysis.publicRepos}`);
      sections.push(`\n**Recommendations:**`);
      GitHubAnalysis.recommendations.forEach((r) => sections.push(`- ${r}`));
    }
    sections.push(`\n## Job Applications\n`);
    sections.push(`**Total:** ${jobApplications.length} | **Active:** ${jobApplications.filter((j) => !["Rejected", "Withdrawn"].includes(j.status)).length}`);
    return sections.join("\n");
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleGenerate(format: string) {
    setGenerating(format);
    try {
      if (format === "pdf") {
        window.print();
        toast.success("Print dialog opened");
        return;
      }

      if (format === "json") {
        const data = { profile, metrics, resumeAnalysis, GitHubAnalysis, linkedinAnalysis, interviewSessions, jobApplications, generatedAt: new Date().toISOString() };
        downloadFile(JSON.stringify(data, null, 2), `career-data-${Date.now()}.json`, "application/json");
      } else if (format === "html") {
        const md = generateMarkdown();
        const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Career Agents Report</title><style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:20px;background:#090d16;color:#e2e8f0}h1{background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;border:1px solid #1e293b;text-align:left}tr:nth-child(even){background:#111827}</style></head><body><pre>${md}</pre></body></html>`;
        downloadFile(html, `career-report-${Date.now()}.html`, "text/html");
      } else {
        // Fetch from server exporter (markdown, doc, xlsx)
        const reportData = { profile, metrics, resumeAnalysis, GitHubAnalysis, linkedinAnalysis, interviewSessions, jobApplications };
        const res = await fetch("/api/reports/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ format, reportData }),
        });

        if (!res.ok) throw new Error("Server generation failed");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const fileExt = format === "doc" ? "docx" : format;
        a.download = `career-report-${Date.now()}.${fileExt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Add version entry to history
      const newEntry = {
        id: generateId(),
        name: `Career Report (${format.toUpperCase()})`,
        date: new Date().toLocaleString(),
        format,
        version: history.filter(h => h.format === format).length + 1
      };
      const updated = [newEntry, ...history];
      setHistory(updated);
      localStorage.setItem("career-reports-history", JSON.stringify(updated));

      toast.success(`${format.toUpperCase()} report generated`);
    } catch {
      toast.error("Export failed");
    } finally {
      setGenerating(null);
    }
  }

  const EXPORTS = [
    { format: "markdown", label: "Markdown Report", desc: "Full analysis report in .md format", icon: FileText, recommended: true },
    { format: "json", label: "JSON Data Export", desc: "Raw data — all scores, analyses, applications", icon: FileJson, recommended: false },
    { format: "html", label: "HTML Report", desc: "Styled, shareable web page", icon: Code, recommended: false },
    { format: "doc", label: "Word Document", desc: "Word-compatible document", icon: FileText, recommended: false },
    { format: "xlsx", label: "Excel Data Matrix", desc: "Structured spreadsheet of scores and leads", icon: FileJson, recommended: false },
    { format: "pdf", label: "PDF Export", desc: "Print or save as high-fidelity PDF", icon: FileText, recommended: false },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Reports" subtitle="Generate and export your career analysis reports" />

      <div className="flex-1 p-6 space-y-6">
        {/* Score summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Career", value: metrics.careerScore },
            { label: "Resume", value: metrics.resumeScore },
            { label: "GitBranch", value: metrics.githubScore },
            { label: "Link2", value: metrics.linkedinScore },
            { label: "Interview", value: metrics.interviewScore },
          ].map((m) => (
            <Card key={m.label} className="glass">
              <CardContent className="p-4 text-center">
                <div className={cn("text-2xl font-bold tabular-nums", m.value > 0 ? scoreToColor(m.value) : "text-muted-foreground/30")}>
                  {m.value > 0 ? m.value : "—"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                {m.value > 0 && <Progress value={m.value} className="h-1 mt-2" />}
              </CardContent>
            </Card>
          ))}
        </div>

        {!hasData && (
          <div className="glass rounded-xl p-6 text-center border border-amber-500/20 bg-amber-500/5">
            <p className="text-sm font-medium text-amber-400">No data to report yet</p>
            <p className="text-xs text-muted-foreground mt-1">Complete at least one module (Resume, GitBranch, or Link2) to generate a report.</p>
          </div>
        )}

        {/* Export options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPORTS.map(({ format, label, desc, icon: Icon, recommended }) => (
            <motion.div
              key={format}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={cn("glass glass-hover h-full", recommended && "border-primary/20")}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {recommended && <Badge variant="default" className="text-[10px]">Recommended</Badge>}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{label}</h3>
                  <p className="text-xs text-muted-foreground mb-4 flex-1">{desc}</p>
                  <Button
                    size="sm"
                    variant={recommended ? "default" : "outline"}
                    className="w-full"
                    disabled={!hasData || generating === format}
                    onClick={() => handleGenerate(format)}
                  >
                    {generating === format
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                      : <><Download className="w-3.5 h-3.5" /> Export {format.toUpperCase()}</>
                    }
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Summary */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">Data Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: "Resume analyses", value: resumeAnalysis ? 1 : 0 },
                  { label: "GitBranch audits", value: GitHubAnalysis ? 1 : 0 },
                  { label: "Link2 analyses", value: linkedinAnalysis ? 1 : 0 },
                  { label: "Interview sessions", value: interviewSessions.length },
                  { label: "Job applications", value: jobApplications.length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.value}</span>
                      {item.value > 0 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generated Reports History */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Generated Reports History</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{history.length} versions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No reports generated in this workspace session.
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-auto">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-secondary/15 text-xs">
                      <div>
                        <p className="font-semibold text-foreground">{entry.name} (v{entry.version})</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{entry.date}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[10px]"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://career-agents.dev/reports/share/${entry.id}`);
                            toast.success("Share link copied to clipboard");
                          }}
                        >
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px]"
                          onClick={() => handleGenerate(entry.format)}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[10px] text-red-400 hover:text-red-300"
                          onClick={() => {
                            const updated = history.filter((h) => h.id !== entry.id);
                            setHistory(updated);
                            localStorage.setItem("career-reports-history", JSON.stringify(updated));
                            toast.success("Report deleted from history");
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


