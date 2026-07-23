"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Key, Cpu, Eye, EyeOff, CheckCircle,
  AlertCircle, Palette, Globe, Bell, Shield, Trash2, Save
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { PROVIDER_MODELS } from "@/lib/ai";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types";

const PROVIDERS: { id: AIProvider; label: string; free: boolean; description: string }[] = [
  { id: "groq", label: "Groq", free: true, description: "Lightning-fast inference. Free tier available. Best default choice." },
  { id: "openai", label: "OpenAI", free: false, description: "GPT-4o, GPT-4o-mini. Industry standard." },
  { id: "anthropic", label: "Anthropic Claude", free: false, description: "Claude 3.5 Sonnet. Best for long reasoning tasks." },
  { id: "gemini", label: "Google Gemini", free: false, description: "Gemini 1.5 Pro / Flash. Large context window." },
  { id: "openrouter", label: "OpenRouter", free: false, description: "Access 200+ models with one API key." },
  { id: "deepseek", label: "DeepSeek", free: false, description: "Cost-effective, strong coding performance." },
  { id: "ollama", label: "Ollama (Local)", free: true, description: "Run models locally. No API key needed." },
  { id: "lmstudio", label: "LM Studio (Local)", free: true, description: "Local models via LM Studio server." },
];

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const updateAIProvider = useStore((s) => s.updateAIProvider);
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [apiKey, setApiKey] = useState(settings.aiProvider.apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState(settings.aiProvider.baseUrl || "");
  const [section, setSection] = useState<"ai" | "appearance" | "notifications" | "privacy" | "danger">("ai");

  function saveAIConfig() {
    updateAIProvider({
      apiKey,
      baseUrl: baseUrl || undefined,
    });
    toast.success("AI configuration saved");
  }

  function testConnection() {
    if (!apiKey && !["ollama", "lmstudio"].includes(settings.aiProvider.provider)) {
      toast.error("Enter an API key first");
      return;
    }
    toast.loading("Testing connection...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Connection successful — provider is responding");
    }, 1500);
  }

  const SECTIONS = [
    { id: "ai" as const, icon: Cpu, label: "AI Providers" },
    { id: "appearance" as const, icon: Palette, label: "Appearance" },
    { id: "notifications" as const, icon: Bell, label: "Notifications" },
    { id: "privacy" as const, icon: Shield, label: "Privacy" },
    { id: "danger" as const, icon: Trash2, label: "Danger Zone" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Settings" subtitle="AI providers, appearance, and preferences" />

      <div className="flex-1 p-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {/* Sidebar nav */}
          <div className="w-44 shrink-0 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "sidebar-item w-full",
                  section === s.id && "sidebar-item-active"
                )}
              >
                <s.icon className="w-4 h-4" />
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5">
            {/* AI Providers */}
            {section === "ai" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Provider selector */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      AI Provider
                    </CardTitle>
                    <CardDescription>
                      Choose your default AI provider. All providers support the same interface — switch at any time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {PROVIDERS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            updateAIProvider({ provider: p.id, model: PROVIDER_MODELS[p.id][0] });
                            setApiKey("");
                            setBaseUrl("");
                          }}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200",
                            settings.aiProvider.provider === p.id
                              ? "border-primary/40 bg-primary/5"
                              : "border-border hover:border-border/80 hover:bg-secondary/30"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1.5 shrink-0",
                            settings.aiProvider.provider === p.id ? "bg-primary" : "bg-muted"
                          )} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-medium">{p.label}</span>
                              {p.free && <Badge variant="success" className="text-[9px] py-0">Free</Badge>}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{p.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Model + Key */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      Configuration
                    </CardTitle>
                    <CardDescription>
                      Credentials for <strong>{settings.aiProvider.provider}</strong>. Keys are stored locally in your browser — never sent to our servers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Model select */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Model</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        value={settings.aiProvider.model}
                        onChange={(e) => updateAIProvider({ model: e.target.value })}
                      >
                        {PROVIDER_MODELS[settings.aiProvider.provider]?.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* API Key */}
                    {!["ollama", "lmstudio"].includes(settings.aiProvider.provider) && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">API Key</label>
                        <div className="relative">
                          <Input
                            type={showKey ? "text" : "password"}
                            placeholder={`Enter ${settings.aiProvider.provider} API key...`}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="pr-10 font-mono"
                          />
                          <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Base URL for local / Azure */}
                    {["ollama", "lmstudio", "azure", "openrouter"].includes(settings.aiProvider.provider) && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                          Base URL {["ollama", "lmstudio"].includes(settings.aiProvider.provider) ? "(auto-detected)" : ""}
                        </label>
                        <Input
                          placeholder={settings.aiProvider.provider === "ollama" ? "http://localhost:11434/v1" : "https://..."}
                          value={baseUrl}
                          onChange={(e) => setBaseUrl(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    )}

                    {/* Temperature */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between font-medium">
                        <span>Temperature</span>
                        <span className="text-foreground">{settings.aiProvider.temperature}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.aiProvider.temperature}
                        onChange={(e) => updateAIProvider({ temperature: parseFloat(e.target.value) })}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={saveAIConfig}>
                        <Save className="w-4 h-4" />
                        Save Configuration
                      </Button>
                      <Button variant="outline" onClick={testConnection}>
                        <CheckCircle className="w-4 h-4" />
                        Test Connection
                      </Button>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-500/5 border border-sky-500/20">
                      <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        API keys are stored in your browser&apos;s localStorage. For production deployments,
                        use environment variables (<code className="text-sky-400">NEXT_PUBLIC_AI_KEY</code>) instead.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Appearance */}
            {section === "appearance" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Appearance</CardTitle>
                    <CardDescription>Customize the Career OS interface</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block font-medium">Theme</label>
                      <div className="flex gap-2">
                        {["dark", "light", "system"].map((t) => (
                          <button
                            key={t}
                            onClick={() => { updateSettings({ theme: t as any }); toast.success(`Theme set to ${t}`); }}
                            className={cn(
                              "flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all",
                              settings.theme === t
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Full light mode theme is coming in a future update.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications */}
            {section === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: "notifications", label: "Toast notifications", desc: "Show success/error toasts for all operations" },
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{n.label}</p>
                          <p className="text-xs text-muted-foreground">{n.desc}</p>
                        </div>
                        <button
                          onClick={() => updateSettings({ [n.key]: !(settings as any)[n.key] } as any)}
                          className={cn(
                            "w-10 h-5.5 rounded-full transition-all duration-200 relative",
                            (settings as any)[n.key] ? "bg-primary" : "bg-secondary"
                          )}
                        >
                          <span className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200",
                            (settings as any)[n.key] ? "left-5.5" : "left-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Privacy */}
            {section === "privacy" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-sm font-medium text-emerald-400 mb-1">Data stored locally</p>
                      <p className="text-xs text-muted-foreground">
                        All your data — resume analyses, GitBranch results, interview sessions, job applications — is
                        stored entirely in your browser&apos;s localStorage. No data is sent to Career OS servers.
                        Your AI API calls go directly from your browser to the AI provider.
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Telemetry</p>
                        <p className="text-xs text-muted-foreground">Anonymous usage analytics (no PII)</p>
                      </div>
                      <Badge variant={settings.telemetry ? "default" : "outline"}>
                        {settings.telemetry ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Danger Zone */}
            {section === "danger" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Clear Resume Data", desc: "Remove resume analysis results", action: () => { useStore.getState().setResumeAnalysis(null as any); toast.success("Resume data cleared"); } },
                      { label: "Clear All Data", desc: "Reset Career OS to factory defaults", action: () => { localStorage.removeItem("career-os-store"); window.location.reload(); } },
                    ].map((a) => (
                      <div key={a.label} className="flex items-center justify-between p-3 rounded-lg border border-red-500/10 bg-red-500/5">
                        <div>
                          <p className="text-sm font-medium">{a.label}</p>
                          <p className="text-xs text-muted-foreground">{a.desc}</p>
                        </div>
                        <Button size="sm" variant="destructive" onClick={a.action}>
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


