# Troubleshooting Guide

This guide details diagnostics steps and fixes for common setup failures, stdio timeouts, and package issues.

---

## Command Line Interface (CLI) Issues

### Command Not Found: career-agents
If running the global command returns an executable not found error:
1. Verify the npm global installation completed:
   ```bash
   npm install -g career-agents
   ```
2. Verify that your global npm path prefix is appended to your shell environment `PATH` variable. Find your npm prefix using:
   ```bash
   npm config get prefix
   ```

### Validation Failures
If running `npm test` or `python scripts/validate.py` fails:
- Check the error log reports for broken markdown links. Ensure all relative paths pointing to files exist.
- Ensure all agent files have standard section headings and contain at least 300 words.

---

## Model Context Protocol (MCP) Issues

### Stdio Server Fails to Connect
If Cursor or Claude Desktop fail to connect:
1. Verify that your system has Node.js version 18+ installed.
2. Test running the transport channel locally inside a terminal:
   ```bash
   node scripts/cli.js mcp
   ```
   It should wait silently without raising errors or crashing.
3. Check the path configured in your editor. Ensure it uses the correct command sequence (`npx -y career-agents mcp` or absolute paths).
4. Inspect the client logs:
   - **Claude Desktop logs**: Located under `%APPDATA%/Claude/logs/` (Windows) or `~/Library/Logs/Claude/` (macOS).

---

## Web Dashboard Issues

### Next.js Compile Warnings
If `npm run build` fails inside `apps/web/`:
- Ensure you have executed `npm install` inside `apps/web/` to populate target type configurations in `node_modules`.
- Check if your TSX text blocks contain unescaped character elements (such as `>` or `->`). Replace them with character entities (`&rarr;` or `&gt;`).
