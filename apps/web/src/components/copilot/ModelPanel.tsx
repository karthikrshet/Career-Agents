// apps/web/src/components/copilot/ModelPanel.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, X, Cpu, Globe, Database, Brain, Sparkles, Check, 
  HelpCircle, RefreshCw 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { PROVIDER_MODELS } from "@/lib/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types";

interface ModelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  internetMode: boolean;
  setInternetMode: (val: boolean) => void;
  memoryEnabled: boolean;
  setMemoryEnabled: (val: boolean) => void;
  reasoningEnabled: boolean;
  setReasoningEnabled: (val: boolean) => void;
  activeProvider: AIProvider;
  setActiveProvider: (val: AIProvider) => void;
  activeModel: string;
  setActiveModel: (val: string) => void;
}

export function ModelPanel({
  isOpen,
  onClose,
  internetMode,
  setInternetMode,
  memoryEnabled,
  setMemoryEnabled,
  reasoningEnabled,
  setReasoningEnabled,
  activeProvider,
  setActiveProvider,
  activeModel,
  setActiveModel,
}: ModelPanelProps) {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const updateAIProvider = useStore((s) => s.updateAIProvider);

  const [temp, setTemp] = useState(settings.aiProvider.temperature);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(settings.aiProvider.maxTokens || 4096);

  const saveSettings = () => {
    updateAIProvider({
      provider: activeProvider as any,
      model: activeModel,
      temperature: temp,
      maxTokens: maxTokens,
    });
    toast.success("AI Model configuration updated!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-80 glass border-l border-border/60 z-50 flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          Model Configurator
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-secondary/60 rounded-lg text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Core Provider */}
        <div className="space-y-2">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">AI Provider</label>
          <div className="grid grid-cols-2 gap-2">
            {(["openai", "anthropic", "gemini", "groq", "deepseek", "ollama"] as AIProvider[]).map((prov) => (
              <button
                key={prov}
                onClick={() => {
                  setActiveProvider(prov);
                  const models = PROVIDER_MODELS[prov] || [];
                  if (models.length > 0) setActiveModel(models[0]);
                }}
                className={cn(
                  "p-2 rounded-xl border text-center transition-all",
                  activeProvider === prov 
                    ? "border-primary/50 bg-primary/10 text-foreground font-semibold" 
                    : "border-border/40 hover:border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {prov.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Model select */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Model</label>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            className="w-full bg-secondary/50 border border-border/40 rounded-xl px-3 py-2 text-foreground font-medium outline-none focus:border-primary/50"
          >
            {(PROVIDER_MODELS[activeProvider] || []).map((m: string) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-border/20">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Cognitive Modes</label>

          {/* Web Search toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-border/30 bg-secondary/20">
            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Internet Browsing</p>
                <p className="text-[10px] text-muted-foreground">Search and cite web results</p>
              </div>
            </div>
            <Switch checked={internetMode} onCheckedChange={setInternetMode} />
          </div>

          {/* Memory toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-border/30 bg-secondary/20">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Career Memory</p>
                <p className="text-[10px] text-muted-foreground">Recall target roles and history</p>
              </div>
            </div>
            <Switch checked={memoryEnabled} onCheckedChange={setMemoryEnabled} />
          </div>

          {/* Reasoning toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-border/30 bg-secondary/20">
            <div className="flex items-start gap-2.5">
              <Brain className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Reasoning Timeline</p>
                <p className="text-[10px] text-muted-foreground">Display agent orchestration chain</p>
              </div>
            </div>
            <Switch checked={reasoningEnabled} onCheckedChange={setReasoningEnabled} />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2 border-t border-border/20">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Parameters</label>

          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground">Temperature</span>
              <span className="text-foreground">{temp}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-primary bg-secondary h-1 rounded-lg outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground">Top-P</span>
              <span className="text-foreground">{topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-primary bg-secondary h-1 rounded-lg outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground">Max Tokens</span>
              <span className="text-foreground">{maxTokens}</span>
            </div>
            <select
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full bg-secondary/50 border border-border/40 rounded-xl px-2 py-1.5 outline-none focus:border-primary/50 text-[11px]"
            >
              {[1024, 2048, 4096, 8192, 16384].map((t) => (
                <option key={t} value={t}>{t} tokens</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 bg-secondary/20 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-xl border border-border/40 hover:bg-secondary/40 text-center font-semibold text-muted-foreground"
        >
          Cancel
        </button>
        <button
          onClick={saveSettings}
          className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
        >
          Save Config
        </button>
      </div>
    </div>
  );
}
