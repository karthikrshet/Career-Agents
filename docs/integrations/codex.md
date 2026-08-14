# Codex Integration Guide

This guide documents how to integrate and use **Career-Agents** with **OpenAI Codex** and the **Codex Agent Runtime**, including native Model Context Protocol (MCP) server support.

---

## 🔌 Model Context Protocol (MCP) Server Setup

The recommended way to use Career Agents in Codex is via the stdio MCP server.

### 1. Register via Codex CLI
```bash
# Using local repository CLI
codex mcp add career-agents -- node d:/CodeMyFYP-Agents/scripts/cli.js mcp

# Or using npx
codex mcp add career-agents -- npx -y career-agents mcp
```

### 2. Register via JSON Configuration File
Add the server definition into your `~/.codex/config.json`, `.codex/config.json`, or workspace `codex_mcp.json`:

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

Once configured, Codex can directly call all 25+ Career Agents MCP tools such as `recommend_agents`, `resume_score`, `company_track`, `roadmap`, and `workflow_lookup`.

---

## 📦 Agent Manifest Loading (Alternative)

Codex also supports reading structured system prompt instructions from exported agent configurations.

### 1. Export Agent Config
Export any Career Agent into a Codex-ready JSON configuration:
```bash
career-agents use google-interview-coach codex
```

### 2. Load into Codex Runtime
Reference the exported JSON file in your Codex configuration:
```json
{
  "system_instructions_file": "./exports/use/google-interview-coach.codex.json",
  "tools": ["terminal", "fs_reader"]
}
```

---

## 💡 Best Practices

- **Strict Validation**: Always run `career-agents doctor` prior to loading config files to ensure JSON syntax matches Codex expectations.
- **Offline & Private**: All MCP tool executions (ATS scoring, company tracks, workflow lookups) run 100% locally and offline without external API dependencies.
- **State Logs**: Review Codex state runtime logs to verify that the `career-agents` MCP server connects with green status.
