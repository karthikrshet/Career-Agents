# Cursor Integration

Detailed developer integration patterns for the **Cursor** IDE.

## Installation
Download Cursor from [cursor.com](https://www.cursor.com/).

## Usage
Open your local repository in Cursor. Use the AI Chat sidebar (Ctrl+L / Cmd+L) or inline compiler (Ctrl+K / Cmd+K) to generate and edit files.

## Agent Loading
Load any agent prompt as your workspace-level instructions:
```bash
career-agents use ats-resume-reviewer cursor
```
This writes the full instructions to `.cursorrules` in your project root.

## Prompt Injection
To inject multiple agents, create a `.cursorrules` file and append custom instructions sections. Mention `@.cursorrules` in the Cursor Chat to ensure the ruleset is loaded.

## Best Practices
- **Switching Contexts**: Remember to clear or rename `.cursorrules` when transitioning from career coaching to normal repository code writing.
- **Reference Files**: Use the `@` symbol in chat to reference specific folders or files (e.g. `@resume.md`) for more contextual responses.
