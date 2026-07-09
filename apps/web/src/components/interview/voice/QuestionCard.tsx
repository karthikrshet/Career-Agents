"use client";

import React from "react";
import { Brain, Volume2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  agentName: string;
  agentEmoji?: string;
  questionText: string;
  roundNumber: number;
  onReplaySpeech: () => void;
}

export function QuestionCard({
  agentName,
  agentEmoji,
  questionText,
  roundNumber,
  onReplaySpeech,
}: QuestionCardProps) {
  return (
    <Card className="border-white/10 bg-[#080d21] shadow-2xl rounded-3xl overflow-hidden text-left">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
              <Brain className="w-3.5 h-3.5 mr-1" /> Question {roundNumber}
            </Badge>
            <span className="text-xs text-slate-400 font-medium">from {agentName}</span>
          </div>

          <button
            onClick={onReplaySpeech}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1"
            title="Read question aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Read Aloud
          </button>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
          {questionText || "Preparing initial question..."}
        </p>
      </CardContent>
    </Card>
  );
}
