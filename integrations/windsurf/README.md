# Windsurf Integration

Detailed developer integration patterns for the **Windsurf** IDE.

## Installation
Download the Windsurf editor from [codeium.com/windsurf](https://codeium.com/windsurf).

## Usage
Open your project in Windsurf. Cascade will read rulesets from the workspace root directory.

## Agent Loading
To load an agent, run:
```bash
career-agents use ats-resume-reviewer windsurf
```
This writes the rules directly to `.windsurfrules` in your workspace root.

## Prompt Injection
Cascade automatically reads `.windsurfrules` on every chat initialization. Trigger them by asking:
```text
Execute resume audit using the instructions in .windsurfrules.
```

## Best Practices
- **Cascade Mode**: Use Cascade's "Collaborative" or "Agent" mode depending on whether you want visual checks or raw edits.
- **Rule Cleanup**: Delete `.windsurfrules` when swapping back to standard non-career code development.
