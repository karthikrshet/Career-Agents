# Model Context Protocol (MCP) Server Guide

This guide details how to integrate and use the **Career-Agents MCP Server** in modern AI coding assistants (such as Claude Desktop, Cursor, Windsurf, OpenCode, and others) to natively interact with the Career Operating System.

---

## 🛠️ Installation & Configuration

### 1. Claude Desktop
Add to `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):
```json
{
  "mcpServers": {
    "career-agents": {
      "command": "node",
      "args": ["d:/CodeMyFYP-Agents/scripts/cli.js", "mcp"]
    }
  }
}
```

### 2. Cursor IDE
Navigate to **Settings** -> **Features** -> **MCP**. Add a new server:
- **Name:** `career-agents`
- **Type:** `command`
- **Command:** `node d:/CodeMyFYP-Agents/scripts/cli.js mcp`

---

## 🔧 Tools Reference

The server exposes 10 specialized tools:

| Tool Name | Arguments | Returns |
|---|---|---|
| `search_agents` | `query` (string) | Matching agents, descriptions, and metadata |
| `recommend_agents` | `skills`, `experience`, `role`, `company` | Recommended agents, workflows, and bundles |
| `career_assessment` | `roadmapScore`, `resumeScore`, `interviewScore`, `networkingScore`, `portfolioScore` | Overall compliance score, recommendations, and roadmap |
| `resume_score` | `resumeText` (string) | ATS score, missing keywords, and layout suggestions |
| `job_match` | `resume` (string), `jobDescription` (string) | Match score, missing keywords, and recommended agents |
| `company_track` | `company` (string ID) | Interview loops, required skills, and study playbooks |
| `career_path` | `careerPath` (string ID) | Competencies, career levels, and study plans |
| `workflow_lookup` | `workflow` (string ID) | Step-by-step checklists, estimated duration, and agents |
| `agent_details` | `agentId` (string ID) | Full metadata instructions and core system prompts |
| `knowledge_graph` | `entity` (string) | Categorized lists of connected agents, paths, and skills |

---

## 📁 Resources Reference

Registries are exposed as resources:
- `career-agents://registry/agents`: Dynamic agent database catalog.
- `career-agents://registry/paths`: Sequenced milestone roadmaps.
- `career-agents://registry/companies`: Interview process prep tracks.
- `career-agents://registry/workflows`: Multi-agent checklists.
- `career-agents://registry/templates`: ATS resume templates.
- `career-agents://registry/graph`: Relational knowledge graph nodes.
- `career-agents://registry/search-index`: Search weights index.

---

## 🛡️ Security & Performance Features

- **Safe Resource Access**: Prevents directory traversal attacks. Reads are validated to ensure they stay within the workspace boundary.
- **Caching**: Exposes file-level in-memory cache to load databases instantly without taxing disk operations.
- **Rate Limiting**: Includes a stdio token safeguard limit to protect client processes from buffer overflows.

---

## 🔍 Troubleshooting

- **Diagnostic Logs**: Inspect `exports/logs/mcp.log` for execution errors, parse anomalies, and client query audits.
- **Audit Logs**: Inspect `exports/logs/mcp_audit.log` for client request logs and success audits.
- **Green Check**: Ensure the Green dot is visible in Cursor/Windsurf MCP features panel. If not, verify that the Node version is >= 18.
