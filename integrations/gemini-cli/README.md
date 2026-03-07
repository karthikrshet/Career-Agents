# Gemini CLI Integration

Detailed developer integration patterns for the **Gemini CLI**.

## Installation
Run the npm install command globally:
```bash
npm install -g @google/gemini-cli
```
Add your key to the environment variables:
```bash
export GEMINI_API_KEY="your-api-key"
```

## Usage
Query the CLI from your terminal:
```bash
gemini "How do I optimize SQL queries for Databricks?"
```

## Agent Loading
Pass the agent prompt file contents using shell expansion:
```bash
gemini --system "$(cat engineering/database-engineer.md)" "Review schema.sql"
```

## Prompt Injection
Redirect agent prompt exports directly to the CLI command inputs:
```bash
career-agents run database-engineer --export txt
gemini --system "$(cat exports/database-engineer.txt)" "Analyze query plans"
```

## Best Practices
- **Output Redirection**: Pipe Gemini CLI reports to files for offline review: `gemini ... > audit-report.md`.
- **Model Parameters**: Adjust model temperature parameters depending on coding checks vs system design scenarios.
