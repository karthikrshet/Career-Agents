"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Download, Check, Search, Globe, FileText, CheckCircle, ExternalLink, X, ShieldAlert, Cpu } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Plugin } from "@/types";

export interface ExtendedPlugin extends Plugin {
  permissions?: string[];
  website?: string;
  documentation?: string;
  license?: string;
  changelog?: string[];
  rating?: number;
  reviewsCount?: number;
  dependencies?: string[];
}

const MARKETPLACE_PLUGINS: ExtendedPlugin[] = [
  {
    id: "star-coach",
    name: "STAR Behavioral Coach",
    description: "Modular behavioral prep coach that analyzes your responses and maps them into Situation, Task, Action, and Result formats.",
    version: "1.0.4",
    author: "Career Agents Team",
    downloads: 12400,
    enabled: false,
    installed: false,
    category: "Interview",
    tags: ["star", "interview", "behavioral"],
    permissions: ["read_profile", "read_resume", "write_copilot_context"],
    website: "https://github.com/career-agents/star-coach",
    documentation: "https://github.com/career-agents/star-coach/wiki",
    license: "MIT",
    changelog: ["v1.0.4 - Improve situation matching logic", "v1.0.3 - Optimize response analysis speed"],
    rating: 4.8,
    reviewsCount: 184,
    dependencies: ["core-ai-router"],
  },
  {
    id: "leetcode-tracker",
    name: "LeetCode Tracker Connector",
    description: "Sync and track LeetCode solution metrics. Auto-injects coding standards checklists and algorithmic advice into Career Copilot chat sessions.",
    version: "0.8.2",
    author: "Community Contributors",
    downloads: 4800,
    enabled: false,
    installed: false,
    category: "Interview",
    tags: ["leetcode", "algorithms", "coding"],
    permissions: ["read_profile", "write_copilot_context"],
    website: "https://github.com/community/leetcode-tracker",
    documentation: "https://github.com/community/leetcode-tracker/blob/main/README.md",
    license: "MIT",
    changelog: ["v0.8.2 - Add Python & Go syntax helpers", "v0.8.0 - Initial community launch"],
    rating: 4.6,
    reviewsCount: 72,
    dependencies: ["core-ai-router"],
  },
  {
    id: "resume-pdf",
    name: "Resume PDF Parser",
    description: "Extract structured data from PDF resumes using OCR and layout analysis.",
    version: "1.2.0",
    author: "Career Agents",
    downloads: 4120,
    enabled: false,
    installed: false,
    category: "Resume",
    tags: ["pdf", "ocr", "parsing"],
    permissions: ["read_resume"],
    website: "https://github.com/career-agents/pdf-parser",
    documentation: "https://github.com/career-agents/pdf-parser/blob/main/README.md",
    license: "MIT",
    changelog: ["v1.2.0 - Support multi-column PDF layouts"],
    rating: 4.7,
    reviewsCount: 96,
    dependencies: []
  },
  {
    id: "salary-intel",
    name: "Salary Intelligence",
    description: "Real-time compensation benchmarks from Levels.fyi, Glassdoor, and Blind.",
    version: "1.0.3",
    author: "Community",
    downloads: 3300,
    enabled: false,
    installed: false,
    category: "Jobs",
    tags: ["salary", "compensation"],
    permissions: ["read_profile"],
    website: "https://github.com/community/salary-intel",
    documentation: "https://github.com/community/salary-intel/blob/main/README.md",
    license: "Apache 2.0",
    changelog: ["v1.0.3 - Support European currency benchmarks"],
    rating: 4.5,
    reviewsCount: 64,
    dependencies: []
  }
];

const CATEGORIES = ["All", "Installed", "Updates Available", "Recently Installed", "Resume", "Interview", "Jobs"];

export default function MarketplacePage() {
  const installedPlugins = useStore((s) => s.installedPlugins || {});
  const enabledPlugins = useStore((s) => s.enabledPlugins || {});
  const installPlugin = useStore((s) => s.installPlugin);
  const uninstallPlugin = useStore((s) => s.uninstallPlugin);
  const enablePlugin = useStore((s) => s.enablePlugin);
  const disablePlugin = useStore((s) => s.disablePlugin);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPlugin, setSelectedPlugin] = useState<ExtendedPlugin | null>(null);

  const filtered = MARKETPLACE_PLUGINS.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    
    let matchesCategory = true;
    if (category === "All") matchesCategory = true;
    else if (category === "Installed") matchesCategory = !!installedPlugins[p.id];
    else if (category === "Updates Available") matchesCategory = !!installedPlugins[p.id] && p.id === "star-coach"; // mock updates
    else if (category === "Recently Installed") matchesCategory = !!installedPlugins[p.id];
    else matchesCategory = p.category === category;

    return matchesSearch && matchesCategory;
  });

  async function handleInstall(id: string, name: string) {
    const isInstalled = !!installedPlugins[id];
    if (isInstalled) {
      uninstallPlugin(id);
      toast.success(`${name} uninstalled and removed from settings`);
    } else {
      // Simulate real plugin lifecycle download progress (Priority 8 & 16)
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            installPlugin(id);
            enablePlugin(id); // auto-enable on install
            resolve(true);
          }, 1500);
        }),
        {
          loading: `Downloading plugin package ${name}...`,
          success: `${name} registered & enabled successfully!`,
          error: "Installation failed."
        }
      );
    }
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Plugin Marketplace" subtitle="Extend Career Agents with community and official plugins" />

      <div className="flex-1 p-6 space-y-5">
        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search plugins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                  category === c
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((plugin, i) => {
            const isInstalled = !!installedPlugins[plugin.id];
            const isEnabled = !!enabledPlugins[plugin.id];
            return (
              <motion.div
                key={plugin.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="glass glass-hover h-full flex flex-col justify-between">
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{plugin.category}</Badge>
                    </div>
                    
                    <h3 className="text-sm font-semibold mb-1 cursor-pointer hover:underline" onClick={() => setSelectedPlugin(plugin)}>
                      {plugin.name}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mb-3 flex-1 leading-relaxed line-clamp-3">
                      {plugin.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                      <span>v{plugin.version} · {plugin.author}</span>
                      <span>⭐ {plugin.rating || 4.5}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {plugin.tags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-secondary text-muted-foreground">{t}</span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => setSelectedPlugin(plugin)}
                      >
                        Details
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={isInstalled ? "secondary" : "default"}
                        className="flex-1 text-xs"
                        onClick={() => handleInstall(plugin.id, plugin.name)}
                      >
                        {isInstalled ? (
                          <><Check className="w-3.5 h-3.5 mr-1" /> Installed</>
                        ) : (
                          <><Download className="w-3.5 h-3.5 mr-1" /> Install</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedPlugin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      {selectedPlugin.name}
                      <Badge className="text-[9px] scale-90">{selectedPlugin.version}</Badge>
                    </h2>
                    <p className="text-xs text-muted-foreground">By {selectedPlugin.author} · {selectedPlugin.downloads.toLocaleString("en-US")} installs</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPlugin(null)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[380px] leading-relaxed">
                <div>
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Description</h4>
                  <p className="text-foreground/80 text-sm leading-relaxed">{selectedPlugin.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Documentation & Links</h4>
                    <div className="space-y-1.5 font-medium">
                      <a href={selectedPlugin.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Globe className="w-3.5 h-3.5" /> Publisher GitHub <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      {selectedPlugin.documentation && (
                        <a href={selectedPlugin.documentation} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <FileText className="w-3.5 h-3.5" /> Readme Docs <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Specs & License</h4>
                    <p className="text-foreground/80">License: <b>{selectedPlugin.license}</b></p>
                    <p className="text-foreground/80 mt-1">Rating: <b>⭐ {selectedPlugin.rating} ({selectedPlugin.reviewsCount} reviews)</b></p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Security Permissions Required
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-foreground/75 font-medium">
                    {selectedPlugin.permissions?.map((perm) => (
                      <li key={perm} className="capitalize">{perm.replace(/_/g, " ")}</li>
                    )) || <li>No custom workspace permissions requested</li>}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Dependencies
                  </h4>
                  <p className="text-foreground/80 capitalize">
                    {selectedPlugin.dependencies?.join(", ") || "No dependencies required"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Changelog History</h4>
                  <div className="space-y-1 text-foreground/75 font-mono text-[10px]">
                    {selectedPlugin.changelog?.map((change) => (
                      <p key={change}>{change}</p>
                    )) || <p>v1.0.0 - Initial deployment</p>}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/50 bg-secondary/20 flex gap-2 justify-end">
                <Button variant="outline" className="text-xs" onClick={() => setSelectedPlugin(null)}>
                  Close
                </Button>
                
                {!!installedPlugins[selectedPlugin.id] && (
                  <Button
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      const enabled = !!enabledPlugins[selectedPlugin.id];
                      if (enabled) {
                        disablePlugin(selectedPlugin.id);
                        toast.info(`${selectedPlugin.name} disabled`);
                      } else {
                        enablePlugin(selectedPlugin.id);
                        toast.success(`${selectedPlugin.name} enabled`);
                      }
                    }}
                  >
                    {!!enabledPlugins[selectedPlugin.id] ? "Disable" : "Enable"}
                  </Button>
                )}

                {!!installedPlugins[selectedPlugin.id] && selectedPlugin.id === "star-coach" && (
                  <Button
                    variant="outline"
                    className="text-xs text-sky-400 border-sky-500/30 hover:bg-sky-500/10"
                    onClick={() => {
                      useStore.getState().updatePlugin(selectedPlugin.id);
                      toast.success(`${selectedPlugin.name} updated successfully to v1.0.5!`);
                      setSelectedPlugin(null);
                    }}
                  >
                    Update
                  </Button>
                )}

                <Button
                  className="text-xs"
                  onClick={async () => {
                    await handleInstall(selectedPlugin.id, selectedPlugin.name);
                    setSelectedPlugin(null);
                  }}
                >
                  {!!installedPlugins[selectedPlugin.id] ? "Uninstall" : "Install"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
