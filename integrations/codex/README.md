# Codex Integration

Detailed developer integration patterns for the **Codex Agent Runtime**.

## Installation
Install Codex tools via python pip:
```bash
pip install codex-agent-runtime
```

## Usage
Initialize Codex configurations in your workspace:
```bash
codex init
```

## Agent Loading
Codex reads JSON configurations for model parameters and instructions. Export the agent as JSON:
```bash
career-agents run google-interview-coach --export json
```
Load the exported JSON file inside your Codex agent setup path.

## Prompt Injection
Reference the JSON files in your Codex project settings to override model instructions:
```json
{
  "system_instructions_file": "./exports/google-interview-coach.json"
}
```

## Best Practices
- **Linter Checks**: Run `career-agents doctor` prior to loading config files to ensure registry parsing matches Codex parameters.
- **Context Boundaries**: Limit file system access tools for Codex in candidate folders to prevent data corruption.
