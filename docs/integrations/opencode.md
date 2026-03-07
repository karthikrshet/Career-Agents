# OpenCode Integration Guide

This guide documents how to integrate and use **Career-Agents** with **OpenCode**.

## Installation Guide

OpenCode is an open source coding assistant framework. Clone the server and install its CLI helper:
```bash
git clone https://github.com/opencode-dev/opencode-cli
cd opencode-cli && npm install -g .
```

## Usage Guide

OpenCode reads local rules and triggers workflows. Start OpenCode in a developer directory:
```bash
opencode start
```

## Agent Loading Guide

Export the agent using the TXT or Prompt Bundle format:
```bash
career-agents run ats-resume-reviewer --export txt
```
Move the exported prompt into the `.opencode/instructions/` directory so it loaded on startup:
```bash
mkdir -p .opencode/instructions
cp build/exports/ats-resume-reviewer.txt .opencode/instructions/
```

## Best Practices

- **Avoid Redundant Instructions**: Remove markdown tags in custom instructions if OpenCode fails to parse them; use TXT format exports.
- **Limit Active Agents**: Only keep active the agent relevant to your current developer task (e.g. `code-reviewer.txt` when editing code).
- **Update Checks**: Check logs to ensure OpenCode loads all files under `.opencode/instructions/`.
