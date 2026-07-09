# Supporting Career-Agents

Welcome to the Career-Agents support guide! If you are experiencing issues with the CLI, MCP server, templates, or integrations, this document outlines how to get help and resolve common problems.

---

## 🛠️ Support Channels

### 1. GitHub Discussions (Preferred)
For questions, configuration guides, integration walkthroughs, and architecture discussions:
- **Link:** [GitHub Discussions](https://github.com/karthikrshet/Career-Agents/discussions)
- **Use cases:** "How do I sync this with Cursor?", "Configuring standard-ai templates", sharing ideas.

### 2. GitHub Issues
To report bugs, CLI runtime crashes, validation failures, or incorrect registry entries:
- **Link:** [GitHub Issues](https://github.com/karthikrshet/Career-Agents/issues)
- **Use cases:** Bug reports, command errors, formatting or registry mismatch requests.

### 3. Community Discord / Slack
For real-time chats and collaborating with other contributors, please refer to:
- **Link:** Mentioned in our community announcements on the repo.

---

## ⚡ Troubleshooting Quick Reference

### CLI Diagnostic Command
If something isn't working, start by running the doctor check:
```bash
career-agents doctor
# or via node directly
node scripts/cli.js doctor
```

### Common Issues

#### 1. MCP Server Fails to Start / Connection Timeout
- **Symptoms:** Editors like Cursor or Claude Desktop fail to connect, showing "Stdio server error" or timeout.
- **Fix:** 
  1. Ensure you have Node.js version 18 or higher installed (`node -v`).
  2. Test executing the server locally: `node scripts/cli.js mcp`. It should wait quietly for JSON-RPC stdio inputs without crashing.
  3. Verify the path configuration in your Claude/Cursor configuration file uses absolute paths or matches `npx -y career-agents mcp` exactly.

#### 2. Missing Database / Search Index Errors
- **Symptoms:** Search returning 0 results, missing knowledge graph, or empty bundles listing.
- **Fix:** Force-rebuild the registry indices:
  ```bash
  career-agents update
  ```

#### 3. Command Line Executable Not Found
- **Symptoms:** Running `career-agents` returns command not found.
- **Fix:** If installed globally via npm, ensure your npm global prefix is added to your environment `PATH` variable.
  ```bash
  npm install -g career-agents
  ```

---

## 🚀 Professional Support
If you need personalized assistance or enterprise-level integration support, please contact the maintainers or open an inquiry on GitHub.
