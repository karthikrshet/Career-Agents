"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Download, Check, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import type { Plugin } from "@/types";

const MARKETPLACE_PLUGINS: Plugin[] = [
  { id: "resume-pdf", name: "Resume PDF Parser", description: "Extract structured data from PDF resumes using OCR and layout analysis.", version: "1.2.0", author: "Career OS", downloads: 4120, enabled: false, installed: false, category: "Resume", tags: ["pdf", "ocr", "parsing"] },
  { id: "GitBranch-graphql", name: "GitBranch GraphQL Analyzer", description: "Deep portfolio analysis using GitBranch's GraphQL API — contribution heatmaps, PR analytics.", version: "2.0.1", author: "Career OS", downloads: 2890, enabled: false, installed: false, category: "GitBranch", tags: ["graphql", "contributions"] },
  { id: "ats-pro", name: "ATS Score Pro", description: "Enterprise ATS simulation against 20+ ATS systems (Greenhouse, Lever, Workday).", version: "1.5.0", author: "Community", downloads: 1650, enabled: false, installed: false, category: "Resume", tags: ["ats", "enterprise"] },
  { id: "salary-intel", name: "Salary Intelligence", description: "Real-time compensation benchmarks from Levels.fyi, Glassdoor, and Blind.", version: "1.0.3", author: "Community", downloads: 3300, enabled: false, installed: false, category: "Jobs", tags: ["salary", "compensation"] },
  { id: "Link2-scraper", name: "Link2 Profile Scraper", description: "Import your Link2 profile data automatically via Chrome extension integration.", version: "0.9.0", author: "Community", downloads: 890, enabled: false, installed: false, category: "Link2", tags: ["Link2", "import"] },
  { id: "voice-interview", name: "Voice Interview Mode", description: "Practice interviews with speech recognition and real-time transcription.", version: "1.1.0", author: "Career OS", downloads: 2100, enabled: false, installed: false, category: "Interview", tags: ["voice", "speech", "transcription"] },
  { id: "company-reviews", name: "Company Review Aggregator", description: "Aggregate Glassdoor, Blind, and Levels.fyi reviews inline with your prep hub.", version: "1.0.0", author: "Community", downloads: 1200, enabled: false, installed: false, category: "Jobs", tags: ["glassdoor", "blind", "reviews"] },
  { id: "cover-letter", name: "Cover Letter Generator", description: "AI-powered cover letter generator tailored to each job description.", version: "1.3.0", author: "Career OS", downloads: 5600, enabled: false, installed: false, category: "Resume", tags: ["cover-letter", "ai"] },
];

const CATEGORIES = ["All", "Resume", "GitBranch", "Link2", "Interview", "Jobs"];

export default function MarketplacePage() {
  const [installedPlugins, setInstalledPlugins] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = MARKETPLACE_PLUGINS.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  function handleInstall(id: string, name: string) {
    setInstalledPlugins((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!installedPlugins[id]) {
      toast.success(`${name} installed`);
    } else {
      toast.success(`${name} uninstalled`);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Plugin Marketplace" subtitle="Extend Career OS with community and official plugins" />

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
          <div className="flex gap-1">
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
            return (
              <motion.div
                key={plugin.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="glass glass-hover h-full flex flex-col">
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{plugin.category}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{plugin.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 flex-1 leading-relaxed">{plugin.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                      <span>v{plugin.version} · {plugin.author}</span>
                      <span>{plugin.downloads.toLocaleString()} installs</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {plugin.tags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-secondary text-muted-foreground">{t}</span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant={isInstalled ? "secondary" : "default"}
                      className="w-full"
                      onClick={() => handleInstall(plugin.id, plugin.name)}
                    >
                      {isInstalled ? (
                        <><Check className="w-3.5 h-3.5" /> Installed</>
                      ) : (
                        <><Download className="w-3.5 h-3.5" /> Install</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


