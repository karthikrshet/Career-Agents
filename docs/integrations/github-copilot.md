# GitHub Copilot Integration Guide

This guide documents how to integrate and use **Career-Agents** with **GitHub Copilot**.

## Installation Guide

Ensure you have the GitHub Copilot extension installed in VS Code, IntelliJ, or Visual Studio, and are signed into an active subscription.

## Usage Guide

Copilot reads workspace markdown files to align context. You can reference specific instruction files in Copilot Chat using the `#file` variable.

## Agent Loading Guide

Inject the agent instructions into Copilot's workspace instruction file:
```bash
career-agents use ats-resume-reviewer copilot
```
This creates `.github/copilot-instructions.md`. Copilot automatically uses this file to configure its background knowledge and system rules during developer tasks.

## Best Practices

- **Chat Reference**: In VS Code Copilot Chat, reference the agent directly: `Rewrite my resume achievements using rules from #file:copilot-instructions.md`.
- **System Boundaries**: Remind Copilot not to alter code structure unless requested, especially when using project-specific advisor agents.
- **Auto-Sync**: Keep the `.github/copilot-instructions.md` updated using the CLI `use` command when changing target agents.
