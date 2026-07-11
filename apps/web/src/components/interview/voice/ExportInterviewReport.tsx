"use client";

import React from "react";
import { Download, FileText, Code, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { VoiceSessionData } from "./types";

interface ExportInterviewReportProps {
  session: VoiceSessionData;
}

export function ExportInterviewReport({ session }: ExportInterviewReportProps) {
  const exportMarkdown = () => {
    let md = `# Career Agents — AI Voice Interview Report\n\n`;
    md += `**Date:** ${new Date(session.startedAt).toLocaleDateString()}\n`;
    md += `**Interviewer:** ${session.agentName}\n`;
    md += `**Role:** ${session.role} at ${session.company}\n`;
    md += `**Mode:** ${session.mode} (${session.difficulty})\n`;
    md += `**Language:** ${session.language}\n`;
    md += `**Duration:** ${Math.round(session.durationSeconds / 60)} minutes\n\n`;

    if (session.scorecard) {
      md += `## Score Summary\n\n`;
      md += `- **Overall Score:** ${session.scorecard.overallScore}/100\n`;
      md += `- **Technical Knowledge:** ${session.scorecard.technicalKnowledge}/10\n`;
      md += `- **Problem Solving:** ${session.scorecard.problemSolving}/10\n`;
      md += `- **Communication:** ${session.scorecard.communication}/10\n`;
      md += `- **Clarity:** ${session.scorecard.clarity}/10\n`;
      md += `- **Confidence:** ${session.scorecard.confidence}/10\n`;
      md += `- **Correctness:** ${session.scorecard.correctness}/10\n`;
      md += `- **STAR Structure:** ${session.scorecard.structure}/10\n\n`;

      md += `## Feedback\n\n${session.scorecard.feedback}\n\n`;

      md += `## Strengths\n\n`;
      session.scorecard.strengths.forEach((s) => (md += `- ${s}\n`));

      md += `\n## Areas to Improve\n\n`;
      session.scorecard.weaknesses.forEach((w) => (md += `- ${w}\n`));
    }

    md += `\n## Full Transcript\n\n`;
    session.history.forEach((msg) => {
      const name = msg.speaker === "agent" ? session.agentName : "Candidate";
      md += `### ${name}\n${msg.content}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-interview-${session.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported Markdown report!");
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-interview-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported JSON dataset!");
  };

  const exportPDF = () => {
    // Print window for PDF download
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={exportMarkdown}
        variant="outline"
        size="sm"
        className="border-white/10 hover:bg-white/5 hover:text-white text-xs"
      >
        <FileText className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Export Markdown
      </Button>

      <Button
        onClick={exportJSON}
        variant="outline"
        size="sm"
        className="border-white/10 hover:bg-white/5 hover:text-white text-xs"
      >
        <Code className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Export JSON
      </Button>

      <Button
        onClick={exportPDF}
        size="sm"
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs border-0"
      >
        <Download className="w-3.5 h-3.5 mr-1.5" /> Print / Save PDF
      </Button>
    </div>
  );
}
