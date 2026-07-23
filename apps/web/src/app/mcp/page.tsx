"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Copy, CheckCircle, Terminal, Globe, Zap, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

const MCP_CLIENTS = [
  { id: "claude", name: "Claude Desktop", status: "Supported", color: "text-emerald-400" },
  { id: "cursor", name: "Cursor", status: "Supported", color: "text-emerald-400" },
  { id: "windsurf", name: "Windsurf", status: "Supported", color: "text-emerald-400" },
  { id: "vscode", name: "VS Code (Copilot)", status: "In Progress", color: "text-amber-400" },
  { id: "openai", name: "OpenAI Assistants", status: "Coming Soon", color: "text-muted-foreground" },
];

const CONFIGS: Record<string, string> = {
  claude: JSON.stringify({
    mcpServers: {
      "career-agents": {
        command: "npx",
        args: ["career-agents", "mcp"],
        env: {}
      }
    }
  }, null, 2),
  cursor: JSON.stringify({
    "career-agents": {
      command: "npx",
      args: ["career-agents", "mcp"]
    }
  }, null, 2),
};

const MCP_TOOLS = [
  { name: "list_agents", description: "List all 146 career agents by division", params: "{ division?: string }" },
  { name: "run_agent", description: "Execute a specific agent with custom context", params: "{ agentId: string, context: string }" },
  { name: "search_agents", description: "Search agents by name, skill, or use case", params: "{ query: string }" },
  { name: "list_divisions", description: "List all 19 career divisions with agent counts", params: "{}" },
  { name: "get_agent", description: "Get full agent prompt and metadata", params: "{ agentId: string }" },
];

export default function McpPage() {
  const [selectedClient, setSelectedClient] = useState("claude");
  const [copied, setCopied] = useState(false);

  function copyConfig() {
    const config = CONFIGS[selectedClient] || CONFIGS.claude;
    navigator.clipboard.writeText(config);
    setCopied(true);
    toast.success("Config copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="MCP Server" subtitle="Model Context Protocol — connect Career Agents to any AI client" />

      <div className="flex-1 p-6 space-y-6">
        {/* Overview banner */}
        <Card className="glass border-primary/20 bg-primary/3">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Career Agents MCP Server</h3>
                <p className="text-xs text-muted-foreground">Expose all 146 career agents as MCP tools to any compatible AI client</p>
              </div>
              <Badge variant="success" className="ml-auto">Active</Badge>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Config Generator */}
          <div className="space-y-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Client Configuration
                </CardTitle>
                <CardDescription>Select your MCP client to generate the config</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  {MCP_CLIENTS.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClient(client.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                        selectedClient === client.id ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary/30"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedClient === client.id ? "bg-primary" : "bg-muted"
                      )} />
                      <span className="text-sm font-medium flex-1">{client.name}</span>
                      <span className={cn("text-xs", client.color)}>{client.status}</span>
                    </button>
                  ))}
                </div>

                {/* Config code block */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {selectedClient === "claude" ? "~/.config/claude/claude_desktop_config.json" : ".cursor/mcp.json"}
                    </p>
                    <Button size="icon-sm" variant="ghost" onClick={copyConfig}>
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                  <pre className="code-block text-xs overflow-x-auto">
                    {CONFIGS[selectedClient] || CONFIGS.claude}
                  </pre>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50 space-y-1">
                  <p className="text-xs font-medium">Quick Start</p>
                  <div className="code-block text-[10px] py-2">
                    npm install -g career-agents
                  </div>
                  <div className="code-block text-[10px] py-2">
                    npx career-agents mcp
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Tools */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Available MCP Tools
              </CardTitle>
              <CardDescription>Tools exposed to AI clients via the MCP protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {MCP_TOOLS.map((tool) => (
                <div key={tool.name} className="p-3 rounded-lg border border-border hover:border-border/80 hover:bg-secondary/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs font-mono text-primary">{tool.name}</code>
                    <Badge variant="secondary" className="text-[9px]">tool</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">{tool.description}</p>
                  <code className="text-[10px] text-indigo-400 font-mono">{tool.params}</code>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Usage examples */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Usage Example (Claude Desktop)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="code-block text-xs">
{`User: "Find me the best agents for resume optimization"

Claude: Using career-agents MCP tool: search_agents({ query: "resume" })

→ Returns: 12 agents including ats-optimizer, bullet-rewriter, 
  keyword-aligner, xar-format-coach...

User: "Run the ats-optimizer for my resume"

Claude: Using career-agents MCP tool: run_agent({ 
  agentId: "ats-optimizer",
  context: "[resume text]"
})`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


