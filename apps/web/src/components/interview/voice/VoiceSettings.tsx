"use client";

import React from "react";
import { Volume2, Mic, Keyboard, Sliders } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { VoiceMode } from "./types";

interface VoiceSettingsProps {
  rate: number;
  setRate: (val: number) => void;
  pitch: number;
  setPitch: (val: number) => void;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  voiceMode: VoiceMode;
  setVoiceMode: (mode: VoiceMode) => void;
  browserVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
  setSelectedVoiceName: (name: string) => void;
}

export function VoiceSettings({
  rate,
  setRate,
  pitch,
  setPitch,
  autoSpeak,
  setAutoSpeak,
  voiceMode,
  setVoiceMode,
  browserVoices,
  selectedVoiceName,
  setSelectedVoiceName,
}: VoiceSettingsProps) {
  return (
    <Card className="border-white/10 bg-[#080d21] shadow-2xl rounded-2xl">
      <CardHeader className="py-3 px-4 border-b border-white/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          Voice & Audio Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3 text-xs">
        {/* Mode Selector */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/40 border border-white/5">
          <span className="text-xs text-slate-200 font-semibold ml-1 whitespace-nowrap">Interaction Mode</span>
          <div className="flex rounded-lg border border-white/10 bg-white/[0.02] p-1 gap-1 shrink-0">
            <button
              onClick={() => setVoiceMode("voice")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap",
                voiceMode === "voice"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Mic className="w-3.5 h-3.5" /> Voice Mode
            </button>
            <button
              onClick={() => setVoiceMode("text")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap",
                voiceMode === "text"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Keyboard className="w-3.5 h-3.5" /> Text Mode
            </button>
          </div>
        </div>

        {/* Voice Variants */}
        {browserVoices.length > 0 && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300">Speech Synthesis Voice</label>
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0b1029] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {browserVoices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Speed & Pitch */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Speaking Speed</span>
              <span className="font-mono text-cyan-400">{rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Voice Pitch</span>
              <span className="font-mono text-cyan-400">{pitch}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Auto Speak */}
        <div className="pt-1.5 border-t border-white/5">
          <label className="flex items-center gap-2 cursor-pointer py-0.5">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="rounded border-white/10 bg-white/[0.03] text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] text-slate-300 font-medium">Auto-read questions aloud upon arrival</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
