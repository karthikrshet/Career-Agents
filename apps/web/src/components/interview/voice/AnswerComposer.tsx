"use client";

import React from "react";
import { Mic, MicOff, Send, Square, Keyboard, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VoiceMode, InterviewFSMState } from "./types";

interface AnswerComposerProps {
  voiceMode: VoiceMode;
  setVoiceMode: (mode: VoiceMode) => void;
  isListening: boolean;
  onToggleRecording: () => void;
  currentResponse: string;
  setCurrentResponse: (text: string) => void;
  onSubmitAnswer: () => void;
  onFinishSession: () => void;
  fsmState: InterviewFSMState;
  hasUserAnswered: boolean;
}

export function AnswerComposer({
  voiceMode,
  setVoiceMode,
  isListening,
  onToggleRecording,
  currentResponse,
  setCurrentResponse,
  onSubmitAnswer,
  onFinishSession,
  fsmState,
  hasUserAnswered,
}: AnswerComposerProps) {
  const isProcessing = fsmState === "PROCESSING";
  const isInterviewerSpeaking = fsmState === "INTERVIEWER_SPEAKING";

  const wordCount = currentResponse.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-[#080d21] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left">
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          Your Response
        </span>

        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] p-0.5">
          <button
            onClick={() => setVoiceMode("voice")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1",
              voiceMode === "voice"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Mic className="w-3 h-3" /> Voice
          </button>
          <button
            onClick={() => setVoiceMode("text")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1",
              voiceMode === "text"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Keyboard className="w-3 h-3" /> Text
          </button>
        </div>
      </div>

      {voiceMode === "voice" ? (
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 bg-slate-950/40 border border-dashed border-white/10 rounded-2xl space-y-4">
          <button
            onClick={onToggleRecording}
            disabled={isProcessing || isInterviewerSpeaking}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all border shadow-2xl",
              isListening
                ? "bg-rose-500 text-white border-rose-600 animate-pulse shadow-rose-500/30 scale-105"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-cyan-400 hover:text-cyan-300"
            )}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <div className="text-center space-y-1 px-4">
            <p className="text-xs font-bold text-slate-200">
              {isListening
                ? "Microphone is active. Speak clearly..."
                : "Press the microphone to record your answer."}
            </p>
            <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
              Answer verbally. When finished, press Submit Answer below. If Speech Recognition isn't accurate, switch to Text Mode to edit.
            </p>
          </div>

          {currentResponse && (
            <div className="w-full px-4 sm:px-6 pt-2">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs leading-relaxed text-slate-200 max-h-[90px] overflow-y-auto">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase mr-1.5">
                  Transcribed:
                </span>
                {currentResponse}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            disabled={isProcessing}
            placeholder="Type your complete answer here. Describe your logic, algorithm time/space complexities for technical questions, or Situation, Task, Action, Result for behavioral scenarios..."
            className="w-full h-36 px-4 py-3 rounded-2xl bg-slate-950/40 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
            {wordCount} words
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={onSubmitAnswer}
          disabled={isProcessing || !currentResponse.trim()}
          className="flex-1 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold hover:opacity-90 shadow-lg shadow-cyan-500/10 border-0"
        >
          <Send className="w-4 h-4 mr-2" /> Submit Answer
        </Button>

        <Button
          onClick={onFinishSession}
          variant="outline"
          disabled={isProcessing || !hasUserAnswered}
          className="border-white/10 hover:bg-white/5 hover:text-white rounded-xl py-5 text-slate-300 font-semibold"
        >
          <Square className="w-4 h-4 mr-2 text-rose-400" /> End & Evaluate Scorecard
        </Button>
      </div>
    </div>
  );
}
