"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#030712] text-slate-100 font-sans z-50">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#070b14] border border-sky-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.25)]">
          <div className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
        </div>
      </div>
      <div className="space-y-1.5 text-center font-mono">
        <p className="text-xs font-semibold text-white tracking-wide">Career Agents AI OS</p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>Initializing workspace runtime...</span>
        </div>
      </div>
    </div>
  );
}
