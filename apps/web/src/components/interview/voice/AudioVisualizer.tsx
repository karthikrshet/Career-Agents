"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { InterviewFSMState } from "./types";

interface AudioVisualizerProps {
  fsmState: InterviewFSMState;
  barCount?: number;
}

export function AudioVisualizer({ fsmState, barCount = 28 }: AudioVisualizerProps) {
  const isSpeaking = fsmState === "INTERVIEWER_SPEAKING";
  const isListening = fsmState === "LISTENING";
  const isProcessing = fsmState === "PROCESSING";

  const isActive = isSpeaking || isListening || isProcessing;

  return (
    <div className="w-full max-w-md h-16 flex items-center justify-center gap-1 sm:gap-1.5 my-2">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          animate={
            isActive
              ? {
                  height: isSpeaking
                    ? [12, Math.random() * 56 + 14, 12]
                    : isListening
                    ? [8, Math.random() * 40 + 10, 8]
                    : [10, Math.random() * 24 + 10, 10],
                }
              : { height: 6 }
          }
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 0.5 : isListening ? 0.8 : 1.2,
            delay: i * 0.03,
            ease: "easeInOut",
          }}
          className={cn(
            "w-1 sm:w-1.5 rounded-full transition-all duration-300",
            isSpeaking
              ? "bg-gradient-to-t from-indigo-500 via-purple-400 to-cyan-300"
              : isListening
              ? "bg-gradient-to-t from-rose-500 via-red-400 to-amber-300"
              : isProcessing
              ? "bg-gradient-to-t from-purple-500 to-indigo-400"
              : "bg-white/10"
          )}
          style={{ height: 6 }}
        />
      ))}
    </div>
  );
}
