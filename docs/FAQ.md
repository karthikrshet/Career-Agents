# FAQ

This document addresses frequently asked questions regarding the Career Operating System configurations, CLI commands, and MCP servers.

---

## General Questions

### What is Career-Agents?
Career-Agents is an open-source Career Operating System. It modularizes professional development tasks (resume review, portfolio audit, mock interviews, job tracking) into a unified package CLI, MCP server, and React dashboard.

### Does the CLI require an API key?
By default, the CLI operates in simulated mode using local rules engines. To connect with live language models (such as Anthropic Claude or Google Gemini), add the respective environment variables:
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

---

## Technical Questions

### How does the Model Context Protocol (MCP) server integration work?
The MCP server communicates over standard input/output (stdio). When configured in compatible editors (like Cursor or Claude Desktop), the editor spawns the process and calls tools dynamically (e.g. `resume_review` or `github_review`).

### How can I add a custom command to the CLI?
Write a JavaScript plugin module matching the export schema (`name`, `description`, `execute()`) and place it inside the root `plugins/` directory. The plugin manager will automatically import and register the command.

### How do I recompile system indexes?
Whenever you modify agent markdown profiles, company track JSON databases, or career roadmaps, run the following generation script:
```bash
python scripts/generate-data.py
```
This updates the compiled database configurations (`career-os.json`, `search-index.json`, and `knowledge-graph.json`).
