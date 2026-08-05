"use client";

import { useState } from "react";
import { Brain, Lightbulb, Zap, Bug, MessageSquare, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AICoachPanelProps {
  problemTitle: string;
  problemDifficulty: string;
  currentCode: string;
  language: string;
  onAskAI: (prompt: string) => void;
  isLoading: boolean;
  aiResponse: string;
}

export function AICoachPanel({
  problemTitle,
  problemDifficulty,
  currentCode,
  language,
  onAskAI,
  isLoading,
  aiResponse,
}: AICoachPanelProps) {
  const [customQuery, setCustomQuery] = useState("");

  const QUICK_PROMPTS = [
    { label: "💡 Give Me A Hint", prompt: "Give me a progressive hint on how to approach this problem without writing code." },
    { label: "⚡ Analyze Complexity", prompt: "Analyze the time complexity and space complexity of my current code." },
    { label: "🐞 Debug Edge Cases", prompt: "Review my code for potential edge cases, off-by-one errors, or runtime bugs." },
    { label: "🎯 Follow-up Questions", prompt: "What are 2 follow-up questions a Senior Software Engineer interviewer would ask me next?" },
    { label: "🌟 STAR Linkage", prompt: "How can I articulate solving this algorithmic pattern in a STAR behavioral interview response?" }
  ];

  return (
    <div className="p-4 bg-card border border-border/60 rounded-xl space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-border/30 pb-2">
        <span className="font-bold text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary animate-pulse" />
          AI Coding & Interview Coach
        </span>
        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
          STAR Interview Linked
        </Badge>
      </div>

      {/* Quick Prompt Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onAskAI(item.prompt)}
            className="p-2.5 bg-secondary/30 border border-border/40 rounded-lg text-left hover:border-primary/40 hover:bg-primary/5 transition-all font-medium text-slate-300 flex items-center justify-between"
          >
            <span>{item.label}</span>
            <Zap className="w-3 h-3 text-muted-foreground opacity-50" />
          </button>
        ))}
      </div>

      {/* AI Output View */}
      {isLoading ? (
        <div className="p-6 bg-secondary/20 rounded-xl border border-border/40 flex items-center justify-center gap-3 font-mono text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          AI Coach compiling algorithm analysis...
        </div>
      ) : aiResponse ? (
        <div className="p-4 bg-[#0d1117] border border-border/60 rounded-xl space-y-2 leading-relaxed text-slate-200 whitespace-pre-line font-sans">
          {aiResponse}
        </div>
      ) : (
        <div className="p-4 bg-secondary/10 border border-border/30 rounded-xl text-center text-muted-foreground font-mono">
          Click any prompt above or type a custom question to consult your AI Coding Coach.
        </div>
      )}

      {/* Custom Input */}
      <div className="flex gap-2 pt-1">
        <Input
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customQuery.trim()) {
              onAskAI(customQuery);
              setCustomQuery("");
            }
          }}
          placeholder="Ask AI Coach for hints, dry runs, or interview follow-ups..."
          className="text-xs bg-secondary/30"
        />
        <Button
          size="sm"
          onClick={() => {
            if (customQuery.trim()) {
              onAskAI(customQuery);
              setCustomQuery("");
            }
          }}
          disabled={isLoading}
          className="h-9 px-4 text-xs bg-primary text-black font-bold"
        >
          Ask Coach
        </Button>
      </div>
    </div>
  );
}
