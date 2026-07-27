// apps/web/src/app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, Key, Cpu, Eye, EyeOff, CheckCircle, Loader2,
  Palette, Globe, User, Sparkles, Zap, GitBranch, Link2, Package, Database,
  Download, Keyboard, Terminal, Play, RefreshCw, BarChart2,
  ListOrdered, ShieldCheck, Trash2, Save, Bell, Shield, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types";

// Import AI Gateway resources (5 levels of ../ goes to root from apps/web/src/app/settings/page.tsx)
import { PROVIDER_REGISTRY } from "../../../../../packages/ai-router/services/provider-registry";
import { fetchAvailableModels } from "../../../../../packages/ai-router/services/discovery";
import { getRouterLogs, compileUsageAnalytics, clearRouterLogs } from "../../../../../packages/ai-router/services/analytics";
import type { RouterLog, HealthCheckReport, AIProviderId, ProviderRegistryEntry } from "../../../../../packages/ai-router/types";

const SECTIONS = [
  { id: "general" as const, icon: Settings, label: "General" },
  { id: "health" as const, icon: CheckCircle, label: "System Health" },
  { id: "appearance" as const, icon: Palette, label: "Appearance" },
  { id: "account" as const, icon: User, label: "Account" },
  { id: "providers" as const, icon: Cpu, label: "AI Gateway" },
  { id: "models" as const, icon: Sparkles, label: "Models Discovery" },
  { id: "fallback" as const, icon: ListOrdered, label: "Failover Settings" },
  { id: "usage" as const, icon: BarChart2, label: "Usage Analytics" },
  { id: "advanced" as const, icon: Terminal, label: "Routing Logs" },
  { id: "security" as const, icon: ShieldCheck, label: "Security & Keys" },
  { id: "mcp" as const, icon: Zap, label: "MCP Server" },
  { id: "github" as const, icon: GitBranch, label: "GitHub Integration" },
  { id: "linkedin" as const, icon: Link2, label: "LinkedIn Tracking" },
  { id: "plugins" as const, icon: Package, label: "Plugins" },
  { id: "telemetry" as const, icon: Shield, label: "Telemetry & Logs" },
  { id: "storage" as const, icon: Database, label: "Storage Management" },
  { id: "exports" as const, icon: Download, label: "Exports config" },
  { id: "notifications" as const, icon: Bell, label: "Notifications" },
  { id: "keyboard" as const, icon: Keyboard, label: "Keyboard Shortcuts" },
  { id: "danger" as const, icon: Trash2, label: "Danger Zone" },
];

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const updateAIProvider = useStore((s) => s.updateAIProvider);
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  // States
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [showKey, setShowKey] = useState(false);
  const gatewayProvider = useGatewayStore((s) => s.activeProvider) as AIProviderId;
  const demoMode = useGatewayStore((s) => s.demoMode);
  const activeModel = useGatewayStore((s) => s.activeModel);
  const optimizeTokens = useGatewayStore((s) => s.optimizeTokens);
  const compressionLevel = useGatewayStore((s) => s.compressionLevel);
  const setOptimizeTokens = useGatewayStore((s) => s.setOptimizeTokens);
  const setCompressionLevel = useGatewayStore((s) => s.setCompressionLevel);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderId>(gatewayProvider || "openai");
  const [modelsCache, setModelsCache] = useState<Record<string, string[]>>({});
  const [loadingModels, setLoadingModels] = useState(false);

  // Health check diagnostics state
  const [diagnosticReport, setDiagnosticReport] = useState<Record<string, HealthCheckReport>>({});
  const [expandedDiagnostics, setExpandedDiagnostics] = useState<string | null>(null);

  // Multiple rotated keys states
  const [primaryKeyInput, setPrimaryKeyInput] = useState("");
  const [secondaryKeyInput, setSecondaryKeyInput] = useState("");
  const [backupKeyInput, setBackupKeyInput] = useState("");

  // Account Form States
  const [accountName, setAccountName] = useState(profile?.name || "");
  const [accountEmail, setAccountEmail] = useState(profile?.email || "");
  const [accountRole, setAccountRole] = useState(profile?.targetRole || "");
  const [accountCompany, setAccountCompany] = useState(profile?.targetCompany || "");
  const [accountGithub, setAccountGithub] = useState(profile?.githubUsername || "");
  const [accountLinkedin, setAccountLinkedin] = useState(profile?.linkedinUrl || "");

  // GitHub token state
  const [githubToken, setGithubToken] = useState(settings.githubToken || "");

  const [section, setSection] = useState<typeof SECTIONS[number]["id"]>("providers");

  useEffect(() => {
    setApiKey(settings.aiProvider.apiKey || "");
    setBaseUrl(settings.aiProvider.baseUrl || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.aiProvider.provider]);

  // Sync selected provider when gateway store hydrates
  useEffect(() => {
    if (gatewayProvider) {
      setSelectedProvider(gatewayProvider);
    }
  }, [gatewayProvider]);

  useEffect(() => {
    setGithubToken(settings.githubToken || "");
  }, [settings.githubToken]);

  // Load dynamic models list when provider changes
  useEffect(() => {
    async function loadModels() {
      const activeKeys = settings.keys?.[selectedProvider] || [];
      const activeKey = activeKeys[0] || settings.aiProvider.apiKey;
      const customUrl = settings.baseUrls?.[selectedProvider] || settings.aiProvider.baseUrl;

      setLoadingModels(true);
      try {
        const list = await fetchAvailableModels(selectedProvider, activeKey, customUrl);
        setModelsCache((prev) => ({ ...prev, [selectedProvider]: list }));
      } catch {}
      setLoadingModels(false);
    }
    loadModels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, settings.keys, settings.baseUrls]);

  function saveAIConfig() {
    updateAIProvider({
      apiKey,
      baseUrl: baseUrl || undefined,
    });
    toast.success("AI Configuration saved");
  }

  async function testConnection(provId: AIProviderId) {
    toast.loading(`Running connection health diagnostics for ${provId}...`);
    try {
      const activeKeys = settings.keys?.[provId] || [];
      const activeKey = activeKeys[0] || (provId === settings.aiProvider.provider ? apiKey : settings.aiProvider.apiKey);
      const customUrl = settings.baseUrls?.[provId] || (provId === settings.aiProvider.provider ? baseUrl : settings.aiProvider.baseUrl);

      const res = await fetch("/api/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: provId,
          apiKey: activeKey || undefined,
          baseUrl: customUrl || undefined,
        }),
      });
      const data = await res.json();
      toast.dismiss();

      if (data.success && data.report) {
        setDiagnosticReport((prev) => ({ ...prev, [provId]: data.report }));
        toast.success(`Health Check Passed! Latency: ${data.latency}ms.`);
      } else {
        toast.error(`Health Check Failed: ${data.error}`);
        if (data.report) {
          setDiagnosticReport((prev) => ({ ...prev, [provId]: data.report }));
        }
      }
    } catch (e: any) {
      toast.dismiss();
      toast.error(`Handshake error: ${e.message}`);
    }
  }

  function saveAccountInfo() {
    setProfile({
      id: profile?.id || "local",
      name: accountName,
      email: accountEmail,
      targetRole: accountRole,
      targetCompany: accountCompany,
      githubUsername: accountGithub,
      linkedinUrl: accountLinkedin,
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast.success("Account profile updated successfully");
  }

  // Multi-key rotation save
  function handleSaveRotatedKeys() {
    const keysMap = { ...settings.keys };
    const primary = primaryKeyInput.trim();
    keysMap[selectedProvider] = [
      primary,
      secondaryKeyInput.trim(),
      backupKeyInput.trim(),
    ].filter(Boolean);

    updateSettings({ keys: keysMap });
    updateAIProvider({
      provider: selectedProvider as any,
      apiKey: primary || undefined,
    });
    toast.success(`Keys registered successfully for ${selectedProvider.toUpperCase()}`);
  }

  // Load key inputs when selected provider updates
  useEffect(() => {
    const registered = settings.keys?.[selectedProvider] || [];
    setPrimaryKeyInput(registered[0] || "");
    setSecondaryKeyInput(registered[1] || "");
    setBackupKeyInput(registered[2] || "");
    setBaseUrl(settings.baseUrls?.[selectedProvider] || "");
  }, [selectedProvider, settings.keys, settings.baseUrls]);

  // Usage statistics analytics compilation
  const analytics = compileUsageAnalytics();
  const logs = getRouterLogs();

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Gateway Preferences" subtitle="Enterprise AI Provider Dashboard, health checker, routing logs, and credentials." />

      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
          {/* Mobile Section Selector Dropdown (md:hidden) */}
          <div className="md:hidden w-full space-y-2 mb-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block px-1">
              Settings Section
            </label>
            <div className="relative">
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d18] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500/50 shadow-lg appearance-none cursor-pointer pr-10"
              >
                {SECTIONS.map((s, idx) => (
                  <option key={s.id} value={s.id} className="bg-[#090d18] text-white">
                    {idx + 1}. {s.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Navigation (hidden md:flex) */}
          <div className="hidden md:flex w-60 shrink-0 space-y-0.5 border-r border-white/10 pr-4 flex-col overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-none no-scrollbar">
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Workspace Config</p>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "sidebar-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all shrink-0",
                  section === s.id
                    ? "bg-primary/10 border border-primary/20 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <s.icon className={cn("w-4 h-4", section === s.id ? "text-primary" : "text-muted-foreground")} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Configuration Panel */}
          <div className="flex-1 space-y-5">
            
            {/* 1. GENERAL */}
            {section === "general" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" />
                      General Settings
                    </CardTitle>
                    <CardDescription>Configure global platform preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Default Language</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                        value={settings.language}
                        onChange={(e) => updateSettings({ language: e.target.value })}
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/10 border border-border/40 mt-4">
                      <div>
                        <p className="text-xs font-semibold">Platform Demo Mode</p>
                        <p className="text-[10px] text-muted-foreground">Force mock AI responses and bypass database checks for presentation events</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={demoMode}
                        onChange={(e) => useGatewayStore.getState().setDemoMode(e.target.checked)}
                        className="accent-primary w-4 h-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 2. APPEARANCE */}
            {section === "appearance" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="w-4 h-4 text-sky-400" />
                      Appearance
                    </CardTitle>
                    <CardDescription>Tailor Career Agents interface look and typography</CardDescription>
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
                              "flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all",
                              settings.theme === t
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:bg-secondary/40"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 3. ACCOUNT */}
            {section === "account" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400" />
                      Candidate Profile
                    </CardTitle>
                    <CardDescription>Update your email, role targets, and sync settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                        <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Full Name" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                        <Input value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} placeholder="Email" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Target Role</label>
                        <Input value={accountRole} onChange={(e) => setAccountRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Target Company</label>
                        <Input value={accountCompany} onChange={(e) => setAccountCompany(e.target.value)} placeholder="e.g. Stripe" />
                      </div>
                    </div>
                    <Button onClick={saveAccountInfo} className="mt-2">
                      <Save className="w-4 h-4" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 4. AI GATEWAY PROVIDERS */}
            {section === "providers" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-border/80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-primary" />
                          AI Provider Gateway
                        </CardTitle>
                        <CardDescription>Enterprise gateway with multi-provider routing and diagnostics</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                        Active Mode: {settings.routerMode || "Balanced"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Providers Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.values(PROVIDER_REGISTRY).map((p: ProviderRegistryEntry) => {
                        const isSelected = selectedProvider === p.id;
                        const report = diagnosticReport[p.id];

                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedProvider(p.id);
                              const defaultModels: Record<string, string> = {
                                groq: "llama-3.3-70b-versatile",
                                gemini: "gemini-2.5-flash",
                                openai: "gpt-4o-mini",
                                claude: "claude-3-5-sonnet-20241022",
                                anthropic: "claude-3-5-sonnet-20241022",
                                openrouter: "meta-llama/llama-3.1-405b",
                                together: "meta-llama/Llama-3-70b-chat-hf",
                                deepseek: "deepseek-chat",
                                mistral: "mistral-large-latest",
                                cohere: "command-r-plus",
                                azure: "gpt-4o",
                                xai: "grok-2",
                              };
                              const defaultModel = defaultModels[p.id] || "default";
                              updateAIProvider({ provider: p.id as any, model: defaultModel });
                              useGatewayStore.getState().setProvider(p.id);
                              useGatewayStore.getState().setModel(defaultModel);
                            }}
                            className={cn(
                              "relative flex flex-col justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all text-xs",
                              isSelected 
                                ? "border-primary bg-primary/5 font-semibold text-foreground ring-1 ring-primary/45" 
                                : "border-border/60 hover:border-border hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div>
                                <span className="font-semibold block text-xs">{p.displayName}</span>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block font-mono">
                                  {p.maxContext >= 1000000 ? `${p.maxContext / 1000000}M` : `${p.maxContext / 1000}k`} context
                                </span>
                              </div>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                                (!report || report.status === "untested") && "bg-secondary text-muted-foreground",
                                (report?.status === "connected" || report?.status === "healthy") && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                report?.status === "missing_key" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                                ["offline", "invalid_key", "quota_exceeded", "rate_limited", "auth_failed", "model_not_found", "unavailable"].includes(report?.status || "") && "bg-red-500/10 text-red-400 border border-red-500/20"
                              )}>
                                {(() => {
                                  if (!report) return "Untested";
                                  const statusMap: Record<string, string> = {
                                    connected: "Connected",
                                    healthy: "Connected",
                                    offline: "Offline",
                                    missing_key: "Missing API Key",
                                    invalid_key: "Invalid Key",
                                    quota_exceeded: "Quota Exceeded",
                                    rate_limited: "Rate Limited",
                                    auth_failed: "Authentication Failed",
                                    model_not_found: "Model Not Found",
                                    unavailable: "Offline",
                                  };
                                  return statusMap[report.status] || report.status;
                                })()}
                              </span>
                            </div>

                            {/* Performance indicators */}
                            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[9px]">
                              <span className="text-muted-foreground">Latency:</span>
                              <span className="font-mono text-foreground">{report?.latencyMs ? `${report.latencyMs}ms` : "N/A"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expandable Diagnostic Panel */}
                    {PROVIDER_REGISTRY[selectedProvider] && (
                      <div className="bg-secondary/25 border border-border/60 rounded-xl p-5 space-y-4 text-xs">
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                              <span>{PROVIDER_REGISTRY[selectedProvider].displayName} Gateway Diagnostics</span>
                            </h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5">7-step diagnostics report status</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => testConnection(selectedProvider)}>
                              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-test
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setExpandedDiagnostics(expandedDiagnostics === selectedProvider ? null : selectedProvider)}>
                              {expandedDiagnostics === selectedProvider ? "Hide steps" : "View steps"}
                            </Button>
                          </div>
                        </div>

                        {/* 7-step checklist list */}
                        {expandedDiagnostics === selectedProvider && diagnosticReport[selectedProvider] && (
                          <div className="space-y-2 border-b border-border/40 pb-4">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Diagnostic checklist verification</p>
                            {diagnosticReport[selectedProvider].checkedSteps.map((step: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#070912] border border-border/40">
                                <span className="font-mono text-[10px] text-muted-foreground">{step.step}</span>
                                <Badge variant="secondary" className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded",
                                  step.passed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                )}>
                                  {step.passed ? "Pass" : "Fail"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Endpoint URL</span>
                            <span className="font-mono text-[10px] block truncate">{PROVIDER_REGISTRY[selectedProvider].apiEndpoint || "Auto-configured"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Latency score</span>
                            <span className="font-mono text-foreground">{diagnosticReport[selectedProvider]?.latencyMs ? `${diagnosticReport[selectedProvider].latencyMs}ms` : "N/A"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Vision capability</span>
                            <span>{PROVIDER_REGISTRY[selectedProvider].capabilities.supportsVision ? "✅ Supported" : "❌ No"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Streaming output</span>
                            <span>{PROVIDER_REGISTRY[selectedProvider].capabilities.supportsStreaming ? "✅ Supported" : "❌ No"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Reasoning logic</span>
                            <span>{PROVIDER_REGISTRY[selectedProvider].capabilities.supportsReasoning ? "✅ Supported" : "❌ No"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Context limitation</span>
                            <span className="font-mono">{PROVIDER_REGISTRY[selectedProvider].maxContext.toLocaleString("en-US")} tokens</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Token usage</span>
                            <span className="font-mono text-foreground">
                              {diagnosticReport[selectedProvider]?.tokenUsage 
                                ? `In: ${diagnosticReport[selectedProvider].tokenUsage.inputTokens} / Out: ${diagnosticReport[selectedProvider].tokenUsage.outputTokens}`
                                : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground block mb-0.5">Provider version</span>
                            <span className="font-mono text-foreground">{diagnosticReport[selectedProvider]?.providerVersion || "N/A"}</span>
                          </div>
                          {diagnosticReport[selectedProvider]?.response && (
                            <div className="col-span-2 sm:col-span-3 border-t border-border/40 pt-3">
                              <span className="font-medium text-foreground block mb-0.5">Test Response</span>
                              <span className="font-mono text-[10px] block bg-black/40 p-2.5 rounded-lg border border-border/40 text-emerald-400/90 whitespace-pre-wrap">
                                {diagnosticReport[selectedProvider].response}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Inline API Credentials config */}
                        <div className="border-t border-border/40 pt-4 space-y-4">
                          <div>
                            <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider">Configure API Credentials</h5>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Save keys client-side to test connection and run dashboard tools</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-muted-foreground mb-1 block font-medium">Primary API Key / Token</label>
                              <Input
                                type="password"
                                placeholder={`Enter ${PROVIDER_REGISTRY[selectedProvider]?.displayName || "AI"} API Key`}
                                value={primaryKeyInput}
                                onChange={(e) => setPrimaryKeyInput(e.target.value)}
                                className="bg-secondary/40 border-border/60"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground mb-1 block font-medium">Custom Base URL (Optional)</label>
                              <Input
                                type="text"
                                placeholder={PROVIDER_REGISTRY[selectedProvider]?.apiEndpoint || "Auto-configured"}
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                className="bg-secondary/40 border-border/60 font-mono text-[10.5px]"
                              />
                            </div>
                          </div>
                          <Button size="sm" onClick={() => {
                            const keysMap = { ...settings.keys };
                            const primary = primaryKeyInput.trim();
                            keysMap[selectedProvider] = [primary].filter(Boolean);
                            
                            const baseUrlsMap = { ...settings.baseUrls };
                            if (baseUrl.trim()) {
                              baseUrlsMap[selectedProvider] = baseUrl.trim();
                            } else {
                              delete baseUrlsMap[selectedProvider];
                            }

                            updateSettings({ keys: keysMap, baseUrls: baseUrlsMap });
                            updateAIProvider({
                              provider: selectedProvider as any,
                              apiKey: primary || undefined,
                              baseUrl: baseUrl.trim() || undefined,
                            });
                            toast.success(`${PROVIDER_REGISTRY[selectedProvider]?.displayName || "AI"} credentials saved successfully`);
                          }} className="w-full sm:w-auto">
                            Save Credentials
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 5. MODELS DISCOVERY */}
            {section === "models" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Dynamic Model Discovery
                    </CardTitle>
                    <CardDescription>Retrieve available models from API endpoints in real-time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-xl border border-border/40">
                      <div>
                        <p className="text-xs font-semibold">Active Provider: {selectedProvider.toUpperCase()}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Querying models from {PROVIDER_REGISTRY[selectedProvider]?.apiEndpoint || "Ollama server"}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setSelectedProvider(selectedProvider)} disabled={loadingModels}>
                        {loadingModels ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : <RefreshCw className="w-3.5 h-3.5 mr-1" />}
                        Refresh Models
                      </Button>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Available Models</label>
                      {loadingModels ? (
                        <div className="h-10 w-full rounded-lg bg-secondary/50 animate-pulse border border-border flex items-center justify-center text-xs text-muted-foreground">
                          Discovering endpoints models...
                        </div>
                      ) : (
                        <select
                          className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                          value={activeModel}
                          onChange={(e) => {
                            updateAIProvider({ model: e.target.value });
                            useGatewayStore.getState().setModel(e.target.value);
                          }}
                        >
                          {(modelsCache[selectedProvider] || []).map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                          {(!modelsCache[selectedProvider] || modelsCache[selectedProvider].length === 0) && (
                            <option value={useGatewayStore.getState().activeModel}>{useGatewayStore.getState().activeModel}</option>
                          )}
                        </select>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 6. FAILOVER SETTINGS */}
            {section === "fallback" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-primary" />
                      Fallback Chains & Auto Routing
                    </CardTitle>
                    <CardDescription>Setup automated backup sequences and intent classification routes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/40">
                      <div>
                        <p className="text-xs font-semibold">Automatic Fallback Failover</p>
                        <p className="text-[10px] text-muted-foreground">Switch to backup provider if the primary experiences rate-limits or quota limits</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.autoFallback} 
                        onChange={(e) => updateSettings({ autoFallback: e.target.checked })} 
                        className="accent-primary w-4 h-4" 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Gateway Router Mode</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                        value={settings.routerMode || "balanced"}
                        onChange={(e) => updateSettings({ routerMode: e.target.value as any })}
                      >
                        <option value="auto">Auto (Context heuristics match)</option>
                        <option value="coding">Coding (Anthropic Sonnet preference)</option>
                        <option value="reasoning">Reasoning (OpenAI O1/GPT-4o preference)</option>
                        <option value="vision">Vision (Gemini Multimodal preference)</option>
                        <option value="fast">Fast (Groq Llama-3.3 preference)</option>
                        <option value="cheap">Cheap (Ollama / local preference)</option>
                        <option value="long-context">Long Context (Gemini 2M preference)</option>
                        <option value="balanced">Balanced (OpenAI-based default)</option>
                        <option value="creative">Creative (Claude-based defaults)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Fallback Order Chain Sequence</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {(settings.providerOrder || []).map((provider) => (
                          <div key={provider} className="flex items-center gap-1 bg-[#0b0f19] border border-border/60 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                            <span className="capitalize">{provider}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Token Optimization Engine Card */}
                <Card className="glass border-emerald-500/30 bg-emerald-950/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          Token Optimization Engine (80% Token Saver)
                        </CardTitle>
                        <CardDescription className="text-emerald-300/70">
                          Minifies system prompts, prunes repetitive history, and compresses multi-turn context
                        </CardDescription>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-mono text-[10px]">
                        80% Reduction Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Enable Token Optimizer</p>
                        <p className="text-[10px] text-slate-400">Automated prompt minification & sliding context compression</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={optimizeTokens} 
                        onChange={(e) => setOptimizeTokens(e.target.checked)} 
                        className="accent-emerald-500 w-4 h-4 cursor-pointer" 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Compression Aggressiveness</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                        value={compressionLevel}
                        onChange={(e) => setCompressionLevel(e.target.value as any)}
                      >
                        <option value="aggressive">Aggressive (Up to 80% Token Savings — Recommended)</option>
                        <option value="medium">Balanced (Up to 50% Token Savings)</option>
                        <option value="low">Light (Up to 25% Token Savings)</option>
                        <option value="none">None (Disabled)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 7. USAGE ANALYTICS */}
            {section === "usage" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      Usage Analytics Dashboard
                    </CardTitle>
                    <CardDescription>Aggregate statistics mapping request token costs and provider latencies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <span className="text-muted-foreground text-[10px] block font-bold uppercase tracking-wider">Requests today</span>
                        <span className="text-2xl font-bold text-foreground mt-1 block">{analytics.requestsToday}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <span className="text-muted-foreground text-[10px] block font-bold uppercase tracking-wider">Estimated Cost</span>
                        <span className="text-2xl font-bold text-emerald-400 mt-1 block">${analytics.estimatedCostUSD.toFixed(5)}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <span className="text-muted-foreground text-[10px] block font-bold uppercase tracking-wider">Avg Latency</span>
                        <span className="text-2xl font-bold text-foreground mt-1 block font-mono">{analytics.averageLatencyMs}ms</span>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <span className="text-muted-foreground text-[10px] block font-bold uppercase tracking-wider">Success Rate</span>
                        <span className="text-2xl font-bold text-emerald-400 mt-1 block font-mono">{analytics.successRatePercent}%</span>
                      </div>
                    </div>

                    <div className="bg-[#070912] p-4 rounded-xl border border-border/60">
                      <h4 className="text-xs font-semibold mb-3">Gateway System Failures Log</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        {Object.entries(analytics.errorCounts).map(([err, count]) => (
                          <div key={err} className="flex justify-between border-b border-border/40 pb-1 text-muted-foreground">
                            <span>{err}</span>
                            <span className="font-bold text-foreground font-mono">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 8. ROUTING LOGS */}
            {section === "advanced" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-border/80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-primary" />
                          AI Router Gateway Logs
                        </CardTitle>
                        <CardDescription>Visual execution logs of AI Gateway calls and failover chains</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { clearRouterLogs(); toast.success("Logs timeline cleared."); }}>
                        Clear Logs
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {logs.length === 0 ? (
                      <div className="h-24 w-full rounded-xl bg-secondary/20 border border-border/40 flex items-center justify-center text-xs text-muted-foreground">
                        No recent API gateway activity logged.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {logs.map((log: RouterLog) => (
                          <div key={log.id} className="p-4 rounded-xl bg-secondary/15 border border-border/60 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-muted-foreground text-[10px]">{log.timestamp}</span>
                              <Badge className={log.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}>
                                {log.status}
                              </Badge>
                            </div>
                            <p className="font-semibold text-foreground truncate">Prompt: "{log.query || "Empty completion check"}"</p>
                            
                            {/* Execution Steps */}
                            <div className="bg-[#070912] p-2.5 rounded border border-border/40 space-y-1">
                              {log.executionChain.map((step: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-[10px]">
                                  <span className="text-muted-foreground font-mono">
                                    Step {idx + 1}: {step.provider.toUpperCase()} ({step.model})
                                  </span>
                                  <span className={step.status === "success" ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                                    {step.status} in {step.latencyMs}ms {step.error && `(${step.error})`}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/40">
                              <span>Provider: <b className="text-foreground capitalize">{log.finalProvider}</b></span>
                              <span>Cost: <b className="text-emerald-400 font-mono">${log.costUSD.toFixed(5)}</b></span>
                              <span>Total duration: <b className="text-foreground font-mono">{log.durationMs}ms</b></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 9. SECURITY & KEYS */}
            {section === "security" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Key Rotation & Security Management
                    </CardTitle>
                    <CardDescription>Manage primary, secondary, and backup keys saved client-side</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Target Provider</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value as any)}
                      >
                        {Object.values(PROVIDER_REGISTRY).map((p: ProviderRegistryEntry) => (
                          <option key={p.id} value={p.id}>{p.displayName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4 border-t border-border/40 pt-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Primary API Key</label>
                        <Input
                          type="password"
                          value={primaryKeyInput}
                          onChange={(e) => setPrimaryKeyInput(e.target.value)}
                          placeholder="Primary key"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Secondary API Key (Failover 1)</label>
                        <Input
                          type="password"
                          value={secondaryKeyInput}
                          onChange={(e) => setSecondaryKeyInput(e.target.value)}
                          placeholder="Secondary fallback key"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Backup API Key (Failover 2)</label>
                        <Input
                          type="password"
                          value={backupKeyInput}
                          onChange={(e) => setBackupKeyInput(e.target.value)}
                          placeholder="Backup tertiary key"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveRotatedKeys}>
                      <Save className="w-4 h-4 mr-1.5" />
                      Save Keys Setup
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 10. MCP SERVER */}
            {section === "mcp" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Model Context Protocol (MCP)
                    </CardTitle>
                    <CardDescription>Manage workspace connections for AI developer tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-muted-foreground">
                    <p>Career Agents exports 146 career agents directly into editors like Cursor, Claude Desktop, and VS Code. Config files can be auto-generated below.</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("Cursor configuration exported to clipboard!")}>
                        Cursor Config
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Claude Desktop config generated!")}>
                        Claude Desktop Config
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("VS Code copilot schema initialized!")}>
                        VS Code / Continue Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 11. GITHUB INTEGRATION */}
            {section === "github" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-indigo-400" />
                      GitHub Integration
                    </CardTitle>
                    <CardDescription>Configure authentication to run deep repository audits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Personal Access Token (PAT)</label>
                      <Input
                        type="password"
                        placeholder="ghp_..."
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => {
                        updateSettings({ githubToken });
                        toast.success("GitHub Personal Access Token saved successfully");
                      }}>
                        Save Token
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 12. LINKEDIN TRACKING */}
            {section === "linkedin" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-sky-400" />
                      LinkedIn Tracking
                    </CardTitle>
                    <CardDescription>LinkedIn branding filters and crawler settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/20">
                      <div>
                        <p className="text-xs font-medium">Auto Keyword Density Scanner</p>
                        <p className="text-[10px] text-muted-foreground">Alert when target keywords fall below 2.5% density</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.linkedinKeywordScanner ?? true}
                        onChange={(e) => updateSettings({ linkedinKeywordScanner: e.target.checked })}
                        className="accent-primary w-4 h-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 13. PLUGINS */}
            {section === "plugins" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      Marketplace Plugins
                    </CardTitle>
                    <CardDescription>Enable context-aware dashboard plugins</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-muted-foreground">
                    <p>Toggle modular context injections like the STAR behavioral advisor or custom sandbox plugins.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 14. TELEMETRY */}
            {section === "telemetry" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Telemetry & Logs
                    </CardTitle>
                    <CardDescription>Toggle anonymous usage stats and local error reporting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-2 rounded bg-secondary/20 border border-border/40">
                      <div>
                        <p className="text-xs font-medium">Anonymous Usage Reporting</p>
                        <p className="text-[10px] text-muted-foreground">Send analytics back to maintainers to optimize default models</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.telemetry}
                        onChange={(e) => updateSettings({ telemetry: e.target.checked })}
                        className="accent-primary w-4 h-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 15. STORAGE */}
            {section === "storage" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" />
                      Storage Settings
                    </CardTitle>
                    <CardDescription>Review local data footprint and prisma DB records mapping</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">Manage Zustand local browser state footprint.</p>
                    <Button variant="outline" onClick={() => { localStorage.clear(); toast.success("Browser state cleared. Re-hydrate on refresh."); }}>
                      Clear Browser DB
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 16. EXPORTS */}
            {section === "exports" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Download className="w-4 h-4 text-primary" />
                      Dossier Exports
                    </CardTitle>
                    <CardDescription>Configure file layout rules for HTML, PDF, and Markdown compiled exports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">Customize styling matrices for compiled reports.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 17. NOTIFICATIONS */}
            {section === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      Notifications Preferences
                    </CardTitle>
                    <CardDescription>Control in-app alerts and calendar notifications settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-2 rounded bg-secondary/20">
                      <div>
                        <p className="text-xs font-medium">Sound Indicators</p>
                        <p className="text-[10px] text-muted-foreground">Play chimes on successful completion logs</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => updateSettings({ notifications: e.target.checked })}
                        className="accent-primary w-4 h-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 18. KEYBOARD */}
            {section === "keyboard" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-primary" />
                      Keyboard Shortcuts
                    </CardTitle>
                    <CardDescription>Review shortcuts mapping for active workflow transitions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex justify-between border-b border-border/40 pb-2">
                      <span>Open Command Palette</span>
                      <kbd className="px-2 py-1 bg-secondary rounded border border-border text-[10px] font-mono">Cmd + K</kbd>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Switch tabs</span>
                      <kbd className="px-2 py-1 bg-secondary rounded border border-border text-[10px] font-mono">Tab</kbd>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 19. DANGER ZONE */}
            {section === "danger" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-red-400">
                      <Trash2 className="w-4 h-4" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-400/80">Irreversible actions impacting your profile logs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-red-400/80">Wipe clean your profile settings and metrics database tables permanently.</p>
                    <Button variant="destructive" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                      Delete Entire Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 20. SYSTEM HEALTH */}
            {section === "health" && (
              <SystemHealthPanel />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function SystemHealthPanel() {
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<Record<string, { status: string; latency: number; details?: string }>>({});

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/health");
      const data = await res.json();
      if (data.success) {
        setChecks(data.checks);
      } else {
        toast.error("Failed to fetch health check metrics");
      }
    } catch (err: any) {
      toast.error(`Health check query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="glass border-border/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                System Health Dashboard
              </CardTitle>
              <CardDescription>Real-time status diagnostics of platform dependencies, API gateways, and integrations.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={fetchHealth} disabled={loading}>
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Running diagnostic handshakes across all dependencies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(checks).map(([name, check]) => {
                const status = check.status;
                const isGreen = status === "Connected";
                const isAmber = status === "Missing";
                const isRed = status === "Offline";
                const isGray = status === "Disabled";

                return (
                  <div
                    key={name}
                    className="p-4 rounded-xl border border-border/40 bg-secondary/10 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-sm text-foreground block">{name}</span>
                        {check.details && (
                          <span className="text-[10px] text-muted-foreground font-mono block mt-1 leading-normal max-w-[240px] truncate" title={check.details}>
                            {check.details}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                          isGreen && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          isAmber && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          isRed && "bg-red-500/10 text-red-400 border-red-500/20",
                          isGray && "bg-slate-500/10 text-muted-foreground border-slate-500/20"
                        )}
                      >
                        {status}
                      </Badge>
                    </div>

                    {check.latency > 0 && (
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/10 pt-2 font-mono">
                        <span>Response latency:</span>
                        <span className="text-foreground font-semibold">{check.latency}ms</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
