"use client";

import React from "react";
import { Mic, MicOff, AlertCircle, ShieldCheck, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MicStatus } from "./types";

interface MicrophonePermissionProps {
  status: MicStatus;
  permissionGranted: boolean;
  onRequestPermission: () => void;
}

export function MicrophonePermission({
  status,
  permissionGranted,
  onRequestPermission,
}: MicrophonePermissionProps) {
  const getBadgeVariant = () => {
    switch (status) {
      case "LISTENING":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse";
      case "SPEAKING":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse";
      case "PROCESSING":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "READY":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "PAUSED":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "ERROR":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`font-mono text-xs px-2.5 py-1 border flex items-center gap-1.5 ${getBadgeVariant()}`}>
        {status === "LISTENING" && <Radio className="w-3.5 h-3.5 animate-spin" />}
        {status === "SPEAKING" && <Radio className="w-3.5 h-3.5" />}
        {status === "READY" && <ShieldCheck className="w-3.5 h-3.5" />}
        {status === "ERROR" && <AlertCircle className="w-3.5 h-3.5" />}
        <span>{status}</span>
      </Badge>

      {!permissionGranted && status !== "LISTENING" && (
        <button
          onClick={onRequestPermission}
          className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
        >
          <Mic className="w-3 h-3" /> Grant Mic Access
        </button>
      )}
    </div>
  );
}
