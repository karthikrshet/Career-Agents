<div align="center">

# 🚀 Career-Agents

### Open source AI specialist ecosystem for placement, internship, startup, and developer success

**Stop prompting. Start hiring.**

Every agent in this repository is built like a real specialist — with workflows, deliverables, rules, and a clear mission. Not a one-line prompt. A hire.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Divisions](https://img.shields.io/badge/divisions-6-orange.svg)](#-divisions)
[![Agents](https://img.shields.io/badge/agents-25%2B%2F100-blue.svg)](./divisions.json)

[Quick Start](#-quick-start) • [Divisions](#-divisions) • [Agent Roster](#-agent-roster) • [Workflows](#-workflows) • [Docs](#-documentation) • [CI & Validation](#-github-automation)

</div>

---

## 🧭 Project Philosophy

Most agent repositories are prompt collections wrapped in specialist language. You paste them in, get an answer, and repeat.

Career-Agents is different.

We build agents as repeatable, expert workflows:

- 🧠 **Memory and structure.** Agents remember what they have seen, track key decisions, and keep the conversation on task.
- 🎯 **Outcome-oriented.** Each agent works toward a clear deliverable, not a vague “helpful reply.”
- 🚨 **Built-in guardrails.** Every agent has explicit rules for what it will and will not do.
- 📋 **Actionable outputs.** Reports, checklists, roadmaps, and evaluation matrices you can use directly.
- 💬 **Distinct voice.** Agents feel like a specialized collaborator, not a generic assistant.

This repository exists to give students, interns, founders, and early-career developers a stronger alternative to copying and pasting generic prompts.

---

## ⚖️ How This Compares to Agency Agents

Career-Agents is built for the same clarity and usability goals, but with a narrower domain focus:

- **Career-first and placement-first.** We centre on resumes, internships, placement, startup product decisions, and developer readiness.
- **Workflow-driven.** Each agent is designed as a repeatable process, not a single-shot prompt.
- **Registry-ready.** Every agent is tracked in `divisions.json` and validated across the repo.
- **Tool-friendly.** We include CLI install and export tooling for faster adoption.

---

## 📂 Repository Structure

```
Career-Agents/
│
├── career/                        # Placement, applications, resumes, interviews
├── engineering/                   # Architecture, performance, backend, DevOps, code review
├── startup/                       # Founder strategy, validation, product, growth
├── projects/                      # Final Year Project planning, research, writing, defense
├── workflows/                     # Practical operating systems for common journeys
├── docs/                          # Contribution, agent standard, integrations, release guidance
├── scripts/                       # CLI, validation, export tooling
├── .github/                       # CI, templates, automation
├── divisions.json                 # Machine-readable roster
├── agent-registry.json            # Registry source for automation
├── tools.json                     # Tool/capability registry
├── README.md                      # This file
└── LICENSE                        # MIT license
```

---

## 🧑‍💻 Agent Roster

| Agent | Division | Status | Description |
|---|---|---|---|
| [`placement-coach`](./career/placement-coach.md) | Career | ✅ Live | End-to-end placement strategy, readiness audit, application plan, and offer preparation |
| `ats-resume-reviewer` | Career | 🔜 Planned | Resume audit for ATS parsing, keyword alignment, and formatting hygiene |
| `resume-strategist` | Career | 🔜 Planned | Resume narrative, role positioning, and achievement framing |
| `linkedin-growth-advisor` | Career | 🔜 Planned | LinkedIn profile optimization and recruiter visibility strategy |
| `technical-interview-coach` | Career | 🔜 Planned | Coding, systems, and interview drill workflows with structured feedback |
| `hr-interview-coach` | Career | 🔜 Planned | Behavioral interview readiness, hiring manager prep, and compensation conversation support |
| `internship-application-strategist` | Career | 🔜 Planned | Internship application planning, program targeting, and student positioning |
| `job-search-strategist` | Career | 🔜 Planned | Job search funnel, employer targeting, and application tracking systems |
| `salary-negotiation-coach` | Career | 🔜 Planned | Offer negotiation readiness, compensation modeling, and ask strategy |
| `offer-evaluation-advisor` | Career | 🔜 Planned | Offer comparison, total compensation scoring, and decision framework |
| `recruiter-outreach-specialist` | Career | 🔜 Planned | Recruiter outreach messaging, follow-up cadence, and response strategy |
| `mern-architect` | Engineering | 🔜 Planned | MERN stack architecture review and scalability guidance |
| `nextjs-performance-engineer` | Engineering | 🔜 Planned | Next.js performance audit, metrics lift, and optimization plan |
| `backend-architect` | Engineering | 🔜 Planned | API design, service boundary, and backend architecture planning |
| `database-engineer` | Engineering | 🔜 Planned | Schema design, indexing strategy, and query optimization |
| `devops-engineer` | Engineering | 🔜 Planned | CI/CD pipelines, infrastructure, deployment, and reliability guidance |
| `code-reviewer` | Engineering | 🔜 Planned | Senior-level code review, technical debt triage, and maintainability advice |
| `founder-advisor` | Startup | 🔜 Planned | Founder judgement, idea validation, and early-stage product decisions |
| `market-research-analyst` | Startup | 🔜 Planned | Market sizing, competitor analysis, and validation research |
| `product-manager` | Startup | 🔜 Planned | MVP definition, roadmap prioritization, and product strategy |
| `growth-strategist` | Startup | 🔜 Planned | Customer acquisition, retention, and growth loop planning |
| `final-year-project-advisor` | Projects | 🔜 Planned | FYP scope review, feasibility checks, and evaluation readiness guidance |
| `research-assistant` | Projects | 🔜 Planned | Research methodology, literature review, and data planning support |
| `documentation-specialist` | Projects | 🔜 Planned | Academic and technical documentation structure and clarity |
| `viva-coach` | Projects | 🔜 Planned | Viva defense preparation, examiner question simulation, and confidence coaching |

> Current status: 6 divisions · 25 defined agents · 1 live · 24 planned

---

## 🏛️ Divisions

### 💼 Career
Placement strategy, resume engineering, interview coaching, offer decision frameworks, and recruiter visibility.

### 🛠️ Engineering
Technical architecture, performance review, backend design, databases, DevOps, and senior code review.

### 🚀 Startup
Early-stage founder support: product, growth, market research, and idea validation.

### 🎓 Projects
Final Year Project support from topic selection to research, documentation, and viva preparation.

---

## ⚡ Quick Start

Career-Agents is designed for both manual and CLI-first usage.

### Manual usage

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
cat career/placement-coach.md
```

Copy the complete Markdown file, including frontmatter, into your assistant or tool configuration.

### CLI usage

```bash
npm install
npx codemyfyp-agents list
npx codemyfyp-agents info placement-coach
npx codemyfyp-agents install placement-coach ./installed_agents
npx codemyfyp-agents validate
```

The built-in CLI makes agent discovery, installation, and validation repeatable.

---

## 📦 Installation

### Local setup

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents
npm install
```

### Validation

- `python scripts/validate.py` — checks agent frontmatter, section headings, registry sync, and minimum length
- `npx codemyfyp-agents validate` — validation via the built-in CLI
- `npm test` — runs repository validation through the CLI

### Exporting agents

Use `scripts/convert.py` to convert agents into tool-specific manifests:

```bash
python3 scripts/convert.py --list
python3 scripts/convert.py convert --agent career/placement-coach.md --target claude-code --out ./build
python3 scripts/convert.py convert --agent startup/market-research-analyst.md --target cursor --out ./build
python3 scripts/convert.py convert --agent career/ats-resume-reviewer.md --target codex --out ./build
python3 scripts/convert.py convert --agent career/technical-interview-coach.md --target gemini-cli --out ./build
```

Supported targets are defined in `scripts/convert.py`.

---

## 📚 Workflows

This repository includes operational workflows for the most common career paths:

- `workflows/ats-optimization.md` — ATS-ready resume and application packaging system
- `workflows/faang-preparation.md` — multi-week technical interview preparation system
- `workflows/fresher-placement.md` — four- to eight-week placement funnel for students and freshers
- `workflows/hr-interview-week.md` — seven-day HR and behavioral interview operating system
- `workflows/internship-hunt.md` — student internship search pipeline and execution plan
- `workflows/linkedin-growth.md` — recruiter visibility and profile strategy
- `workflows/offer-comparison.md` — offer evaluation and decision framework
- `workflows/remote-job-hunt.md` — remote application and sourcing strategy
- `workflows/salary-negotiation.md` — compensation preparation and negotiation readiness
- `workflows/technical-interview-week.md` — one-week coding and systems readiness plan

These workflows complement the agent roster with practical step-by-step execution.

---

## 📘 Documentation

Core docs for contributors and maintainers:

- `docs/agent-standard.md` — agent file structure and required content
- `docs/architecture.md` — repository architecture and machine-readable registry design
- `docs/contributor-guide.md` — how to contribute agents, workflows, and repo improvements
- `docs/integrations.md` — integration patterns and export targets
- `docs/release-guide.md` — release process and versioning guidance

---

## 🤖 GitHub Automation

Quality is enforced through CI and contribution templates:

- `.github/workflows/ci.yml` — validation on push and pull requests
- `.github/PULL_REQUEST_TEMPLATE.md` — PR checklist for agent contributions
- `.github/ISSUE_TEMPLATE/` — issue templates for bugs, feature requests, and documentation improvements
- `scripts/validate.py` — validation for required agent frontmatter, headings, file length, and registry consistency
- `scripts/install.ps1` — install validation used by CI
- `scripts/cli.js` — repository CLI for listing, installing, and validating agents

### CI checks

The CI pipeline runs:

- `npm install`
- `pwsh -NoProfile -Command "& { .\scripts\install.ps1 -ValidateOnly }"`
- `python scripts/validate.py`
- `npx codemyfyp-agents validate`

---

## 📊 Project Statistics

- **Divisions:** 6
- **Defined agents:** 25+
- **Live agents:** 25+
- **Planned agents:** 0+
- **Phase 1 target:** 20 core agents
- **Phase 2 target:** 50 agents
- **Phase 3 target:** 100 agents
- **Validation standard:** required frontmatter, required headings, and registry sync
- **License:** MIT

---

## 🗺️ Roadmap

### Current status

Career-Agents is in Phase 1: building the core roster, validation tooling, and installer foundation.

- `placement-coach` is live as the reference agent.
- 25 agents are defined across Career, Engineering, Startup, and Projects.
- CLI, validation, and export tooling are implemented.

### Near-term priorities

- Complete the remainder of Phase 1.
- Harden `divisions.json` and `agent-registry.json` automation.
- Improve contributor onboarding through docs and issue templates.
- Publish the CLI installer workflow as the preferred onboarding path.

### Long-term vision

- Phase 2: expand to 50 agents with deeper division coverage.
- Phase 3: grow to 100 agents for a full specialist ecosystem.
- Phase 4: CLI agent install and search workflows.
- Phase 5: native Cursor integration.
- Phase 6: native Claude Code integration.
- Phase 7: community marketplace for official and contributed agents.

See `ROADMAP.md` for full detail.

---

## 🤝 Contributing

This repository is built to be extended by contributors that meet the agent standard.

- Start with `docs/contributor-guide.md`.
- Follow the standard in `docs/agent-standard.md`.
- Update `divisions.json` when adding or activating an agent.
- Run validation before opening a PR.
- Use the PR template and keep your change set focused.

> An agent is a hire, not a prompt.

---

## 📄 License

Released under the [MIT License](./LICENSE).

<div align="center">

**Built for students, early-career technologists, and founders who need specialist-level guidance without the fluff.**

[Browse Agents](#-agent-roster) · [Get Started](#-quick-start) · [Contribute](./CONTRIBUTING.md)

</div>
