# Claude Code Integration Guide

This guide documents how to integrate and use **Career-Agents** within **Claude Code CLI**.

## Installation Guide

To install Claude Code, run the global npm package:
```bash
npm install -g @anthropic-ai/claude-code
```
Ensure you have authenticated with your Anthropic key:
```bash
claude keys set
```

## Usage Guide

Run Claude Code in your local workspace containing Career-Agents:
```bash
claude
```
You can converse directly with Claude and ask it to run workflows or refer to specific agent files.

## Agent Loading Guide

To load an agent into Claude Code, you can:
1. Inject the prompt into your project instructions file:
   ```bash
   career-agents use google-interview-coach claude
   ```
   This creates a `.claudecode.instructions.md` containing the agent instructions.
2. Manually reference an agent in the prompt:
   ```text
   Read the specifications in career/ats-resume-reviewer.md and audit my resume.
   ```

## Best Practices

- **Context Optimization**: Keep your agent files focused. Claude Code has a large context window, but referencing only the relevant agent markdown file (e.g. `resume-strategist.md`) reduces token costs.
- **Task Delegation**: Use Claude Code's terminal command capabilities to run validation scripts or search commands, e.g., `career-agents search meta`.
- **System Rules**: Always remind Claude to adhere to the `## 🚨 Critical Rules You Must Follow` section of the loaded agent.
