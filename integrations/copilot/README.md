# GitHub Copilot Integration

Detailed developer integration patterns for **GitHub Copilot**.

## Installation
Install the GitHub Copilot extension in VS Code, JetBrains, or Visual Studio.

## Usage
Interact with Copilot via inline suggestions or Copilot Chat (Ctrl+I / Cmd+I).

## Agent Loading
To load an agent, use the CLI `use` command:
```bash
career-agents use ats-resume-reviewer copilot
```
This creates `.github/copilot-instructions.md` containing the agent instructions.

## Prompt Injection
Reference the file in Copilot Chat:
```text
Optimize my resume using the rules in #file:copilot-instructions.md.
```

## Best Practices
- **Auto-Sync**: Re-run the CLI command when updating to a different agent.
- **Reference Context**: Provide exact file scopes when asking Copilot to generate resume achievements or system design patterns.
