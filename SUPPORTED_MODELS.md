# Supported AI Models — Career OS v2.5.0

Career OS supports 13 AI providers via a unified router. Configure your preferred provider in Settings.

---

## Provider Support Matrix

| Provider | Status | Default Model | Free Tier |
|----------|--------|--------------|-----------|
| Anthropic Claude | ✅ Active | claude-opus-4 | ❌ |
| OpenAI | ✅ Active | gpt-4o | ❌ |
| Google Gemini | ✅ Active | gemini-2.5-pro | ✅ (limited) |
| Groq | ✅ Active | llama-3.3-70b-versatile | ✅ (limited) |
| OpenRouter | ✅ Active | openai/gpt-4o | Varies |
| Ollama | ✅ Active (local) | llama3 | ✅ (self-hosted) |
| LM Studio | ✅ Active (local) | local-model | ✅ (self-hosted) |
| DeepSeek | ✅ Active | deepseek-chat | ✅ (limited) |
| Mistral | ✅ Active | mistral-large-latest | ❌ |
| Cohere | ✅ Active | command-r-plus | ✅ (limited) |
| Together AI | ✅ Active | meta-llama/Llama-3-70b | ✅ (limited) |
| xAI Grok | ✅ Active | grok-beta | ❌ |
| Azure OpenAI | ✅ Active | gpt-4 | ❌ |

---

## Claude Models

| Model | Context | Best For |
|-------|---------|---------|
| claude-opus-4 | 200K | Deep analysis, complex career coaching |
| claude-sonnet-4-5 | 200K | Balanced performance and cost |
| claude-3-5-haiku-20241022 | 200K | Fast responses, quick tips |

## OpenAI Models

| Model | Context | Best For |
|-------|---------|---------|
| gpt-4o | 128K | Multimodal, resume images |
| gpt-4-turbo | 128K | Complex reasoning |
| gpt-4 | 8K | Standard tasks |
| gpt-3.5-turbo | 16K | Fast, cost-effective |

## Google Gemini Models

| Model | Context | Best For |
|-------|---------|---------|
| gemini-2.5-pro | 1M | Long document analysis |
| gemini-2.0-flash | 1M | Fast streaming responses |
| gemini-1.5-flash | 1M | Cost-effective tasks |

## Groq Models (Ultra-fast inference)

| Model | Context | Best For |
|-------|---------|---------|
| llama-3.3-70b-versatile | 128K | General purpose |
| llama-3.1-8b-instant | 128K | Very fast, simple tasks |
| mixtral-8x7b-32768 | 32K | Multi-domain reasoning |
| gemma2-9b-it | 8K | Compact, efficient |

---

## Local Models (No API Key Required)

### Ollama
Run any open model locally: `ollama run llama3`
Endpoint: `http://localhost:11434`

### LM Studio
Run any GGUF model. 
Endpoint: `http://localhost:1234/v1`

---

## Setting Your Provider

1. Navigate to **Settings** → **AI Provider**
2. Select your provider from the dropdown
3. Enter your API key (stored encrypted, never sent to frontend)
4. Select your preferred model
5. Adjust temperature (default: 0.7)
6. Toggle streaming (default: ON)

Provider priority:
1. Environment variable (`OPENAI_API_KEY`, `GEMINI_API_KEY`, etc.)
2. Database-encrypted key (entered in Settings)
3. Fallback error with clear setup instructions
