"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseVoiceRecognitionProps {
  language?: string;
  onResult?: (transcript: string) => void;
  onError?: (errorType: string) => void;
  onEnd?: () => void;
}

export function useVoiceRecognition({
  language = "en-US",
  onResult,
  onError,
  onEnd,
}: UseVoiceRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = language;

        rec.onresult = (event: any) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text.trim() !== "" && onResult) {
            onResult(text);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition error:", e);
          setIsListening(false);
          const errorType = e.error || "unknown";

          if (errorType === "not-allowed" || errorType === "service-not-allowed") {
            setPermissionGranted(false);
            if (isListening) {
              toast.info("Microphone access denied. Switched to Text Mode.");
            }
          } else if (errorType !== "no-speech" && isListening) {
            toast.error(`Microphone notice: ${errorType}`);
          }

          if (onError) onError(errorType);
        };

        rec.onend = () => {
          setIsListening(false);
          if (onEnd) onEnd();
        };

        recognitionRef.current = rec;
      }
    }
  }, [language, onResult, onError, onEnd]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);
        toast.success("Microphone permission granted.");
        return true;
      }
      return false;
    } catch (err) {
      setPermissionGranted(false);
      toast.info("Microphone access denied. Switched to Text Mode.");
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        return true;
      } catch (err) {
        console.error("Mic start error:", err);
      }
    }
    return false;
  }, [permissionGranted, requestPermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Mic stop error:", err);
      }
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    permissionGranted,
    requestPermission,
    startListening,
    stopListening,
  };
}
