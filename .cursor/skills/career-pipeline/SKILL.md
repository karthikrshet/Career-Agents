---
name: career-pipeline
description: Career-Agents Job Search & Application Pipeline Router
license: MIT
---

# career-pipeline

Career-Agents MCP-powered unified job search and application pipeline router.

## Available Subcommands

| Subcommand | Purpose | Example |
|---|---|---|
| `scan` | Scan ATS job boards for open roles | `career-agents pipeline scan openai ashby` |
| `match` | Evaluate candidate profile fit (Blocks A-G Report) | `career-agents pipeline match jd.txt Google "AI Eng"` |
| `cv` | Compile ATS single-page HTML / LaTeX resume | `career-agents pipeline cv profile.json --html` |
| `cover` | Generate 3-paragraph executive cover letter | `career-agents pipeline cover Google "AI Eng"` |
| `interview` | Build STAR+R question banks and company track | `career-agents pipeline interview Google "AI Eng"` |
| `outreach` | Draft concise recruiter LinkedIn note (<300 chars) | `career-agents pipeline outreach "Sarah" Google "AI Eng"` |
| `tracker` | Ingest and manage live application state machine | `career-agents pipeline add Google "AI Eng" http://...` |
| `stats` | Compute conversion funnel analytics | `career-agents pipeline stats` |
| `doctor` | Verify dependencies, templates, and registries | `career-agents pipeline doctor` |

## Execution

```bash
# Global binary command
career-agents pipeline <command> [args]

# Local repository fallback
node ./scripts/cli.js pipeline <command> [args]
```

