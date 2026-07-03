# Aider Integration Guide

This guide documents how to integrate and use **Career-Agents** with **Aider**.

## Installation Guide

Install Aider via pip:
```bash
pip install aider-chat
```
Configure your API keys (e.g. `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`) in your environment.

## Usage Guide

Aider is a command-line chat tool that lets you edit files in your git repository. Run aider:
```bash
aider
```

## Agent Loading Guide

Aider supports project instructions via a custom system instructions file or markdown rule sheet:
```bash
career-agents use code-reviewer aider
```
This copies the agent instructions to `.aider.instructions.md`. Aider automatically reads this file on startup to configure its editing behavior.

Alternatively, you can load it in the chat prompt:
```text
/read career/ats-resume-reviewer.md
```

## Best Practices

- **Read-Only Context**: Use Aider's `/read` command to keep agent files in read-only mode so Aider doesn't attempt to modify your core prompt assets.
- **Commit Formatting**: Ensure you run git commits before letting Aider edit files based on the agent's instructions, so you can revert any unintended changes.
- **Lint Check**: Enable auto-linting in Aider config to verify code changes when using engineering or database coach agents.
