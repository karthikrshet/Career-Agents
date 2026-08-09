"use client";

import { useState, useCallback, useRef } from "react";

interface UseSpeechSynthesisProps {
  language?: string;
  rate?: number;
  pitch?: number;
  selectedVoiceName?: string;
  isMuted?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useSpeechSynthesis({
  language = "en-US",
  rate = 1.0,
  pitch = 1.0,
  selectedVoiceName,
  isMuted = false,
  onStart,
  onEnd,
  onError,
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, voices: SpeechSynthesisVoice[] = []) => {
      if (isMuted || typeof window === "undefined" || !window.speechSynthesis || !text) return;
      
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (selectedVoiceName && voices.length > 0) {
        const v = voices.find((voice) => voice.name === selectedVoiceName);
        if (v) utterance.voice = v;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (onStart) onStart();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        setIsSpeaking(false);
        if (onError) onError(e);
        else if (onEnd) onEnd();
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [language, rate, pitch, selectedVoiceName, isMuted, onStart, onEnd, onError]
  );

  return {
    isSpeaking,
    speak,
    stopSpeaking,
  };
}
