# Cursor Integration Guide

This guide documents how to integrate and use **Career-Agents** with the **Cursor** IDE.

## Installation Guide

Cursor is an AI-first editor. Download it from [cursor.com](https://www.cursor.com/).

## Usage Guide

Cursor uses workspace-level instructions to align its chat agent and inline code generators (Cmd+K / Ctrl+K).

## Agent Loading Guide

### Option 1: Workspace Cursor Rules (.cursorrules)
Inject the agent directly into your workspace:
```bash
career-agents use ats-resume-reviewer cursor
```
This writes the full instructions to `.cursorrules` in your project root, which Cursor automatically loads for all chat, editing, and indexing tasks.

### Option 2: Custom Rules
You can also copy specific agent instructions and paste them in **Cursor Settings -> Features -> Rules for AI**.

## Best Practices

- **Context Reference**: In the Cursor chat panel (Cmd+L / Ctrl+L), type `@.cursorrules` to explicitly ask Cursor to use the loaded agent rules.
- **Agent Triggers**: Specify target files when asking Cursor to act, e.g., `@resume.md rewrite achievement bullets`.
- **Ignore Rules when Coding**: Remember to delete or rename `.cursorrules` if you are writing unrelated project code so the AI doesn't keep acting like a career coach.
