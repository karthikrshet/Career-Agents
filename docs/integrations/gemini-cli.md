# Gemini CLI Integration Guide

This guide documents how to integrate and use **Career-Agents** within **Gemini CLI**.

## Installation Guide

Install the Gemini CLI utility:
```bash
npm install -g @google/gemini-cli
```
Provide your Google Gemini API key by setting the environment variable:
```bash
export GEMINI_API_KEY="your-api-key"
```

## Usage Guide

Use the `gemini` command to run queries directly from your shell:
```bash
gemini "How should I prepare for a Google backend interview?"
```

## Agent Loading Guide

To run a specific career agent inside Gemini CLI, use the CLI's file reference feature or pass it via system prompts:
```bash
gemini --system "$(cat career/ats-resume-reviewer.md)" "Review my resume at resume.pdf"
```
Or use our exporter system to package the agent:
```bash
career-agents run ats-resume-reviewer --export txt
gemini --system "$(cat build/exports/ats-resume-reviewer.txt)" "Run resume audit"
```

## Best Practices

- **Formatting Check**: When feeding markdown files to Gemini, ensure text structures match standard formatting to avoid parser issues.
- **API Models**: Use Gemini 1.5 Pro or Gemini 2.0 Flash options depending on speed vs reasoning requirements (e.g. use Pro for System Design, Flash for quick coding check).
- **Session Preservation**: Use local shell pipelines to redirect outputs to build reports, e.g. `gemini ... > audit-report.md`.
