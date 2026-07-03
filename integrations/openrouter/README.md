# OpenRouter Integration

Detailed developer integration patterns for the **OpenRouter** API.

## Installation
Retrieve an API key from [openrouter.ai](https://openrouter.ai/).

## Usage
Query OpenRouter endpoints in your code client.
Endpoint: `https://openrouter.ai/api/v1`

## Agent Loading
Export the agent instructions in JSON format:
```bash
career-agents run ats-resume-reviewer --export json
```

## Prompt Injection
Load the JSON content and inject it as the system message in the chat messages payload array:
```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "system",
      "content": "..."
    }
  ]
}
```

## Best Practices
- **Fallbacks**: Set up client fallbacks to secondary open weights models (like Llama-3-70b-instruct) if primary providers timing out.
- **Provider Preferences**: Configure provider routing headers on OpenRouter queries to ensure lowest latency or cost parameters.
