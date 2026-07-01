<div align="center">

# 🎓 CodeMyFYP-Agents

### The Open-Source AI Specialist Ecosystem for Students, Developers, Job Seekers & Founders

**Stop prompting. Start hiring.**

Every agent in this repository is engineered like a real specialist — with a memory, a personality, opinions, workflows, deliverables, and standards to hold themselves to. Not a one-line prompt. A hire.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Agents](https://img.shields.io/badge/agents-25%2F100-blue.svg)](./divisions.json)
[![Divisions](https://img.shields.io/badge/divisions-4-orange.svg)](#-divisions)

[Quick Start](#-quick-start) • [Divisions](#-divisions) • [Agent Roster](#-agent-roster) • [Examples](#-examples--use-cases) • [Contributing](#-contributing) • [Roadmap](#-roadmap)

</div>

---

## 🧭 Project Philosophy

Most "AI agent" repositories are glorified prompt libraries: a paragraph of role-play dressed up as a specialist. You copy it in, get a generic answer, and copy in the next one hoping for something better.

**CodeMyFYP-Agents rejects that model.**

We believe an agent worth using should feel like you actually hired someone:

- 🧠 **It has a memory.** It tracks what it has seen, what patterns keep repeating, and what you've already been told.
- 🎯 **It has a mission, not a vibe.** Every agent works toward specific, measurable outcomes — not "helpful advice."
- 🚨 **It has standards.** Every agent has hard rules about what it refuses to do and what quality bar it will not go below.
- 📋 **It produces deliverables.** Not paragraphs — reports, scorecards, roadmaps, checklists, and frameworks you can act on immediately.
- 💭 **It has a voice.** Every agent has a personality, opinions built from experience, and even the occasional frustration — because generic AI tone helps no one.

This repository exists because students and early-career developers are told to "just use ChatGPT" for their resume, their FYP, their interview prep, and their startup idea — and get back the same bland, forgettable output as everyone else. **CodeMyFYP-Agents is the alternative: elite, specialized, opinionated AI collaborators, built in the open, for the community that needs them most.**

Our target audience:

- 🎓 Students building Final Year Projects who need a real second brain, not a search engine
- 💼 Job seekers who need their resume, LinkedIn, and interview skills held to a professional bar
- 👨‍💻 Developers who want an architecture-literate reviewer, not a linter
- 🚀 Early-stage founders who need a co-founder's instincts without a co-founder's equity

---

## 📂 Repository Structure

```
CodeMyFYP-Agents/
│
├── career/                        # Placement, resumes, interviews, personal brand
│   ├── placement-coach.md
│   ├── ats-resume-reviewer.md
│   ├── resume-strategist.md
│   ├── linkedin-growth-advisor.md
│   ├── technical-interview-coach.md
│   └── hr-interview-coach.md
│
├── engineering/                   # Full-stack, architecture, DevOps, code quality
│   ├── mern-architect.md
│   ├── nextjs-performance-engineer.md
│   ├── backend-architect.md
│   ├── database-engineer.md
│   ├── devops-engineer.md
│   └── code-reviewer.md
│
├── startup/                       # Founder-stage product, growth, and market thinking
│   ├── founder-advisor.md
│   ├── product-manager.md
│   ├── growth-strategist.md
│   └── market-research-analyst.md
│
├── projects/                      # Final Year Project lifecycle support
│   ├── final-year-project-advisor.md
│   ├── research-assistant.md
│   ├── documentation-specialist.md
│   └── viva-coach.md
│
├── README.md                      # You are here
├── CONTRIBUTING.md                # How to add or improve an agent
├── ROADMAP.md                     # Where this project is headed
├── LICENSE                        # MIT
├── divisions.json                 # Machine-readable division/agent registry
└── tools.json                     # Machine-readable tool/capability registry
```

---

## 🏛️ Divisions

<table>
<tr>
<td width="25%" valign="top">

### 💼 Career
Everything between "I have a degree" and "I have an offer letter." Resume engineering, ATS survival, interview reps, and personal brand.

**11 agents**

</td>
<td width="25%" valign="top">

### 🛠️ Engineering
Full-stack architecture, performance, databases, DevOps, and code review — held to production standards, not tutorial standards.

**6 agents**

</td>
<td width="25%" valign="top">

### 🚀 Startup
Founder-stage thinking: product decisions, growth loops, market validation, and the judgment calls no course teaches.

**4 agents**

</td>
<td width="25%" valign="top">

### 🎓 Projects
The Final Year Project lifecycle — from topic selection to viva defense — with a research assistant and documentation specialist alongside you the whole way.

**4 agents**

</td>
</tr>
</table>

---

## 🧑‍💻 Agent Roster

| Agent | Division | Status | Description |
|---|---|---|---|
| [`placement-coach`](./career/placement-coach.md) | Career | ✅ Live | End-to-end placement strategy — from readiness audit to offer negotiation |
| `ats-resume-reviewer` | Career | 🔜 Planned | Line-by-line ATS-survival resume audits |
| `resume-strategist` | Career | 🔜 Planned | Narrative and positioning strategy behind the resume |
| `linkedin-growth-advisor` | Career | 🔜 Planned | Profile optimization and visibility growth for recruiters |
| `technical-interview-coach` | Career | 🔜 Planned | DSA, system design, and technical interview drilling |
| `hr-interview-coach` | Career | 🔜 Planned | Behavioral rounds, salary conversations, offer negotiation |
| `mern-architect` | Engineering | 🔜 Planned | MERN stack architecture and scalability review |
| `nextjs-performance-engineer` | Engineering | 🔜 Planned | Next.js performance auditing and optimization |
| `backend-architect` | Engineering | 🔜 Planned | API design, service boundaries, backend architecture |
| `database-engineer` | Engineering | 🔜 Planned | Schema design, indexing, query optimization |
| `devops-engineer` | Engineering | 🔜 Planned | CI/CD, containers, deployment pipelines |
| `code-reviewer` | Engineering | 🔜 Planned | Senior-level code review and technical debt triage |
| `founder-advisor` | Startup | 🔜 Planned | Early-stage founder judgment and decision-making |
| `market-research-analyst` | Startup | 🔜 Planned | Market sizing, competitor analysis, validation |
| `product-manager` | Startup | 🔜 Planned | MVP definition and product roadmap strategy for early-stage startups |
| `growth-strategist` | Startup | 🔜 Planned | Customer acquisition and retention planning for startup growth |
| `final-year-project-advisor` | Projects | 🔜 Planned | Final Year Project scope, feasibility, and evaluation readiness guidance |
| `research-assistant` | Projects | 🔜 Planned | Research method support, literature review guidance, and data analysis planning |
| `documentation-specialist` | Projects | 🔜 Planned | Project documentation, technical writing, and academic report structuring |
| `viva-coach` | Projects | 🔜 Planned | Viva preparation, examiner question prediction, and defense confidence coaching |
| `internship-application-strategist` | Career | 🔜 Planned | Internship application strategy and campus placement readiness |
| `job-search-strategist` | Career | 🔜 Planned | Targeted job search planning and application tracking |
| `salary-negotiation-coach` | Career | 🔜 Planned | Offer negotiation strategy and compensation benchmarking |
| `offer-evaluation-advisor` | Career | 🔜 Planned | Offer comparison and decision-making framework |
| `recruiter-outreach-specialist` | Career | 🔜 Planned | Recruiter outreach message sequencing and response strategy |

**Progress: 1 / 25 available agents live in the repository.** See the [Roadmap](./ROADMAP.md) for what's next.

---

## ⚡ Quick Start

CodeMyFYP-Agents is designed to work anywhere you can paste a system prompt — Claude, ChatGPT, Claude Code, Cursor, or any LLM-powered assistant.

### 1. Pick your agent

Browse the [Agent Roster](#-agent-roster) or the division folders above and pick the specialist that matches your need.

### 2. Copy the agent file

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
cat career/placement-coach.md
```

### 3. Load it into your assistant

Paste the full contents of the `.md` file (including the frontmatter) as a system prompt, custom instructions, or a Claude Project/Custom GPT configuration.

### 4. Start the conversation

Talk to the agent like you would a real specialist. Give it context — your resume, your codebase, your project brief — and let its workflow do the rest.

> 💡 **Tip:** Agents are designed to be composed. Run your resume through `ats-resume-reviewer` and `resume-strategist` before your first `technical-interview-coach` session for the strongest results.

---

## 📖 Examples & Use Cases

**"I have a placement drive in 3 weeks and my resume has been rejected everywhere."**
→ Load `placement-coach.md`. It runs a readiness audit, flags what's tanking your applications, and builds you a 3-week action plan with weekly milestones.

**"My FYP proposal keeps getting sent back for revisions."**
→ Load `final-year-project-advisor.md` (coming in Phase 1). It evaluates your scope, feasibility, and originality against what evaluators actually look for.

**"I want a senior engineer's opinion on my Next.js app's performance before I ship it."**
→ Load `nextjs-performance-engineer.md` (coming in Phase 1). It runs a structured performance audit and returns a prioritized fix list, not a vague "looks fine."

**"I'm a solo founder and don't know if my idea is worth building."**
→ Load `founder-advisor.md` (coming in Phase 1). It stress-tests your idea the way a blunt, experienced co-founder would — before you write a line of code.

---

## Installation

This project supports multiple installer targets and tool integrations. Use `scripts/install.sh` on macOS/Linux and `scripts/install.ps1` on Windows for validation and local setup. For tool-specific packaging, use `scripts/convert.py`.

### Claude Code

Export an agent to Claude Code manifest using the converter:

```bash
python3 scripts/convert.py convert --agent career/placement-coach.md --target claude-code --out ./build
```

### Cursor

Export a Cursor rules package (JSON) for inspection:

```bash
python3 scripts/convert.py convert --agent startup/market-research-analyst.md --target cursor --out ./build
```

### Codex

Prepare a Codex-compatible manifest:

```bash
python3 scripts/convert.py convert --agent career/ats-resume-reviewer.md --target codex --out ./build
```

### Gemini CLI

Generate a CLI-friendly manifest for Gemini integrations:

```bash
python3 scripts/convert.py convert --agent career/technical-interview-coach.md --target gemini-cli --out ./build
```


## 🤝 Contributing

This project grows through community-built agents. If you can write a specialist to the same bar as `placement-coach.md`, we want it in this repository.

Read the full [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- The exact agent file standard
- Naming and folder conventions
- The review and PR process
- Quality bar and word-count requirements

**In short:** every agent needs a real personality, a real workflow, real deliverables, and at least 1,000 words of substance. No shallow prompts.

---

## 🗺️ Roadmap

| Phase | Milestone |
|---|---|
| **Phase 1** | 20 core agents live across all 4 divisions |
| **Phase 2** | 50 agents, expanded division depth |
| **Phase 3** | 100 agents — the full ecosystem |
| **Phase 4** | CLI agent installer (`npx codemyfyp-agents add placement-coach`) |
| **Phase 5** | Native Cursor integration |
| **Phase 6** | Native Claude Code integration |
| **Phase 7** | Community agent marketplace |

Full details in [ROADMAP.md](./ROADMAP.md).

---

## 🌍 Community

- **Star this repo** if the mission resonates — it's the single biggest signal that keeps this project funded with maintainer time.
- **Open an issue** for agent ideas, bugs in existing agents, or ecosystem suggestions.
- **Open a PR** if you've built or improved an agent — see [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Share your results.** If an agent helped you land an interview, ship a feature, or pass your viva, tell us — it shapes what we prioritize.

---

## 📊 Project Statistics

- **4** divisions
- **20** agents planned for Phase 1 · **1** live today
- **100** agents at Phase 3 completion
- **1,000+ word minimum** per agent, enforced at review
- **MIT licensed** — free for personal, academic, and commercial use

---

## 🔮 Future Vision

CodeMyFYP-Agents aims to become the default first stop for any student or early-career technologist who needs expert-level guidance and doesn't have access to a mentor, a career coach, or a technical lead. Long-term, this means:

- A one-command installer that drops any agent into your IDE or terminal
- Native integrations with the tools developers already live in — Cursor, Claude Code, VS Code
- A community marketplace where specialists for niche stacks, industries, and career paths can be discovered and rated
- A living ecosystem that grows every time someone in this community needs a specialist that doesn't exist yet — and builds it

---

## 📄 License

Released under the [MIT License](./LICENSE). Use it, fork it, ship it, build a product on top of it.

---

<div align="center">

**Built by the community, for the community trying to break into tech.**

[Get Started](#-quick-start) · [Browse Agents](#-agent-roster) · [Contribute](./CONTRIBUTING.md)

</div>

