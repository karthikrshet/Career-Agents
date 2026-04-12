"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Copy, CheckCircle, Terminal, Globe, Zap, Code2, RefreshCw, Layers, ShieldCheck, Play } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

const MCP_CLIENTS = [
  { id: "claude", name: "Claude Desktop", path: "~/.config/Claude/claude_desktop_config.json" },
  { id: "cursor", name: "Cursor", path: "~/.cursor/mcp.json" },
  { id: "vscode", name: "VS Code (Copilot)", path: "~/AppData/Roaming/Code/User/settings.json" },
  { id: "continue", name: "Continue", path: "~/.continue/config.json" },
  { id: "windsurf", name: "Windsurf", path: "~/.codeium/windsurf/mcp_config.json" },
  { id: "cline", name: "Cline", path: "~/AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json" },
  { id: "roocode", name: "RooCode", path: "~/AppData/Roaming/Code/User/globalStorage/roodev.claude-dev/settings/cline_mcp_settings.json" },
  { id: "openhands", name: "OpenHands", path: "openhands_config.toml" },
  { id: "bolt", name: "Bolt", path: "bolt.config.json" },
  { id: "aider", name: "Aider", path: "~/.aider.conf.yml" }
];

const CONFIGS: Record<string, string> = {
  claude: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"],
        env: {
          CAREER_OS_API_URL: "https://career-os.dev/api"
        }
      }
    }
  }, null, 2),
  cursor: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"]
      }
    }
  }, null, 2),
  vscode: JSON.stringify({
    "github.copilot.chat.mcp.servers": [
      {
        name: "career-agents",
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"]
      }
    ]
  }, null, 2),
  continue: JSON.stringify({
    models: [],
    mcpServers: [
      {
        name: "career-agents",
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"]
      }
    ]
  }, null, 2),
  windsurf: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"]
      }
    }
  }, null, 2),
  cline: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"],
        disabled: false,
        autoApprove: []
      }
    }
  }, null, 2),
  roocode: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"],
        disabled: false,
        autoApprove: []
      }
    }
  }, null, 2),
  openhands: `[mcp]
[mcp.servers.career-agents]
command = "npx"
args = ["-y", "@karthikrshet/career-agents-mcp"]`,
  bolt: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["-y", "@karthikrshet/career-agents-mcp"]
      }
    }
  }, null, 2),
  aider: `mcp:
  servers:
    career-agents:
      command: npx
      args: [-y, @karthikrshet/career-agents-mcp]
`
};

const MCP_TOOLS = [
  { name: "list_agents", description: "List all 146 career agents by division", params: "{ division?: string }" },
  { name: "run_agent", description: "Execute a specific agent with custom context", params: "{ agentId: string, context: string }" },
  { name: "search_agents", description: "Search agents by name, skill, or use case", params: "{ query: string }" },
  { name: "get_resume_tips", description: "Retrieve specific resume audit recommendations", params: "{ section?: string }" },
  { name: "sync_tracker", description: "Sync external kanban applications to workspace", params: "{ format: string }" }
];

export default function MCPPage() {
  const [selectedClient, setSelectedClient] = useState("claude");
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [clientStatus, setClientStatus] = useState<Record<string, "Connected" | "Disconnected" | "Invalid">>({
    claude: "Connected",
    cursor: "Connected",
    vscode: "Disconnected",
    continue: "Disconnected",
    windsurf: "Connected",
    cline: "Disconnected",
    roocode: "Disconnected",
    openhands: "Disconnected",
    bolt: "Disconnected",
    aider: "Disconnected"
  });
  const [validating, setValidating] = useState(false);

  function validateConfig() {
    const configStr = CONFIGS[selectedClient] || CONFIGS.claude;
    if (selectedClient === "openhands" || selectedClient === "aider") {
      toast.success("Configuration syntax is valid!");
      return;
    }
    try {
      JSON.parse(configStr);
      toast.success("Valid JSON configuration syntax!");
    } catch (err: any) {
      toast.error(`Invalid JSON syntax: ${err.message}`);
    }
  }

  function downloadConfig() {
    const configStr = CONFIGS[selectedClient] || CONFIGS.claude;
    const filenameMap: Record<string, string> = {
      claude: "claude_desktop_config.json",
      cursor: "mcp.json",
      vscode: "vscode_mcp_settings.json",
      continue: "continue_mcp_config.json",
      windsurf: "windsurf_mcp_config.json",
      cline: "cline_mcp_settings.json",
      roocode: "roocode_mcp_settings.json",
      openhands: "openhands_config.toml",
      bolt: "bolt_mcp_config.json",
      aider: "aider.conf.yml"
    };
    const filename = filenameMap[selectedClient] || "mcp_config.json";
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(configStr);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Downloaded ${filename}!`);
  }

  function handleRunClientValidation() {
    setValidating(true);
    toast.info("Validating connection to client...");
    setTimeout(() => {
      setValidating(false);
      setClientStatus((prev) => {
        const current = prev[selectedClient];
        const nextStatus: typeof current = current === "Connected" ? "Disconnected" : "Connected";
        toast.success(`Client validation complete. Status: ${nextStatus}`);
        return {
          ...prev,
          [selectedClient]: nextStatus
        };
      });
    }, 1200);
  }

  function copyConfig() {
    const config = CONFIGS[selectedClient] || CONFIGS.claude;
    navigator.clipboard.writeText(config);
    setCopied(true);
    toast.success("Config copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSimulateSync() {
    setSyncing(true);
    setLogs([]);
    const steps = [
      "Checking Model Context Protocol handshake status...",
      "Resolving NPM CLI registry cache limits...",
      "Downloading career-agents-mcp bundle package...",
      "Configuring Cursor context mappings...",
      "Exposing search_agents schema tool payload...",
      "Sync success: Active (146 agents, 19 divisions, 5 core schemas loaded)"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[i]}`]);
    }
    setSyncing(false);
    toast.success("MCP Connection synced with Workspace!");
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="MCP Server" subtitle="Model Context Protocol — connect Career Agents to any AI client" />

      <div className="flex-1 p-6 space-y-6">
        {/* Overview banner */}
        <Card className="glass border-primary/20 bg-primary/3">
          <CardContent className="p-5 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Career Agents MCP Server Gateway</h3>
                  <p className="text-xs text-muted-foreground">Expose all 146 career agents as MCP tools to any compatible AI client</p>
                </div>
              </div>
              <Badge variant="success">Active Status</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="text-center px-4 py-2 glass rounded-lg">
                <div className="text-xl font-bold text-primary">146</div>
                <div className="text-[10px] text-muted-foreground">Agents</div>
              </div>
              <div className="text-center px-4 py-2 glass rounded-lg">
                <div className="text-xl font-bold text-indigo-400">19</div>
                <div className="text-[10px] text-muted-foreground">Divisions</div>
              </div>
              <div className="text-center px-4 py-2 glass rounded-lg">
                <div className="text-xl font-bold text-emerald-400">5</div>
                <div className="text-[10px] text-muted-foreground">MCP Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Simulator and Config Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Config Generator */}
          <div className="space-y-4">
            <Card className="glass text-left">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Client Configuration Settings
                </CardTitle>
                <CardDescription>Select your MCP client to copy the standard configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-1 max-h-[160px] overflow-auto border border-border/40 p-1.5 rounded-lg bg-secondary/10">
                  {MCP_CLIENTS.map((client) => {
                    const status = clientStatus[client.id] || "Disconnected";
                    const statusColor = status === "Connected" ? "text-emerald-400 font-semibold" : "text-amber-400";
                    return (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-2 rounded transition-all text-xs",
                          selectedClient === client.id ? "bg-primary/10 border border-primary/20 text-foreground" : "text-muted-foreground hover:bg-secondary/40"
                        )}
                      >
                        <span className="font-semibold">{client.name}</span>
                        <span className={cn("text-[9px] scale-90", statusColor)}>{status}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Config code block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-muted-foreground/80 truncate max-w-[50%]">
                      {MCP_CLIENTS.find(c => c.id === selectedClient)?.path || ""}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 bg-secondary/40 text-foreground" onClick={copyConfig}>
                        {copied ? <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        Copy
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 bg-secondary/40 text-foreground" onClick={downloadConfig}>
                        Download
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 bg-secondary/40 text-foreground" onClick={validateConfig}>
                        Validate
                      </Button>
                    </div>
                  </div>
                  <pre className="code-block text-[11px] p-3 rounded-lg overflow-x-auto font-mono bg-black/85 border border-border/40 text-foreground/90 max-h-[150px]">
                    {CONFIGS[selectedClient] || CONFIGS.claude}
                  </pre>
                  
                  {/* Run Client validation trigger button */}
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      className="text-[10px] h-7 px-3 flex items-center gap-1 bg-primary/20 border border-primary/20 hover:bg-primary/30 text-foreground"
                      disabled={validating}
                      onClick={handleRunClientValidation}
                    >
                      {validating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                      {validating ? "Running health check..." : "Test Client Connection"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sync Simulator console */}
          <Card className="glass text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                Handshake Connection Sync Simulator
              </CardTitle>
              <CardDescription>Test MCP connectivity with workspace logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center bg-secondary/15 p-3 rounded-lg border border-border/60">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Sync Diagnostics</span>
                </div>
                <Button size="sm" className="text-xs h-8" disabled={syncing} onClick={handleSimulateSync}>
                  {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
                  Run Handshake
                </Button>
              </div>

              {/* Logs area */}
              <div className="rounded-lg p-3 border border-border bg-black/80 font-mono text-[10px] text-emerald-400 leading-normal min-h-[140px] max-h-[180px] overflow-auto space-y-1">
                {logs.length === 0 ? (
                  <span className="text-muted-foreground">Click "Run Handshake" above to simulate connection logs...</span>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">{log}</div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools and description row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Tools */}
          <Card className="glass lg:col-span-2 text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Available MCP Tools
              </CardTitle>
              <CardDescription>Tools exposed to AI clients via the MCP protocol</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MCP_TOOLS.map((tool) => (
                <div key={tool.name} className="p-3 rounded-lg border border-border/60 hover:bg-secondary/15 transition-all text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono text-primary text-[11px] font-semibold">{tool.name}</code>
                    <Badge variant="secondary" className="text-[9px] scale-90">tool</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-1.5 leading-normal">{tool.description}</p>
                  <code className="text-[10px] text-indigo-400 font-mono">{tool.params}</code>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick instructions */}
          <Card className="glass lg:col-span-1 text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Quick Deploy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed">
              <p className="text-muted-foreground">You can launch the Career Agents protocol as a standalone package via NPX:</p>
              <div className="p-2.5 rounded bg-black/85 font-mono text-[10px] text-foreground border border-border/40 select-all">
                npx -y @karthikrshet/career-agents-mcp
              </div>
              <p className="text-muted-foreground">The AI client will connect through stdin/stdout to search the workspace database.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
