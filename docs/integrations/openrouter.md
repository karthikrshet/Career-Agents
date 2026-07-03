# OpenRouter Integration Guide

This guide documents how to integrate and use **Career-Agents** with **OpenRouter**.

## Installation Guide

Ensure you have a client setup that supports custom headers and system instructions (e.g. LibreChat, Chatbox, or an SDK). Get an API key from [openrouter.ai](https://openrouter.ai/).

## Usage Guide

OpenRouter serves as a API hub for multiple LLMs. Configure your API endpoint:
- URL: `https://openrouter.ai/api/v1`
- Header: `Authorization: Bearer YOUR_OPENROUTER_API_KEY`

## Agent Loading Guide

Export the agent using JSON or Prompt Bundle formats:
```bash
career-agents run ats-resume-reviewer --export json
```
Feed the content from the exported file as the `system` message parameter in your API payload:
```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "system",
      "content": "...[content of build/exports/ats-resume-reviewer.json]..."
    }
  ]
}
```

## Best Practices

- **Model Selection**: Pair the correct agent with the optimal model (e.g. use Claude 3.5 Sonnet or GPT-4o for complex resume audits).
- **Context Management**: Be aware of billing limits when using very large prompt packages over OpenRouter APIs.
- **Failover Routing**: Set fallbacks in your client configurations to automatically route to secondary models (like Llama-3-70b) if your primary provider fails.
