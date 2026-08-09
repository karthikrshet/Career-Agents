"use client";

import React from "react";
import { Mic, MicOff, Volume2, VolumeX, Pause, Play, Square, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoiceMode, InterviewFSMState } from "./types";

interface VoiceControlsProps {
  isListening: boolean;
  onToggleRecording: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  voiceMode: VoiceMode;
  onToggleVoiceMode: () => void;
  onEndInterview: () => void;
  fsmState: InterviewFSMState;
}

export function VoiceControls({
  isListening,
  onToggleRecording,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  voiceMode,
  onToggleVoiceMode,
  onEndInterview,
  fsmState,
}: VoiceControlsProps) {
  const isProcessing = fsmState === "PROCESSING";

  return (
    <div className="sticky bottom-0 z-40 w-full bg-[#050814]/90 backdrop-blur-md border-t border-white/10 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mode Toggle */}
        <button
          onClick={onToggleVoiceMode}
          className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shrink-0"
          title="Toggle Voice / Text input mode"
        >
          {voiceMode === "voice" ? (
            <>
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Text Mode</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Voice Mode</span>
            </>
          )}
        </button>

        {/* Center: Mic / Record button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {voiceMode === "voice" && (
            <button
              onClick={onToggleRecording}
              disabled={isProcessing}
              className={cn(
                "p-3 sm:px-4 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg border",
                isListening
                  ? "bg-rose-500 text-white border-rose-600 animate-pulse shadow-rose-500/30"
                  : "bg-cyan-500 text-white hover:bg-cyan-600 border-cyan-400 shadow-cyan-500/20"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" /> <span>Pause Mic</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> <span>Start Mic</span>
                </>
              )}
            </button>
          )}

          {/* Mute TTS */}
          <button
            onClick={onToggleMute}
            className={cn(
              "p-2.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all",
              isMuted
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
            )}
            title="Mute or unmute voice reader"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isMuted ? "Unmute" : "Mute"}</span>
          </button>

          {/* Pause Session */}
          <button
            onClick={onTogglePause}
            className={cn(
              "p-2.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all",
              isPaused
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
            )}
            title="Pause session timer"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="hidden md:inline">{isPaused ? "Resume" : "Pause"}</span>
          </button>
        </div>

        {/* Right: End Interview */}
        <button
          onClick={onEndInterview}
          className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <Square className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">End Interview</span>
        </button>
      </div>
    </div>
  );
}
