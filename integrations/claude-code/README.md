# Claude Code Integration Guide

This directory documents patterns and tools to integrate **Career-Agents** with **Claude Code**.

## Usage

### Option 1: Importing as Custom Project Instructions
Copy the complete contents of an agent file (e.g., [`career/placement-coach.md`](../../career/placement-coach.md)) and paste it into the project's instructions directory or append it as system prompts.

### Option 2: CLI packaging
You can export any agent directly as a Claude Code JSON subagent manifest using the converter script:
```bash
./scripts/convert.sh --tool claude-code --agent career/placement-coach.md --out ./build
```

---

## Future Ready Runtimes

The platform is designed to be compatible with:
- GitHub Copilot
- Antigravity
- OpenCode
- OpenClaw
- Windsurf
- Aider
- Qwen
- Kimi
- Osaurus
- Hermes
