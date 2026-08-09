"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle, Volume2, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BrowserSupportBannerProps {
  hasSpeechRecognition: boolean;
  hasSpeechSynthesis: boolean;
  onSwitchToTextMode: () => void;
}

export function BrowserSupportBanner({
  hasSpeechRecognition,
  hasSpeechSynthesis,
  onSwitchToTextMode,
}: BrowserSupportBannerProps) {
  if (hasSpeechRecognition && hasSpeechSynthesis) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 mb-4 backdrop-blur text-left">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-amber-300">
            Browser Compatibility Notice
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {!hasSpeechRecognition
              ? "Speech recognition isn't supported in this browser. You can continue using Text Mode seamlessly."
              : "Speech synthesis (voice output) isn't fully supported in this browser."}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Input:</span>
              {hasSpeechRecognition ? (
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] py-0 px-1.5">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Supported
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px] py-0 px-1.5">
                  <XCircle className="w-3 h-3 mr-1" /> Unsupported
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Output:</span>
              {hasSpeechSynthesis ? (
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] py-0 px-1.5">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Supported
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px] py-0 px-1.5">
                  <XCircle className="w-3 h-3 mr-1" /> Unsupported
                </Badge>
              )}
            </div>

            {!hasSpeechRecognition && (
              <button
                onClick={onSwitchToTextMode}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-auto"
              >
                Switch to Text Mode
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
