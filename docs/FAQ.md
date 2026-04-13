# Career OS — Frequently Asked Questions

---

## General

**Q: What is Career OS?**  
A: Career OS is an open-source, AI-powered career intelligence platform for software engineers. It combines 146 specialized AI agents, resume analysis, GitHub portfolio auditing, LinkedIn optimization, mock interviews, job tracking, and a career copilot into one integrated workspace.

**Q: Who is Career OS for?**  
A: Primarily software engineers at all levels — from students and bootcamp graduates to senior engineers targeting FAANG roles and tech leads navigating executive transitions. Many features are useful for any tech professional.

**Q: Is Career OS free?**  
A: Yes — completely open source under the MIT license. You can self-host it for free. The only costs are AI provider API usage (many providers have free tiers) and optional hosting.

**Q: Do I need to create an account?**  
A: No. Career OS has a full **guest mode** — all features work without signing in. Your data is stored in your browser's localStorage. Creating an account (via GitHub or Google OAuth) enables cross-device sync through the optional PostgreSQL database.

**Q: Can I use Career OS without any API key?**  
A: Yes. Resume ATS scoring, section detection, keyword analysis, and weak bullet detection all work without an AI key (they use local heuristics). The interview lab falls back to curated sample questions. AI features (Copilot chat, AI rewriting, personalized question generation, STAR scoring) require an API key.

**Q: Which AI provider do you recommend?**  
A: **Groq** for most users — it's free, extremely fast, and supports all major Career OS AI features. **Google Gemini** is also free and has a 1M token context window. See [PROVIDERS.md](./PROVIDERS.md) for a full comparison.

**Q: Is my data private?**  
A: Yes. Your resume text, GitHub data, and career information never leave your browser unless you explicitly configure a database. AI features use your own API key to call your chosen provider directly. Career OS servers never store your API keys.

---

## Installation & Setup

**Q: What are the minimum system requirements?**  
A: Node.js ≥ 18, npm ≥ 9, and Git. A modern browser. PostgreSQL is optional (for database persistence).

**Q: Can I run Career OS on Windows?**  
A: Yes. All features work on Windows. Use PowerShell or Git Bash for terminal commands.

**Q: Do I need Docker?**  
A: No. Docker is an optional deployment method. Local development uses plain Node.js.

**Q: Why does the app lose data when I close the browser?**  
A: Guest mode stores data in localStorage, which persists across browser sessions (it does not clear on close). If data is lost, it means localStorage was cleared (private/incognito mode, browser history clear, or browser settings). Use a regular browser window for persistent data, or set up a database.

**Q: Can I run Career OS offline?**  
A: Partially. The web UI loads without internet. Local AI features work with Ollama or LM Studio. GitHub Analyzer requires internet (GitHub API). AI features with cloud providers require internet.

---

## AI Providers

**Q: My Groq API key says invalid (401) even though I just created it.**  
A: Groq API keys take a few minutes to activate after creation. Wait 2-3 minutes and try again.

**Q: Can I use multiple AI providers at the same time?**  
A: You can configure one active provider at a time in Settings. Different features (Copilot vs Interview vs Resume) each use the same configured provider.

**Q: Does Claude (Anthropic) work differently from other providers?**  
A: Claude uses a different auth header (`x-api-key` instead of `Authorization: Bearer`) and a different API format. Career OS handles this automatically — you just need to select Anthropic in Settings and enter your key.

**Q: Can I use a local LLM with Ollama?**  
A: Yes. Install Ollama, pull a model (`ollama pull llama3.3`), and select Ollama in Settings. No API key required. Performance depends on your hardware — models larger than 7B parameters require a GPU for reasonable speed.

**Q: What happens if my provider quota runs out mid-session?**  
A: The Copilot will show an error message in the chat. The Interview lab falls back to sample questions. You can switch to a different provider in Settings without losing your session.

**Q: Are there any providers with no rate limits?**  
A: No cloud provider is truly unlimited. For local providers (Ollama, LM Studio), you are only limited by your hardware.

---

## Resume Studio

**Q: What file formats does Resume Studio support?**  
A: PDF, DOCX, TXT, Markdown (MD), and RTF. For best results, use TXT or DOCX — PDFs with embedded fonts or images may not parse cleanly.

**Q: How is the ATS score calculated?**  
A: The local ATS engine checks for: required resume sections (Experience, Education, Skills, Projects, Summary), presence of ~35 common tech keywords, absence of passive/weak verbs, and minimum word count. Scores range 0–100. It is a directional heuristic — not a replica of any specific employer's ATS.

**Q: Why are keywords like "TypeScript" and "React" listed as missing when they're clearly in my resume?**  
A: The keyword detection uses regex word-boundary matching. If the word is inside a code block, table, or formatted section that wasn't parsed cleanly from the PDF, it may be missed. Try pasting plain text directly.

**Q: Can Career OS rewrite my entire resume?**  
A: The AI rewrite feature rewrites individual weak bullets (passive verbs, missing metrics) using your configured AI provider. Full resume generation is not currently supported.

**Q: Is my resume sent to Career OS servers?**  
A: No. Resume parsing happens in your browser (`/api/parse-file` runs server-side but does not store the text). Analysis happens either client-side (`resume-engine.ts`) or via your own AI provider key. No resume data is persisted by Career OS.

---

## GitHub Analyzer

**Q: Why does the contribution heatmap look random?**  
A: The contribution heatmap uses simulated data. The GitHub REST API does not expose contribution history — it requires the GraphQL API with a scoped user token. The simulation is clearly marked and will be replaced with real data in a future release.

**Q: Why is my GitHub score lower than expected?**  
A: The portfolio score is computed from: total stars, repo count, profile completeness (bio, blog, location, email), and recent activity (repos updated in last 90 days). Low star counts or sparse profiles will score lower.

**Q: Does the GitHub Analyzer access private repositories?**  
A: No. It only reads public repositories using the GitHub REST API. If you provide a `GITHUB_TOKEN`, it still only accesses public data (unless the token has private repo scopes — not recommended).

---

## LinkedIn Optimizer

**Q: Does Career OS connect to LinkedIn's API?**  
A: No. Career OS analyzes text you paste from your LinkedIn profile — it does not use the LinkedIn API. Paste your headline, summary, and skills into the LinkedIn Optimizer to get analysis.

**Q: Why isn't there an "Import from LinkedIn" button?**  
A: LinkedIn's API is heavily restricted and doesn't allow automated profile reading without a partnership agreement. LinkedIn OAuth profile import is planned for v2.7.0.

---

## Interview Lab

**Q: Which companies are supported for company-specific interviews?**  
A: Adobe, Amazon, Atlassian, Google, Meta, Microsoft, Netflix, Oracle, Salesforce, and Uber. Generic "top tech company" mode is available for any other company.

**Q: What interview modes are available?**  
A: Behavioral, Technical (coding/algorithms), System Design, and HR rounds.

**Q: How does STAR scoring work?**  
A: Your answers are evaluated by the AI on 10 dimensions: Situation, Task, Action, Result, Ownership, Leadership, Communication, Technical Depth, Problem Solving, and Confidence — each scored 0–10. An overall score (0–100) is computed.

**Q: What happens if my answers are very short or empty?**  
A: The AI is explicitly instructed to score brief or insubstantial answers strictly — they will receive very low scores (overall < 15/100). This prevents inflated scores for empty submissions.

**Q: Are interview questions AI-generated or hardcoded?**  
A: Both. With an AI provider configured, questions are dynamically generated for the specific company, role, mode, and difficulty. Without a key, Career OS returns 5 high-quality curated fallback questions per mode.

---

## Career Copilot

**Q: What makes Career Copilot different from just using ChatGPT?**  
A: Career Copilot is context-aware. It reads your actual resume analysis, GitHub portfolio score, LinkedIn score, job application list, and career metrics, then injects all of this into every response. It also routes your query to the most relevant agents from the 146-agent registry.

**Q: How does agent routing work?**  
A: The API route scores all 146 agents against your message using keyword matching, tag matching, and domain intent boosters. The top 3 agents with a score ≥ 5 are selected, their full system prompts are loaded, and injected alongside your career context.

**Q: Can I target a specific agent?**  
A: Yes — mention the domain in your message. "Prepare me for a Google system design interview" routes to Google Interview Coach and System Design Coach. "Help me negotiate my salary at Stripe" routes to Salary Negotiation Coach and Offer Evaluation Advisor.

**Q: Is Copilot chat history saved?**  
A: Yes — Copilot history is saved in localStorage (guest mode) or the database (authenticated). You can organize conversations into folders, pin, favorite, archive, and export sessions.

---

## MCP Server

**Q: What is MCP and why should I use it?**  
A: MCP (Model Context Protocol) lets AI assistants in your code editor (Cursor, Claude Desktop, Continue) call Career OS tools directly. Instead of copy-pasting information between your editor and a browser, you can ask Cursor to analyze your GitHub profile or generate interview prep — right inside your IDE.

**Q: Is the MCP server safe to run locally?**  
A: Yes. The MCP server only reads local registry files and makes no network requests. It has a built-in rate limiter (200 req/min) and audit logging.

**Q: Can I use the MCP server on a remote server?**  
A: The MCP server uses stdio protocol and is designed for local use only. Do not expose it to the public internet.

---

## Agents

**Q: How do I know which agent is responding to my message?**  
A: When agents are routed, the Copilot response starts with a `<thinking>` block showing which agents were selected (e.g., "Orchestrating career agent team: ATS Resume Reviewer 🧾, Resume Keyword Optimizer 🎯"). The selected agent prompts are then merged into the response.

**Q: Can I create my own agents?**  
A: Yes. See [DEVELOPMENT.md](./DEVELOPMENT.md#adding-a-new-agent) for the step-by-step guide. Agents are Markdown files with YAML frontmatter and a system prompt body.

**Q: How many agents are there?**  
A: 146 agents across 19 divisions. See [AGENTS.md](./AGENTS.md) for the full list.

---

## Plugins

**Q: Are plugins free?**  
A: Yes. All 5 currently available plugins are free.

**Q: Do plugins send data to external servers?**  
A: No. Plugins modify the Copilot's system prompt locally — they don't make external API calls.

**Q: Can multiple plugins be active at the same time?**  
A: Yes. All enabled plugins are injected simultaneously into the Copilot context.

---

## Deployment

**Q: Can I deploy Career OS to Vercel for free?**  
A: Yes. Vercel's free (Hobby) plan supports Next.js deployments. You'll need a free PostgreSQL provider (Neon or Supabase) for the database.

**Q: Can I white-label Career OS for my bootcamp/university?**  
A: Yes — the MIT license allows this. White-label deployment options (custom branding, private agent library) are on the v3.1 roadmap.

**Q: Is Career OS GDPR compliant?**  
A: The data architecture supports GDPR (cascade deletes, no third-party data sharing, no server-side API key storage). A formal GDPR data export/deletion tool is planned for v3.1.

---

## Contributing

**Q: How do I contribute?**  
A: See [CONTRIBUTING.md](../CONTRIBUTING.md). The quickest contributions are new agents (Markdown files) — they don't require any coding.

**Q: Do I need to know Python to contribute?**  
A: Only if you're modifying the agent registry scripts (`scripts/validate.py`, `scripts/generate-data.py`). Web app contributions require TypeScript/React. Agent contributions require only Markdown.

**Q: How do I report a bug?**  
A: Open a [GitHub Issue](https://github.com/karthikrshet/Career-Agents/issues) with your OS, Node.js version, and steps to reproduce.

**Q: Is there a Discord or community?**  
A: Join [GitHub Discussions](https://github.com/karthikrshet/Career-Agents/discussions) for community conversation. Discord information is in [SUPPORT.md](../SUPPORT.md).
