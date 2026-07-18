"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { VoiceInterviewShell } from "@/components/interview/voice/VoiceInterviewShell";

export default function DynamicVoiceInterviewPage() {
  const params = useParams();
  const sessionId = typeof params?.sessionId === "string" ? params.sessionId : undefined;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#03060f] text-slate-100 font-sans pb-24 overflow-y-auto">
      <Topbar
        title={`AI Voice Session · ${sessionId || "Live"}`}
        subtitle="1-on-1 spoken mock interview with specialized AI interviewer"
      />
      <div className="flex-1 p-3 sm:p-5 w-full">
        <VoiceInterviewShell initialSessionId={sessionId} />
      </div>
    </div>
  );
}
