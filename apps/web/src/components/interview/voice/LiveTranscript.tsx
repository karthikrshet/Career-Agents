"use client";

import React, { useRef, useEffect } from "react";
import { Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranscriptMessage } from "./types";

interface LiveTranscriptProps {
  history: TranscriptMessage[];
  agentName: string;
  agentEmoji?: string;
  isProcessing: boolean;
}

export function LiveTranscript({
  history,
  agentName,
  agentEmoji,
  isProcessing,
}: LiveTranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isProcessing]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3.5 p-4 no-scrollbar text-sm text-left min-h-[120px]">
      {history.length === 0 && !isProcessing && (
        <div className="py-8 text-center text-slate-400 text-xs italic">
          Spoken questions and candidate answers will appear live in this transcript log.
        </div>
      )}

      {history.map((msg) => {
        const isAgent = msg.speaker === "agent";
        return (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 transition-all",
              isAgent
                ? "bg-slate-900/80 border border-white/5 mr-auto rounded-tl-none"
                : "bg-cyan-500/10 border border-cyan-500/20 ml-auto rounded-tr-none"
            )}
          >
            <div className="w-6 h-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-xs mt-0.5">
              {isAgent ? <Bot className="w-3.5 h-3.5 text-cyan-400" /> : <User className="w-3.5 h-3.5 text-slate-300" />}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">
                  {isAgent ? agentName : "You"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="leading-relaxed text-slate-200 whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        );
      })}

      {isProcessing && (
        <div className="flex gap-3 max-w-[85%] rounded-2xl p-4 bg-slate-900/80 border border-white/5 mr-auto rounded-tl-none items-center">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">
            Interviewer is analyzing your response and formulating the follow-up question...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
