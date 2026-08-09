"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Radio, Brain, Sparkles, UserCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentItem, InterviewFSMState } from "./types";

interface InterviewerOrbProps {
  agent: AgentItem;
  fsmState: InterviewFSMState;
}

export function InterviewerOrb({ agent, fsmState }: InterviewerOrbProps) {
  const isSpeaking = fsmState === "INTERVIEWER_SPEAKING";
  const isListening = fsmState === "LISTENING";
  const isProcessing = fsmState === "PROCESSING";

  const getBorderColor = () => {
    if (isSpeaking) return "border-indigo-500 shadow-indigo-500/30";
    if (isListening) return "border-rose-500 shadow-rose-500/30";
    if (isProcessing) return "border-purple-500 shadow-purple-500/30";
    return "border-cyan-500/30 shadow-cyan-500/10";
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 text-center">
      {/* Background Radial Glow */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 blur-3xl pointer-events-none opacity-20 bg-gradient-to-r",
          isSpeaking
            ? "from-indigo-500 to-purple-600"
            : isListening
            ? "from-rose-500 to-red-600"
            : isProcessing
            ? "from-purple-500 to-cyan-500"
            : "from-cyan-500 to-blue-600"
        )}
      />

      {/* Main Avatar Orb */}
      <motion.div
        animate={
          isSpeaking
            ? { scale: [1, 1.06, 1], rotate: [0, 1, -1, 0] }
            : isListening
            ? { scale: [1, 1.03, 1] }
            : isProcessing
            ? { scale: [0.98, 1.02, 0.98] }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-all duration-500 bg-[#080d21]",
          getBorderColor()
        )}
      >
        <Bot className="w-12 h-12 text-cyan-400" />

        {/* Live Status Indicators */}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500" />
          </span>
        )}
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
          </span>
        )}
      </motion.div>

      {/* Name and Vibe */}
      <h3 className="text-base sm:text-lg font-extrabold text-white mt-4 flex items-center gap-2">
        {agent.name}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm italic mt-1 leading-relaxed">
        &ldquo;{agent.vibe || agent.description}&rdquo;
      </p>
    </div>
  );
}
