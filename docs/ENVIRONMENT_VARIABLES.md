# Career Agents — Environment Variables

This document provides a detailed reference for all environment variables used by Career Agents, explaining their purpose, default values, requirements, and usage guidelines.

---

## Variable Reference

### NextAuth Settings (Required in Database Mode)

These variables configure user session signatures, security cookies, and redirect targets.

#### `NEXTAUTH_SECRET`
- **Required:** Yes (for OAuth sign-in and session JWT verification)
- **Description:** A cryptographically secure random string used to hash and encrypt NextAuth session cookies.
- **Generation:** Run `openssl rand -base64 32` or `[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`
- **Example:** `JzI1M2E4MTlhNDdl...`

#### `NEXTAUTH_URL`
- **Required:** Yes
- **Description:** The canonical base URL of your application in production or development. Do not append a trailing slash.
- **Example:** `http://localhost:3000` (development) or `https://career-agents.dev` (production)

---

### Database Connection

#### `DATABASE_URL`
- **Required:** Optional (fallback to `localStorage` guest mode if empty)
- **Description:** Connection string for Prisma ORM to connect to the PostgreSQL database.
- **Format:** `postgresql://<user>:<password>@<host>:<port>/<db_name>?schema=public`
- **Example:** `postgresql://johndoe:mypassword@localhost:5432/career_os?schema=public`

---

### OAuth Providers (Optional)

Configure these variables to enable third-party social logins.

#### `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- **Required:** No (required to enable GitHub Sign-In button)
- **Description:** Client credentials generated when creating a Developer OAuth Application in GitHub profile settings.
- **Callback URL format:** `<NEXTAUTH_URL>/api/auth/callback/github`

#### `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- **Required:** No (required to enable Google Sign-In button)
- **Description:** Client credentials from the Google Cloud Console credential manager.
- **Callback URL format:** `<NEXTAUTH_URL>/api/auth/callback/google`

---

### AI Providers (Server-Side Fallbacks)

Users can configure their own keys in the app's settings. If they do not, these server-side environment keys will serve as fallback backends.

| Env Variable | Target Provider | Description |
|--------------|-----------------|-------------|
| `GROQ_API_KEY` | Groq AI | Key for ultra-fast Llama-based responses (recommended) |
| `OPENAI_API_KEY` | OpenAI | Key for GPT-4o, GPT-4o-mini |
| `ANTHROPIC_API_KEY` | Anthropic | Key for Claude-3.5-sonnet, Claude-3-opus |
| `GEMINI_API_KEY` | Google Gemini | Key for Google AI Studio Gemini API |
| `OPENROUTER_API_KEY` | OpenRouter | Key for Unified OpenRouter models |
| `DEEPSEEK_API_KEY` | DeepSeek | Key for DeepSeek-chat & DeepSeek-coder |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI | Client key for Azure deployed models |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI | Endpoint URL for Azure deployment |
| `AZURE_OPENAI_DEPLOYMENT`| Azure OpenAI | Target deployment name (e.g. `gpt-4o`) |
| `MISTRAL_API_KEY` | Mistral AI | Key for Mistral Large, Codestral models |
| `COHERE_API_KEY` | Cohere AI | Key for Command R+ models |
| `TOGETHER_API_KEY` | Together AI | Key for Together.xyz serverless models |
| `XAI_API_KEY` | xAI Grok | Key for xAI Grok API |

---

### Platform Feature Flags

These public flags control client-side rendering options. They must be prefixed with `NEXT_PUBLIC_` to be accessible inside React components.

#### `NEXT_PUBLIC_ENABLE_MCP`
- **Default:** `true`
- **Type:** `boolean`
- **Description:** Enables the Model Context Protocol UI tab and helper instructions.

#### `NEXT_PUBLIC_ENABLE_MARKETPLACE`
- **Default:** `true`
- **Type:** `boolean`
- **Description:** Show/hide the Plugin Marketplace in the sidebar menu.

#### `NEXT_PUBLIC_ENABLE_REPORTS`
- **Default:** `true`
- **Type:** `boolean`
- **Description:** Activates career analysis HTML, markdown, and document generation functionality.

#### `NEXT_PUBLIC_ENABLE_TELEMETRY`
- **Default:** `false`
- **Type:** `boolean`
- **Description:** Opt-in to anonymous client performance and error telemetry metrics.

---

### Configuration Variables

#### `NEXT_PUBLIC_APP_NAME`
- **Default:** `Career Agents`
- **Description:** Customize the default branding application name displayed in headers and dashboard components.

#### `NEXT_PUBLIC_APP_VERSION`
- **Default:** `2.5.0`
- **Description:** The version string displayed under Settings -> System.

#### `GITHUB_TOKEN`
- **Required:** Optional (reverts to unauthenticated 60 requests/hr rate limits if empty)
- **Description:** A GitHub personal access token (PAT) used by `/api/github/analyze` to scale public profile data limits up to 5,000 requests/hr.
- **Scopes required:** None (public access is sufficient).

#### `REDIS_URL`
- **Required:** Optional
- **Description:** Connection URL for Redis to enable rate limiting and analytics caching for API routes.
- **Example:** `redis://localhost:6379`

#### `LOG_LEVEL`
- **Default:** `info`
- **Values:** `debug` | `info` | `warn` | `error`
- **Description:** Configures logging verbosity in standard server console logs.
