# Claude Code Integration

Detailed developer integration patterns for **Claude Code CLI**.

## Installation
Run the npm install command globally:
```bash
npm install -g @anthropic-ai/claude-code
```
Authenticate with Anthropic:
```bash
claude keys set
```

## Usage
Initiate Claude Code in your project root:
```bash
claude
```

## Agent Loading
To load an agent into a Claude Code session, ask Claude directly to read the agent markdown file:
```text
Please read career/ats-resume-reviewer.md and act as the ATS Resume Reviewer agent.
```

## Prompt Injection
Use the CLI tool to inject the agent guidelines as a project instructions config file:
```bash
career-agents use google-interview-coach claude
```
This writes the instructions to `.claudecode.instructions.md`.

## Best Practices
- **Rules Reference**: Periodically remind Claude of the Critical Rules section during conversation.
- **Save Context Tokens**: Reference only the specific agent file relevant to your active task.
