"use client";

import React, { useState } from "react";
import { Activity, Copy, Download, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { LiveTranscript } from "./LiveTranscript";
import type { TranscriptMessage } from "./types";

interface TranscriptPanelProps {
  history: TranscriptMessage[];
  agentName: string;
  agentEmoji?: string;
  isProcessing: boolean;
}

export function TranscriptPanel({
  history,
  agentName,
  agentEmoji,
  isProcessing,
}: TranscriptPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((msg) =>
    !searchQuery || msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyTranscript = () => {
    const text = history
      .map((m) => `[${m.speaker === "agent" ? agentName : "Candidate"}]: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Transcript copied to clipboard!");
  };

  const handleDownloadTranscript = () => {
    const text = history
      .map((m) => `[${m.speaker === "agent" ? agentName : "Candidate"} - ${m.timestamp}]:\n${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded!");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080d21] shadow-2xl overflow-hidden flex flex-col h-[320px]">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-white/5 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Live Dialogue Transcripts ({history.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 w-32 focus:outline-none focus:w-44 transition-all"
            />
          </div>

          <button
            onClick={handleCopyTranscript}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs"
            title="Copy transcript"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs"
            title="Download transcript"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs"
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <LiveTranscript
          history={filteredHistory}
          agentName={agentName}
          agentEmoji={agentEmoji}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
