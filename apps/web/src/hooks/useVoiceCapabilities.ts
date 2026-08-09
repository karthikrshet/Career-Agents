"use client";

import { useState, useEffect } from "react";

export interface VoiceCapabilities {
  hasSpeechRecognition: boolean;
  hasSpeechSynthesis: boolean;
  voices: SpeechSynthesisVoice[];
  status: "SUPPORTED" | "LIMITED" | "UNAVAILABLE";
  isClient: boolean;
}

export function useVoiceCapabilities(language: string = "en-US"): VoiceCapabilities {
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [hasSpeechSynthesis, setHasSpeechSynthesis] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const recSupported = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      const synthSupported = !!window.speechSynthesis;

      setHasSpeechRecognition(recSupported);
      setHasSpeechSynthesis(synthSupported);

      if (synthSupported) {
        const updateVoices = () => {
          const loadedVoices = window.speechSynthesis.getVoices();
          setVoices(loadedVoices);
        };
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const status: "SUPPORTED" | "LIMITED" | "UNAVAILABLE" = 
    hasSpeechRecognition && hasSpeechSynthesis
      ? "SUPPORTED"
      : hasSpeechRecognition || hasSpeechSynthesis
      ? "LIMITED"
      : "UNAVAILABLE";

  return {
    hasSpeechRecognition,
    hasSpeechSynthesis,
    voices,
    status,
    isClient,
  };
}
