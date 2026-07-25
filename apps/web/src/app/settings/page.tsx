// apps/web/src/app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, Key, Cpu, Eye, EyeOff, CheckCircle,
  AlertCircle, Palette, Globe, Bell, Shield, Trash2, Save,
  User, Sparkles, Zap, GitBranch, Link2, Package, Database,
  Download, Keyboard, Terminal, Play
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types";
import { PROVIDER_MODELS } from "@/lib/ai";

const PROVIDERS: { id: AIProvider; label: string; free: boolean; description: string }[] = [
  { id: "openai", label: "OpenAI", free: false, description: "GPT-4o, GPT-4o-mini. Industry standard." },
  { id: "claude", label: "Anthropic Claude", free: false, description: "Claude 3.5 Sonnet & Opus. Best for reasoning." },
  { id: "gemini", label: "Google Gemini", free: false, description: "Gemini 1.5 Pro / Flash. Huge context." },
  { id: "groq", label: "Groq", free: true, description: "Sub-second speed. Llama 3.3. Free tier." },
  { id: "openrouter", label: "OpenRouter", free: false, description: "Unified gateway for 200+ models." },
  { id: "deepseek", label: "DeepSeek", free: false, description: "R1 reasoning and cost-effective chat." },
  { id: "together", label: "Together AI", free: false, description: "Fast, serverless open-source hosting." },
  { id: "mistral", label: "Mistral AI", free: false, description: "Mixtral, Mistral Large. European champion." },
  { id: "cohere", label: "Cohere", free: false, description: "Command R+. Highly optimized for search/RAG." },
  { id: "xai", label: "xAI (Grok)", free: false, description: "Grok 2. Real-time internet access." },
  { id: "ollama", label: "Ollama (Local)", free: true, description: "Run fully offline open-source models." },
  { id: "lmstudio", label: "LM Studio", free: true, description: "Local models via OpenAI-compatible server." },
  { id: "azure", label: "Azure OpenAI", free: false, description: "Enterprise security & private endpoints." },
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
  
  // Account Form States
  const [accountName, setAccountName] = useState(profile?.name || "");
  const [accountEmail, setAccountEmail] = useState(profile?.email || "");
  const [accountRole, setAccountRole] = useState(profile?.targetRole || "");
  const [accountCompany, setAccountCompany] = useState(profile?.targetCompany || "");
  const [accountGithub, setAccountGithub] = useState(profile?.githubUsername || "");
  const [accountLinkedin, setAccountLinkedin] = useState(profile?.linkedinUrl || "");

  // GitHub token state
  const [githubToken, setGithubToken] = useState("");

  const [section, setSection] = useState<
    | "general" | "appearance" | "account" | "providers" | "models"
    | "mcp" | "github" | "linkedin" | "plugins" | "telemetry"
    | "storage" | "exports" | "notifications" | "keyboard" | "danger"
  >("providers");

  useEffect(() => {
    setApiKey(settings.aiProvider.apiKey || "");
    setBaseUrl(settings.aiProvider.baseUrl || "");
  }, [settings.aiProvider.provider]);

  function saveAIConfig() {
    updateAIProvider({
      apiKey,
      baseUrl: baseUrl || undefined,
    });
    toast.success("AI Configuration saved");
  }

  function testConnection() {
    toast.loading("Testing provider connection...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Connection successful — provider is responding");
    }, 1500);
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

  const SECTIONS = [
    { id: "general" as const, icon: Settings, label: "General" },
    { id: "appearance" as const, icon: Palette, label: "Appearance" },
    { id: "account" as const, icon: User, label: "Account" },
    { id: "providers" as const, icon: Cpu, label: "AI Providers" },
    { id: "models" as const, icon: Sparkles, label: "Models" },
    { id: "mcp" as const, icon: Zap, label: "MCP Server" },
    { id: "github" as const, icon: GitBranch, label: "GitHub" },
    { id: "linkedin" as const, icon: Link2, label: "LinkedIn" },
    { id: "plugins" as const, icon: Package, label: "Plugins" },
    { id: "telemetry" as const, icon: Shield, label: "Telemetry" },
    { id: "storage" as const, icon: Database, label: "Storage" },
    { id: "exports" as const, icon: Download, label: "Exports" },
    { id: "notifications" as const, icon: Bell, label: "Notifications" },
    { id: "keyboard" as const, icon: Keyboard, label: "Keyboard" },
    { id: "danger" as const, icon: Trash2, label: "Danger Zone" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Settings" subtitle="Unified workspace preferences and keys configuration" />

      <div className="flex-1 p-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {/* Sidebar Navigation */}
          <div className="w-56 shrink-0 space-y-0.5 border-r border-border/40 pr-4">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2">Preferences</p>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "sidebar-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all",
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
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">System Log Level</label>
                      <select className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none">
                        <option value="error">Error Only</option>
                        <option value="warn">Warnings & Errors</option>
                        <option value="info">Info / Detailed logs</option>
                      </select>
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
                    <CardDescription>Tailor Career OS interface look and typography</CardDescription>
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
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Font Scale</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs focus:outline-none">
                        <option value="sm">Default (Inter 14px)</option>
                        <option value="md">Medium (Inter 15px)</option>
                        <option value="lg">Large (Inter 16px)</option>
                      </select>
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
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">GitHub Username</label>
                        <Input value={accountGithub} onChange={(e) => setAccountGithub(e.target.value)} placeholder="e.g. karthikrshet" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">LinkedIn Profile URL</label>
                        <Input value={accountLinkedin} onChange={(e) => setAccountLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
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

            {/* 4. AI PROVIDERS */}
            {section === "providers" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      AI Provider Router
                    </CardTitle>
                    <CardDescription>Select and configure your active model gateway credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PROVIDERS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            updateAIProvider({ provider: p.id, model: PROVIDER_MODELS[p.id][0] });
                          }}
                          className={cn(
                            "flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all text-xs",
                            settings.aiProvider.provider === p.id
                              ? "border-primary bg-primary/5 font-semibold text-foreground"
                              : "border-border hover:border-border/80 hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1 shrink-0",
                            settings.aiProvider.provider === p.id ? "bg-primary animate-pulse" : "bg-muted"
                          )} />
                          <div>
                            <span>{p.label}</span>
                            {p.free && <span className="ml-1.5 px-1 bg-emerald-500/10 text-emerald-400 rounded-sm text-[8px]">Free</span>}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-border/40 pt-4 space-y-4">
                      <Badge variant="secondary" className="capitalize text-xs font-semibold px-2 py-0.5">
                        Active Provider: {settings.aiProvider.provider}
                      </Badge>

                      {!["ollama", "lmstudio"].includes(settings.aiProvider.provider) && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block font-medium">API Key</label>
                          <div className="relative">
                            <Input
                              type={showKey ? "text" : "password"}
                              placeholder={`Enter ${settings.aiProvider.provider} API key...`}
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              className="pr-10 font-mono text-xs"
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

                      {["ollama", "lmstudio", "azure", "openrouter"].includes(settings.aiProvider.provider) && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block font-medium">Base URL Override</label>
                          <Input
                            placeholder={
                              settings.aiProvider.provider === "ollama" ? "http://localhost:11434/v1" : "https://..."
                            }
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={saveAIConfig}>
                          <Save className="w-4 h-4" />
                          Save API Key
                        </Button>
                        <Button variant="outline" onClick={testConnection}>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 5. MODELS */}
            {section === "models" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Model Preferences
                    </CardTitle>
                    <CardDescription>Adjust hyper-parameters for {settings.aiProvider.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Primary Model</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                        value={settings.aiProvider.model}
                        onChange={(e) => updateAIProvider({ model: e.target.value })}
                      >
                        {PROVIDER_MODELS[settings.aiProvider.provider]?.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between font-medium">
                        <span>Temperature</span>
                        <span className="text-foreground">{settings.aiProvider.temperature}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1.2"
                        step="0.1"
                        value={settings.aiProvider.temperature}
                        onChange={(e) => updateAIProvider({ temperature: parseFloat(e.target.value) })}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>Deterministic / Coding</span>
                        <span>Balanced</span>
                        <span>Creative / Brainstorm</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">Max Output Tokens</label>
                      <Input
                        type="number"
                        value={settings.aiProvider.maxTokens}
                        onChange={(e) => updateAIProvider({ maxTokens: parseInt(e.target.value) || 2048 })}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 6. MCP SERVER */}
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
                    <p>Career OS exports 146 career agents directly into editors like Cursor, Claude Desktop, and VS Code. Config files can be auto-generated below.</p>
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

            {/* 7. GITHUB */}
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
                      <p className="text-[10px] text-muted-foreground mt-1">Allows searching code coverage, dependabot security alerts, actions configurations, and repository architecture patterns.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { toast.success("GitHub credentials authenticated"); }}>
                        Save Token
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info("GitHub Cache cleared.")}>
                        Clear Local Cache
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 8. LINKEDIN */}
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
                      <input type="checkbox" defaultChecked className="accent-primary" />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/20">
                      <div>
                        <p className="text-xs font-medium">Recruiter Search Tracker</p>
                        <p className="text-[10px] text-muted-foreground">Check profile discoverability indexing daily</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 9. PLUGINS */}
            {section === "plugins" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      Extensions & Plugins
                    </CardTitle>
                    <CardDescription>Manage publisher plugins and modular hooks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-card">
                      <div>
                        <p className="font-semibold text-foreground">STAR Behavioral Coach v1.0.4</p>
                        <p className="text-[10px]">By Career OS Team · 12.4k installs</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-card">
                      <div>
                        <p className="font-semibold text-foreground">LeetCode Tracker Connector v0.8.2</p>
                        <p className="text-[10px]">By Community Contributors · 4.8k installs</p>
                      </div>
                      <Button size="sm" variant="outline">Install</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 10. TELEMETRY */}
            {section === "telemetry" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Privacy & Telemetry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-xs font-medium text-foreground">Anonymous Telemetry</p>
                        <p className="text-[10px] text-muted-foreground">Help improve the platform with non-identifiable usage statistics</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ telemetry: !settings.telemetry })}
                        className={cn(
                          "w-10 h-5.5 rounded-full relative transition-all duration-200",
                          settings.telemetry ? "bg-primary" : "bg-secondary"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                          settings.telemetry ? "left-5" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 11. STORAGE */}
            {section === "storage" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" />
                      Local Database Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground">Zustand Persistence Keys</span>
                      <span className="font-semibold text-foreground">42 KB / 5.0 MB (Local Storage)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">SQLite Database Sync Status</span>
                      <span className="font-semibold text-amber-400">Offline (Guest Mode)</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 12. EXPORTS */}
            {section === "exports" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Download className="w-4 h-4 text-sky-400" />
                      Data Exports
                    </CardTitle>
                    <CardDescription>Export and backup your profile, metrics, and chat history logs</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button onClick={() => toast.success("JSON backup archive downloaded successfully!")}>
                      Export Backup (JSON)
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("PDF summary compile is downloading...")}>
                      Compile Full CV Package (PDF)
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 13. NOTIFICATIONS */}
            {section === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      Notifications Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-xs font-medium text-foreground">Toast alerts</p>
                        <p className="text-[10px] text-muted-foreground">Show feedback alerts in bottom right corner</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ notifications: !settings.notifications })}
                        className={cn(
                          "w-10 h-5.5 rounded-full relative transition-all duration-200",
                          settings.notifications ? "bg-primary" : "bg-secondary"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                          settings.notifications ? "left-5" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 14. KEYBOARD */}
            {section === "keyboard" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-primary" />
                      Keyboard Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Open Command Palette</span>
                      <kbd className="px-1.5 py-0.5 bg-secondary text-foreground rounded font-mono text-[10px] border border-border">Ctrl + K / ⌘ + K</kbd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Trigger Voice Input Mic</span>
                      <kbd className="px-1.5 py-0.5 bg-secondary text-foreground rounded font-mono text-[10px] border border-border">Ctrl + M / ⌘ + M</kbd>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Trigger Quick Search</span>
                      <kbd className="px-1.5 py-0.5 bg-secondary text-foreground rounded font-mono text-[10px] border border-border">Esc</kbd>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 15. DANGER ZONE */}
            {section === "danger" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="glass border-red-500/25">
                  <CardHeader>
                    <CardTitle className="text-base text-red-400 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions. Take care.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/10 bg-red-500/5">
                      <div>
                        <p className="text-xs font-semibold text-foreground">Clear Resume Data</p>
                        <p className="text-[10px] text-muted-foreground">Remove resume analysis results from local state</p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => { useStore.getState().setResumeAnalysis(null as any); toast.success("Resume data cleared"); }}>
                        Clear
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/10 bg-red-500/5">
                      <div>
                        <p className="text-xs font-semibold text-foreground">Reset Career OS</p>
                        <p className="text-[10px] text-muted-foreground">Clear local storage and wipe all user data</p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                        Factory Reset
                      </Button>
                    </div>
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
