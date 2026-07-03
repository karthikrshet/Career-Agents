# Codex Integration Guide

This guide documents how to integrate and use **Career-Agents** with **Codex**.

## Installation Guide

Codex runs as an agentic backend server or packaging runtime. Ensure Codex command-line tools or SDK is installed:
```bash
pip install codex-agent-runtime
```

## Usage Guide

Codex processes structured system instructions and tool schemas. Initialize the Codex runtime in your project directory:
```bash
codex init --workspace .
```

## Agent Loading Guide

Codex supports reading agent rules and tool bounds via JSON files. You can export any Career Agent into a Codex-ready configuration file:
```bash
career-agents run google-interview-coach --export json
```
Then load it into your Codex runtime configuration file:
```json
{
  "agent_config": "./build/exports/google-interview-coach.json",
  "tools": ["terminal", "fs_reader"]
}
```

## Best Practices

- **Strict Validation**: Always run `career-agents doctor` prior to loading config files to ensure JSON syntax matches Codex expectations.
- **Tool Mapping**: Map appropriate terminal tool schemas so the Codex agent can call CLI helper commands directly.
- **State Logs**: Review Codex state runtime logs to verify if system instructions are parsed properly.
