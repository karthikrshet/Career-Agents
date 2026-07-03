# Aider Integration

Detailed developer integration patterns for the **Aider** chat CLI.

## Installation
Install Aider using python pip:
```bash
pip install aider-chat
```
Set your model API keys (e.g. `ANTHROPIC_API_KEY`) in your terminal profile.

## Usage
Initiate Aider inside a git repository:
```bash
aider
```

## Agent Loading
To load agent instructions dynamically, write them to `.aider.instructions.md`:
```bash
career-agents use code-reviewer aider
```
Aider will load these rules automatically on startup.

## Prompt Injection
Alternatively, ask Aider to read agent files directly during a chat session:
```text
/read career/ats-resume-reviewer.md
```
This adds the prompt file to Aider's read-only context.

## Best Practices
- **Read-Only Context**: Always load prompt files using `/read` rather than letting Aider add them as editable files, to prevent accidental code changes.
- **Git Commits**: Run git status/commit prior to launching Aider so changes can be easily reverted.
