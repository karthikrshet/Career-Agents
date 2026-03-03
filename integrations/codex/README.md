# Codex Integration Guide

This directory documents patterns and tools to integrate **Career-Agents** with **Codex**.

## Usage

### Option 1: System Prompts
Copy the complete contents of an agent file (e.g., [`career/placement-coach.md`](../../career/placement-coach.md)) and paste it into the Codex system instructions block.

### Option 2: CLI packaging
You can export any agent directly as a Codex package using the converter script:
```bash
./scripts/convert.sh --tool codex --agent career/placement-coach.md --out ./build
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
