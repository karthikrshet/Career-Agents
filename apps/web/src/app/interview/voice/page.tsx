"use client";

import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { VoiceInterviewShell } from "@/components/interview/voice/VoiceInterviewShell";

export default function VoiceInterviewPage() {
  return (
    <div className="flex flex-col w-full min-h-full bg-[#03060f] text-slate-100 font-sans pb-16">
      <Topbar
        title="AI Voice Agent Lab v1.0"
        subtitle="Practice real-time spoken technical, DSA, and behavioral mock interviews with 146 specialized AI interviewers"
      />
      <div className="flex-1 p-3 sm:p-5 w-full">
        <VoiceInterviewShell />
      </div>
    </div>
  );
}
