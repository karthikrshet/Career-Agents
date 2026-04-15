# Career Agents — AI Providers

Career Agents supports 14 AI providers. Configure your preferred one in **Settings → AI Provider** or via environment variables.

---

## Quick Comparison

| Provider | Cost | Speed | Best Models | Context Window | Free Tier |
|---|---|---|---|---|---|
| **Groq** | Free tier | 🟢 Fastest | `llama-3.3-70b-versatile`, `llama3-70b-8192` | 8K–32K | ✅ Yes |
| **OpenAI** | Pay-per-use | 🟡 Fast | `gpt-4o`, `gpt-4o-mini` | 128K | ❌ No |
| **Anthropic** | Pay-per-use | 🟡 Fast | `claude-3-5-sonnet-20241022` | 200K | ❌ No |
| **Google Gemini** | Free tier | 🟢 Fast | `gemini-1.5-flash`, `gemini-2.0-flash` | 1M | ✅ Yes |
| **OpenRouter** | Pay-per-use | 🟡 Varies | 400+ models | Varies | ✅ Free tier |
| **DeepSeek** | Very cheap | 🟡 Fast | `deepseek-chat`, `deepseek-reasoner` | 64K | ✅ Cheap |
| **Together AI** | Cheap | 🟡 Fast | `Llama-3-70b-chat-hf` | 32K | ✅ Free tier |
| **Mistral** | Pay-per-use | 🟡 Fast | `mistral-large-latest`, `codestral-latest` | 32K | ❌ No |
| **Cohere** | Pay-per-use | 🟡 Fast | `command-r-plus`, `command-r` | 128K | ✅ Trial |
| **xAI (Grok)** | Pay-per-use | 🟡 Fast | `grok-2`, `grok-beta` | 131K | ❌ No |
| **Azure OpenAI** | Enterprise | 🟡 Fast | GPT-4o, GPT-3.5 Turbo | 128K | ❌ Enterprise |
| **Ollama** | Free (local) | 🔴 Slow | `llama3.3`, `mistral`, `codellama` | Varies | ✅ Free |
| **LM Studio** | Free (local) | 🔴 Slow | Any GGUF model | Varies | ✅ Free |

---

## Key Priority System

When making AI requests, the key is resolved in this order:

1. **User key** (stored in browser localStorage, configured in Settings)
2. **Server env var** (`GROQ_API_KEY`, `OPENAI_API_KEY`, etc. in `.env`)
3. **No key required** (Ollama, LM Studio only)

**Security:** User API keys are stored in localStorage only. They are never sent to any Career Agents server and never persisted in a database.

---

## Recommended: Groq (Free & Fast)

Groq provides free-tier access to Meta's Llama models with the fastest inference speeds available.

**Setup:**
1. Sign up at [console.groq.com](https://console.groq.com)
2. Go to API Keys → Create API Key
3. In Career Agents: Settings → AI Provider → Groq → paste key

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `llama-3.3-70b-versatile` *(recommended)*
- `llama3-70b-8192`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

---

## OpenAI

**Setup:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create → API Key
3. In Career Agents: Settings → AI Provider → OpenAI → paste key

**Endpoint:** `https://api.openai.com/v1/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `gpt-4o` *(best quality)*
- `gpt-4o-mini` *(fast and cheap)*
- `gpt-4-turbo`
- `o1-preview`
- `o1-mini`

---

## Anthropic (Claude)

**Setup:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Get API key
3. In Career Agents: Settings → AI Provider → Anthropic → paste key

**Endpoint:** `https://api.anthropic.com/v1/messages`  
**Auth:** `x-api-key` header + `anthropic-version: 2023-06-01`  
**Available Models:**
- `claude-3-5-sonnet-20241022` *(best)*
- `claude-3-haiku-20240307` *(fastest)*
- `claude-3-opus-20240229` *(most capable)*

**Note:** Claude uses a different auth header scheme than OpenAI-compatible providers. Career Agents handles this automatically.

---

## Google Gemini

**Setup:**
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create API key (free)
3. In Career Agents: Settings → AI Provider → Gemini → paste key

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`  
**Auth:** Bearer token (uses OpenAI-compatible endpoint)  
**Available Models:**
- `gemini-1.5-flash` *(free, fast)*
- `gemini-1.5-pro`
- `gemini-2.0-flash`
- `gemini-2.5-pro`

---

## OpenRouter (200+ Models)

OpenRouter provides access to 400+ models from different providers through a single API key.

**Setup:**
1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create key (free credits on signup)
3. In Career Agents: Settings → AI Provider → OpenRouter → paste key

**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`  
**Auth:** Bearer token  
**Recommended Models:**
- `meta-llama/llama-3.1-405b` *(powerful, some free tier)*
- `google/gemini-2.0-flash-exp` *(fast)*
- `anthropic/claude-3.5-sonnet` *(best quality)*

---

## DeepSeek

Extremely cost-effective models with strong coding abilities.

**Setup:**
1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Top up credits (very cheap)
3. In Career Agents: Settings → AI Provider → DeepSeek → paste key

**Endpoint:** `https://api.deepseek.com/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `deepseek-chat` *(general purpose)*
- `deepseek-reasoner` *(step-by-step reasoning)*

---

## Together AI

**Setup:**
1. Go to [api.together.xyz](https://api.together.xyz)
2. Create API key
3. In Career Agents: Settings → AI Provider → Together → paste key

**Endpoint:** `https://api.together.xyz/v1/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `meta-llama/Llama-3-70b-chat-hf`
- `mistralai/Mixtral-8x7B-Instruct-v0.1`

---

## Mistral

**Setup:**
1. Go to [console.mistral.ai](https://console.mistral.ai)
2. Create API key
3. In Career Agents: Settings → AI Provider → Mistral → paste key

**Endpoint:** `https://api.mistral.ai/v1/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `mistral-large-latest`
- `codestral-latest` *(best for code)*

---

## Cohere

**Setup:**
1. Go to [dashboard.cohere.com](https://dashboard.cohere.com)
2. Create API key
3. In Career Agents: Settings → AI Provider → Cohere → paste key

**Endpoint:** `https://api.cohere.ai/v1/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `command-r-plus` *(best quality)*
- `command-r`

---

## xAI (Grok)

**Setup:**
1. Go to [console.x.ai](https://console.x.ai)
2. Create API key (requires X Premium subscription)
3. In Career Agents: Settings → AI Provider → xAI → paste key

**Endpoint:** `https://api.x.ai/v1/chat/completions`  
**Auth:** Bearer token  
**Available Models:**
- `grok-2`
- `grok-beta`

---

## Azure OpenAI

For enterprise deployments with Azure subscriptions.

**Setup:**
1. Create an Azure OpenAI resource in Azure Portal
2. Deploy a model (e.g., `gpt-4o`)
3. Set the following env vars:
   ```env
   AZURE_OPENAI_API_KEY="your-azure-key"
   AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
   AZURE_OPENAI_DEPLOYMENT="your-deployment-name"
   ```
4. In Career Agents: Settings → AI Provider → Azure → enter your endpoint

**Auth:** `api-key` header (handled automatically)

---

## Ollama (Local, Free)

Run models locally on your machine. No API key or internet required.

**Setup:**
1. Install Ollama: [ollama.com](https://ollama.com)
2. Pull a model:
   ```bash
   ollama pull llama3.3
   # or
   ollama pull mistral
   # or
   ollama pull codellama
   ```
3. Start Ollama (it runs as a service on port 11434 by default)
4. In Career Agents: Settings → AI Provider → Ollama (no key needed)

**Endpoint:** `http://localhost:11434/v1/chat/completions`  
**Available Models (after pulling):**
- `llama3.3`
- `mistral`
- `codellama`
- `deepseek-coder`

**Note:** Performance depends on your hardware. A modern GPU is recommended for 70B models.

---

## LM Studio (Local, Free)

A GUI application for running local models with GGUF quantization.

**Setup:**
1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai)
2. Search and download a model (e.g., Llama 3.3 8B)
3. Start the local server from LM Studio → Local Server tab
4. In Career Agents: Settings → AI Provider → LM Studio (no key needed)

**Endpoint:** `http://localhost:1234/v1/chat/completions`  
**Available Models:** Any GGUF model you load in LM Studio

---

## Feature Support by Provider

| Feature | Groq | OpenAI | Claude | Gemini | OpenRouter | Local |
|---|---|---|---|---|---|---|
| Copilot Chat | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Resume AI Rewrite | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Interview Generation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Interview Evaluation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LinkedIn Optimizer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Report Generation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Function Calling | ❌ | ✅ | ✅ | ✅ | Varies | Varies |

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Wrong or expired API key | Re-enter your API key in Settings |
| `429 Too Many Requests` | Rate limit exceeded | Wait, or switch provider |
| `503 Service Unavailable` | Provider is down | Switch to another provider |
| `Features show placeholder data` | No API key configured | Go to Settings → AI Provider |
| Streaming stopped mid-response | Network timeout or provider issue | Retry or enable non-streaming mode |
