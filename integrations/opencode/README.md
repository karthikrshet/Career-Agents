# OpenCode Integration

Detailed developer integration patterns for the **OpenCode CLI**.

## Installation
Clone the OpenCode repository and install the CLI globally:
```bash
git clone https://github.com/opencode-dev/opencode-cli
cd opencode-cli && npm install -g .
```

## Usage
Initiate OpenCode server in your project folder:
```bash
opencode start
```

## Agent Loading
Export the agent instructions in text format:
```bash
career-agents run ats-resume-reviewer --export txt
```
Move the txt file to `.opencode/instructions/`:
```bash
cp exports/ats-resume-reviewer.txt .opencode/instructions/
```

## Prompt Injection
OpenCode will read all files inside `.opencode/instructions/` and append them as context-level system rules.

## Best Practices
- **File Naming**: Keep filenames clean (e.g. `ats-resume-reviewer.txt`) so OpenCode logs them clearly in its console.
- **Rule Isolation**: Do not load multiple contradictory agents under `.opencode/instructions/` simultaneously.
