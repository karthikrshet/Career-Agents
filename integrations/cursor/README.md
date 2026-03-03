# Cursor Integration Guide

This directory documents patterns and tools to integrate **Career-Agents** with **Cursor**.

## Usage

### Option 1: Workspace Cursor Rules (.cursorrules)
Copy the complete contents of an agent file (e.g., [`career/placement-coach.md`](../../career/placement-coach.md)) and paste it into the `.cursorrules` file at the root of your workspace.

### Option 2: CLI packaging
You can export any agent directly as a Cursor custom rule package using the converter script:
```bash
./scripts/convert.sh --tool cursor --agent career/placement-coach.md --out ./build
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
