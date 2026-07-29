"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, AlertTriangle, XCircle, Loader2, ArrowLeft, 
  Settings, RefreshCw, Zap, Server, ShieldAlert, Cpu, Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface HealthCheck {
  status: "Connected" | "Missing" | "Offline" | "Disabled";
  latency: number;
  details?: string;
}

export default function DemoChecklistPage() {
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [systemChecks, setSystemChecks] = useState<Record<string, HealthCheck>>({});
  const [envDetails, setEnvDetails] = useState({
    nodeEnv: "production",
    buildVer: "v9.2.0-stable",
    gitBranch: "main",
    gitCommit: "fa4b7b2"
  });

  useEffect(() => {
    // Retrieve demo mode state from local storage
    const stored = localStorage.getItem("demo_mode_enabled") === "true";
    setDemoMode(stored);
    fetchHealthData();
  }, []);

  async function fetchHealthData() {
    setLoading(true);
    try {
      const res = await fetch("/api/system/health");
      const data = await res.json();
      if (data.success && data.checks) {
        setSystemChecks(data.checks);
        toast.success("Diagnostics refreshed successfully.");
      } else {
        toast.error("Failed to compile complete system checks.");
      }
    } catch {
      toast.error("Connectivity issue connecting to health diagnostic API.");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleDemoMode = () => {
    const nextVal = !demoMode;
    setDemoMode(nextVal);
    localStorage.setItem("demo_mode_enabled", String(nextVal));
    if (nextVal) {
      toast.info("Demo Mode Active: Stream fallbacks enabled for missing API keys.");
    } else {
      toast.success("Demo Mode Deactivated: Normal mode active.");
    }
  };

  const getStatusIcon = (status: HealthCheck["status"]) => {
    switch (status) {
      case "Connected":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case "Missing":
      case "Disabled":
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
    }
  };

  const getStatusBadge = (status: HealthCheck["status"]) => {
    switch (status) {
      case "Connected":
        return <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Connected</span>;
      case "Missing":
      case "Disabled":
        return <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">Disabled</span>;
      default:
        return <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">Offline</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Lights */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[40%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[45%] rounded-full bg-sky-950/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-md border border-slate-800">Demo QA Suite</span>
          </div>
        </div>
      </header>

      {/* Banner */}
      {demoMode && (
        <div className="bg-amber-600/10 border-b border-amber-500/20 py-2.5 px-6 text-center text-xs font-medium text-amber-400 animate-pulse">
          ⚠️ Demo Mode is actively enabled. AI Gateway will serve simulated responses for failed/missing credentials.
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8 z-10">
        
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Zap className="w-7 h-7 text-indigo-500 fill-indigo-500/20" />
            Pre-Demo Readiness Suite
          </h1>
          <p className="text-sm text-slate-400">
            Audit API connectivity, environment setups, database switchers, and configure fallback demo triggers before presentations.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="glass border border-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-sm font-semibold text-white">Live Event Demo Mode</span>
              {demoMode && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />}
            </div>
            <p className="text-xs text-slate-400">
              Force stream fallbacks when local environment variables are offline.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealthData}
              disabled={loading}
              className="border-slate-800 hover:border-slate-700 bg-slate-950 text-xs"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
              Refesh Diagnostics
            </Button>

            <Button
              onClick={handleToggleDemoMode}
              className={`text-xs font-semibold px-6 py-2 rounded-lg transition-all ${
                demoMode 
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              {demoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
            </Button>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Metadata Card */}
          <Card className="glass md:col-span-1 border-slate-900">
            <CardHeader className="pb-3 border-b border-slate-900/60">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Build Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-900/60 pb-2">
                <span className="text-slate-500">Environment</span>
                <span className="font-semibold text-white font-mono">{envDetails.nodeEnv}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900/60 pb-2">
                <span className="text-slate-500">Build Version</span>
                <span className="font-semibold text-white font-mono">{envDetails.buildVer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900/60 pb-2">
                <span className="text-slate-500">Git Branch</span>
                <span className="font-semibold text-indigo-400 font-mono">{envDetails.gitBranch}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Git Commit</span>
                <span className="font-semibold text-sky-400 font-mono">{envDetails.gitCommit}</span>
              </div>
            </CardContent>
          </Card>

          {/* System Checklist Card */}
          <Card className="glass md:col-span-2 border-slate-900">
            <CardHeader className="pb-3 border-b border-slate-900/60">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                Integration Status Matrix
              </CardTitle>
              <CardDescription>Live health checks of primary dependencies</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-slate-900/60">
              {loading && Object.keys(systemChecks).length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-xs text-slate-500 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  Loading diagnostic checklist...
                </div>
              ) : (
                Object.entries(systemChecks).map(([name, check]) => (
                  <div key={name} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <span className="font-semibold text-white">{name}</span>
                        {check.details && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{check.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {check.latency > 0 && (
                        <span className="text-[10px] text-slate-500 font-mono">{check.latency}ms</span>
                      )}
                      {getStatusBadge(check.status)}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

        </div>

        {/* Security & QA Section */}
        <div className="glass border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Presentation Safety Precautions
          </h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2.5">
              <span className="text-indigo-400 font-bold">1.</span>
              <span><strong>Rate Limits</strong>: Guest mode restricts API completions to 20 requests/minute. Log in with a credentials user to increase limits to 60 requests/minute.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-indigo-400 font-bold">2.</span>
              <span><strong>Console Errors</strong>: Hydration mismatches have been eliminated. Charts automatically load post-mount.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-indigo-400 font-bold">3.</span>
              <span><strong>Failover</strong>: If multiple keys are provided inside your settings, the router will cycle and select fallback hosts automatically before reporting failure.</span>
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
}
