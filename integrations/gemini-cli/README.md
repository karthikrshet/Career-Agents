# Gemini CLI Integration Guide

This directory documents patterns and tools to integrate **Career-Agents** with **Gemini CLI**.

## Usage

### Option 1: Direct Prompt Loading
Copy the complete contents of an agent file (e.g., [`career/placement-coach.md`](../../career/placement-coach.md)) and pipe or pass it as system instructions when invoking the Gemini CLI.

### Option 2: CLI packaging
You can export any agent directly as a Gemini CLI config template using the converter script:
```bash
./scripts/convert.sh --tool gemini-cli --agent career/placement-coach.md --out ./build
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
