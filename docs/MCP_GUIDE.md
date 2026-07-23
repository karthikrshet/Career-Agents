# Model Context Protocol Guide

This document describes how to integrate the Career OS Model Context Protocol (MCP) server with compatible developer environments.

---

## Overview

The Model Context Protocol (MCP) server enables language model assistants to query Career OS databases, execute resume reviews, evaluate repository metadata, and construct roadmap paths natively within their workspace.

---

## Stdio Server Transport

The MCP server runs over standard input/output (stdio). Start the transport layer using:

```bash
npx -y career-agents mcp
```

---

## Editor Configurations

### 1. Claude Desktop

Add the server definition to your local configuration file:
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "career-agents": {
      "command": "npx",
      "args": ["-y", "career-agents", "mcp"]
    }
  }
}
```

### 2. Cursor

Configure Cursor to connect to the Stdio server:
1. Navigate to **Cursor Settings** -> **Features** -> **MCP**.
2. Click **Add New MCP Server**.
3. Apply the following options:
   - **Name**: `career-agents`
   - **Type**: `stdio`
   - **Command**: `npx -y career-agents mcp`

### 3. Windsurf

Add the configuration block to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "career-agents": {
      "command": "npx",
      "args": ["-y", "career-agents", "mcp"]
    }
  }
}
```

---

## Protocol Capabilities

### 1. Resources
Exposes static index registries to client LLMs over standard URI schemas:
- `career-agents://registry/agents`: Lists name, division, and description metadata of all 146 active coaches.
- `career-agents://registry/workflows`: Catalog of step-by-step career path blueprints.

### 2. Tools
Exposes functional endpoints to run execution blocks:
- `recommend_agents`: Suggests agent coaches based on user profiles.
- `resume_review`: Audits formatting and content patterns on target resumes.
- `github_review`: Grades developer repository write-ups and README configurations.
- `linkedin_review`: Scans headlines and profile summary keyword hooks.
- `career_dashboard`: Serializes progress metrics checklist files.
- `mock_interview`: Initiates conversational STAR feedback sessions.
- `roadmap`: Details target 30-60-90 day readiness steps.
