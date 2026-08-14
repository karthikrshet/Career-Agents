# Codex Integration Guide

This guide details how to integrate the **Career-Agents MCP Server** and agent manifests directly into your **OpenAI Codex CLI** and **Codex Agent Runtime** environments.

---

## 🛠️ Step-by-Step MCP Server Configuration

You can configure Career-Agents Model Context Protocol (MCP) in Codex either via the Codex CLI or by adding the server configuration JSON.

### Method 1: Codex CLI MCP Command

Register the Career-Agents stdio MCP server using the `codex mcp add` command:

```bash
# Using local repository CLI
codex mcp add career-agents -- node d:/CodeMyFYP-Agents/scripts/cli.js mcp

# Or via npx
codex mcp add career-agents -- npx -y career-agents mcp
```

*(Note: Replace `d:/CodeMyFYP-Agents` with the absolute path to your local repository clone).*

### Method 2: JSON Configuration File

Add the `career-agents` server definition to your Codex configuration file (e.g., `~/.codex/config.json`, `.codex/config.json`, or `codex_mcp.json`):

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

Or when running from the published NPM package:

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

## 🚀 Usage & Interactive Examples in Codex

Once connected, Codex gains direct access to all 25+ Career Agents MCP tools and resource registries. You can prompt Codex in your terminal or editor session:

### Example 1: Discover and Recommend Agents
- **Codex Query:**
  ```text
  codex "Recommend career agents to help me prepare for a Staff Distributed Systems Engineer interview at Google."
  ```
- **Execution Flow:**
  - Codex invokes `recommend_agents` and `company_track` for `google`.
  - Returns recommended domain agents, system design prep checklists, and interview question sets.

### Example 2: Resume Scoring & ATS Audit
- **Codex Query:**
  ```text
  codex "Audit my resume at ./resume.pdf against ATS benchmarks for Senior Backend Engineer roles."
  ```
- **Execution Flow:**
  - Codex invokes `resume_score` / `resume_review` on the local file.
  - Generates detailed score metrics (action verbs, quantifiable metrics, skill density, formatting checks).

### Example 3: Career Roadmap Generation
- **Codex Query:**
  ```text
  codex "Generate a 30-60-90 day transition roadmap from Frontend Developer to Full-Stack AI Engineer."
  ```
- **Execution Flow:**
  - Codex calls `roadmap` with the target role and outputs structured milestone deliverables.

---

## 📦 Standalone Agent Export & System Prompt Loading

In addition to MCP, Codex can load standalone exported agent instructions:

### 1. Export an Agent for Codex
```bash
node scripts/cli.js use google-interview-coach codex
```
This writes a JSON manifest to `exports/use/google-interview-coach.codex.json`.

### 2. Load into Codex Configuration
Reference the exported JSON instructions in your Codex agent runtime config:
```json
{
  "system_instructions_file": "./exports/use/google-interview-coach.codex.json"
}
```

---

## 💡 Best Practices

- **MCP Health Check:** Run `node scripts/cli.js doctor` prior to server configuration to verify all local indexes and dependencies are in sync.
- **Local Privacy:** All MCP tool executions (ATS scoring, company tracks, workflow lookups) run 100% locally and offline without external API dependencies.
- **Relative Path Resolution:** Use absolute paths in `codex_mcp.json` / `~/.codex/config.json` to ensure the stdio transport resolves correctly from any working directory.
