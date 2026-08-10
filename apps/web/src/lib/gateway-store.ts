import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GatewayState {
  activeProvider: string;
  activeModel: string;
  temperature: number;
  maxTokens: number;
  demoMode: boolean;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setDemoMode: (demo: boolean) => void;
}

export const useGatewayStore = create<GatewayState>()(
  persist(
    (set) => ({
      activeProvider: "groq",
      activeModel: "llama3-70b-8192",
      temperature: 0.7,
      maxTokens: 4096,
      demoMode: typeof window !== "undefined" ? localStorage.getItem("demo_mode_enabled") === "true" : false,
      setProvider: (activeProvider) => set({ activeProvider }),
      setModel: (activeModel) => set({ activeModel }),
      setTemperature: (temperature) => set({ temperature }),
      setMaxTokens: (maxTokens) => set({ maxTokens }),
      setDemoMode: (demoMode) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("demo_mode_enabled", String(demoMode));
        }
        set({ demoMode });
      },
    }),
    {
      name: "career-agents-gateway-store",
    }
  )
);
