# Windsurf Integration Guide

This guide documents how to integrate and use **Career-Agents** with the **Windsurf** IDE.

## Installation Guide

Windsurf is a collaborative AI agent IDE. Download the editor from [codeium.com/windsurf](https://codeium.com/windsurf).

## Usage Guide

Windsurf uses rules defined at the workspace root to guide its Cascade assistant.

## Agent Loading Guide

Inject the agent instructions directly into Windsurf's rules file:
```bash
career-agents use ats-resume-reviewer windsurf
```
This creates a `.windsurfrules` file in the root of your workspace containing the complete instructions. Cascade reads this configuration file to apply rules to its chat conversations and automated code generation.

## Best Practices

- **Rule Signaling**: Start your chat sessions by pointing Cascade to the active ruleset: `Audit my resume based on the rules in .windsurfrules`.
- **Ignore files**: Add `.windsurfrules` to your `.gitignore` file if you do not want to commit local agent overrides to your codebase.
- **Toggle Active Rules**: Rename or remove `.windsurfrules` when switching from career audits to standard coding work.
