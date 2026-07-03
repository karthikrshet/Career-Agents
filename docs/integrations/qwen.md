# Qwen Integration Guide

This guide documents how to integrate and use **Career-Agents** with the **Qwen** model CLI.

## Installation Guide

Install the Qwen chat client command-line interface or utilize its python helper runtime:
```bash
pip install qwen-agent
```

## Usage Guide

Run Qwen queries by specifying system prompt paths.

## Agent Loading Guide

Export the agent in Prompt Bundle or TXT format:
```bash
career-agents run google-interview-coach --export bundle
```
Run Qwen Agent with the system prompt:
```bash
qwen-agent-chat --system "$(cat build/exports/google-interview-coach.prompt-bundle.txt)"
```

## Best Practices

- **Language Parsing**: Qwen models parse instructions in multiple languages. Keep instructions plain and clear.
- **Model Versions**: Use Qwen-2.5-Coder or Qwen-2.5-72B-Instruct depending on task complexity.
- **Index Reference**: Use Qwen's local RAG capability to index the `search-index.json` to allow the model to fetch agents dynamically.
