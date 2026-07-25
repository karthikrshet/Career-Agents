# AI Provider Setup Guide

> Career OS supports 9 AI providers. Configure your preferred one in **Settings → AI Provider** or via environment variables.

---

## Quick Start (Recommended: Groq — Free & Fast)

1. Go to [console.groq.com](https://console.groq.com) and sign up
2. Create an API key
3. In Career OS, open **Settings → AI Provider**
4. Select **Groq**, paste your key, choose `llama3-70b-8192`
5. Click Save — all AI features are now active

---

## Provider Comparison

| Provider | Cost | Speed | Best Models | Context |
|----------|------|-------|-------------|---------|
| **Groq** | Free tier | 🟢 Fastest | `llama3-70b-8192`, `mixtral-8x7b` | 8K-32K |
| **OpenAI** | Pay-per-use | 🟡 Fast | `gpt-4o`, `gpt-4o-mini` | 128K |
| **Anthropic** | Pay-per-use | 🟡 Fast | `claude-3-5-sonnet-20241022` | 200K |
| **Google Gemini** | Free tier | 🟢 Fast | `gemini-1.5-flash`, `gemini-2.0-flash` | 1M |
| **OpenRouter** | Pay-per-use | 🟡 Varies | 200+ models | Varies |
| **DeepSeek** | Cheap | 🟡 Fast | `deepseek-chat`, `deepseek-coder` | 64K |
| **Ollama** | Free (local) | 🔴 Slow | `llama3`, `mistral`, `codellama` | Varies |
| **LM Studio** | Free (local) | 🔴 Slow | Any GGUF model | Varies |
| **Azure OpenAI** | Enterprise | 🟡 Fast | GPT-4, GPT-3.5 | 128K |

---

## Provider-Specific Setup

### Groq (Recommended)
```
URL: https://console.groq.com
Endpoint: https://api.groq.com/openai/v1/chat/completions
Auth: Bearer token
Best models: llama3-70b-8192, mixtral-8x7b-32768
```

### OpenAI
```
URL: https://platform.openai.com/api-keys
Endpoint: https://api.openai.com/v1/chat/completions
Auth: Bearer token  
Best models: gpt-4o (smart), gpt-4o-mini (fast & cheap)
```

### Anthropic (Claude)
```
URL: https://console.anthropic.com
Endpoint: https://api.anthropic.com/v1/messages
Auth: x-api-key header + anthropic-version: 2023-06-01
Best model: claude-3-5-sonnet-20241022
```

### Google Gemini
```
URL: https://aistudio.google.com/app/apikey
Endpoint: https://generativelanguage.googleapis.com/v1beta/openai/chat/completions
Auth: Bearer token (uses OpenAI-compatible endpoint)
Best models: gemini-1.5-flash (free), gemini-1.5-pro
```

### OpenRouter (200+ Models)
```
URL: https://openrouter.ai/keys
Endpoint: https://openrouter.ai/api/v1/chat/completions
Auth: Bearer token
Recommended: meta-llama/llama-3-70b-instruct (free tier available)
```

### Ollama (Local, Free)
```
Install: curl -fsSL https://ollama.com/install.sh | sh
Run: ollama pull llama3
Endpoint: http://localhost:11434/v1/chat/completions
No API key required
```

### LM Studio (Local, Free)
```
Download: https://lmstudio.ai
Start local server in LM Studio app
Endpoint: http://localhost:1234/v1/chat/completions
No API key required
```

### DeepSeek
```
URL: https://platform.deepseek.com
Endpoint: https://api.deepseek.com/chat/completions
Auth: Bearer token
Best models: deepseek-chat (general), deepseek-coder (code)
```

### Azure OpenAI
```
Requires Azure subscription + OpenAI resource
Endpoint: https://<your-resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=2024-02-01
Auth: api-key header
Set custom baseUrl in Settings
```

---

## Features by Provider

| Feature | Groq | OpenAI | Claude | Gemini |
|---------|------|--------|--------|--------|
| Resume AI Rewrite | ✅ | ✅ | ✅ | ✅ |
| LinkedIn Optimizer | ✅ | ✅ | ✅ | ✅ |
| Interview Questions | ✅ | ✅ | ✅ | ✅ |
| Answer Evaluation | ✅ | ✅ | ✅ | ✅ |
| Career Copilot Chat | ✅ | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ✅ | ✅ |
| Tool Calls | ❌ | ✅ | ✅ | ✅ |
| Code Analysis | ✅ | ✅ | ✅ | ✅ |

---

## Security Notes

- API keys are stored in **localStorage** only (never sent to any Career OS server)
- When you add `.env` server-side keys, they're used as fallbacks for unauthenticated requests
- For production deployment, use server-side env vars and never expose them to the client
- Consider rotating keys if you share your browser profile

---

## Troubleshooting

**"AI provider error (401)"** → API key is missing or incorrect
**"AI provider error (429)"** → Rate limit exceeded, try a different provider or wait
**"AI provider error (503)"** → Provider is down, try switching to another
**Features show fake data** → No API key configured — go to Settings → AI Provider

---

*For more help, see the [Career Agents documentation](../../docs/) or open an issue on GitHub.*
