"use client";

import { useState, useCallback } from "react";
import type { InterviewFSMState } from "@/components/interview/voice/types";

export function useInterviewState(initialState: InterviewFSMState = "CONFIGURING") {
  const [fsmState, setFsmState] = useState<InterviewFSMState>(initialState);
  const [previousState, setPreviousState] = useState<InterviewFSMState>(initialState);

  const transitionTo = useCallback((newState: InterviewFSMState) => {
    setFsmState((current) => {
      setPreviousState(current);
      return newState;
    });
  }, []);

  const resetToIdle = useCallback(() => {
    setFsmState("IDLE");
  }, []);

  const resetToConfiguring = useCallback(() => {
    setFsmState("CONFIGURING");
  }, []);

  const togglePause = useCallback(() => {
    setFsmState((current) => {
      if (current === "PAUSED") {
        return previousState || "WAITING_FOR_NEXT_QUESTION";
      }
      setPreviousState(current);
      return "PAUSED";
    });
  }, [previousState]);

  return {
    fsmState,
    previousState,
    transitionTo,
    resetToIdle,
    resetToConfiguring,
    togglePause,
  };
}
