# 🗺️ Roadmap

CodeMyFYP-Agents grows in deliberate phases — depth before breadth, quality before quantity. Every phase builds on a stable foundation from the one before it.

---

## Phase 1 — Foundation: 20 Agents

**Goal:** Establish the core roster across all four divisions at the full quality bar defined in [CONTRIBUTING.md](./CONTRIBUTING.md), proving the agent format works end-to-end for real users.

- [x] Repository architecture, README, CONTRIBUTING, ROADMAP, `divisions.json`
- [x] `placement-coach.md` — gold-standard reference agent
- [ ] Remaining 5 Career agents (`ats-resume-reviewer`, `resume-strategist`, `linkedin-growth-advisor`, `technical-interview-coach`, `hr-interview-coach`)
- [ ] 6 Engineering agents (`mern-architect`, `nextjs-performance-engineer`, `backend-architect`, `database-engineer`, `devops-engineer`, `code-reviewer`)
- [ ] 4 Startup agents (`founder-advisor`, `product-manager`, `growth-strategist`, `market-research-analyst`)
- [ ] 4 Projects agents (`final-year-project-advisor`, `research-assistant`, `documentation-specialist`, `viva-coach`)

**Exit criteria:** all 20 agents live, each independently reviewed against the quality bar, `divisions.json` fully accurate.

---

## Phase 2 — Depth: 50 Agents

**Goal:** Expand each division with more specialized roles that address gaps discovered from real Phase 1 usage — sub-specialties, adjacent stacks, and more niche career/academic scenarios.

Planned expansion areas:

- **Career:** cold outreach specialist, referral strategist, offer negotiation specialist, portfolio reviewer
- **Engineering:** mobile architect (React Native/Flutter), cloud cost engineer, security reviewer, API testing specialist, frontend performance engineer
- **Startup:** fundraising advisor, pricing strategist, customer discovery coach, competitive positioning analyst
- **Projects:** dataset & methodology reviewer, presentation design coach, plagiarism & originality auditor, project pivot advisor

**Exit criteria:** 50 agents live, community contribution pipeline active (external PRs merged, not just maintainer-authored agents).

---

## Phase 3 — The Full Ecosystem: 100 Agents

**Goal:** Comprehensive coverage — CodeMyFYP-Agents becomes the default answer to "is there an agent for X?" across career, engineering, startups, and academic projects.

- Deeper stack coverage (mobile, data engineering, ML engineering, cloud-specific architects)
- Industry-specific career coaches (product-based companies, service-based companies, core/non-CS roles)
- Cross-division composite workflows (e.g., a guided multi-agent "FYP to Placement" pipeline)

**Exit criteria:** 100 agents live, majority community-contributed, documented composite workflows between agents.

---

## Phase 4 — Agent Installer

**Goal:** Remove the copy-paste friction from using an agent.

- CLI tool: `npx codemyfyp-agents add <agent-id>`
- Installs the agent file locally, with optional direct injection into supported tools' config formats
- Agent search/discovery from the CLI (`npx codemyfyp-agents list --division=career`)

**Exit criteria:** installer published to npm, documented, and used as the primary onboarding path in the README.

---

## Phase 5 — Cursor Integration

**Goal:** Native support for loading CodeMyFYP-Agents directly inside Cursor.

- `.cursor/rules` compatible agent packaging
- One-command install of any agent as a Cursor custom mode or rule set
- Documentation and examples specific to Cursor workflows

**Exit criteria:** documented Cursor install path, verified working across a sample of Engineering-division agents.

---

## Phase 6 — Claude Code Integration

**Goal:** Native support for loading agents into Claude Code as custom subagents/commands.

- Agent packaging compatible with Claude Code's custom agent/config format
- Installer support: `npx codemyfyp-agents add <agent-id> --target=claude-code`
- Reference workflows showing multi-agent handoffs inside a single Claude Code session

**Exit criteria:** documented Claude Code install path, verified working across a sample of agents from each division.

---

## Phase 7 — Community Marketplace

**Goal:** A discoverable, ratable marketplace of agents — both official and community-maintained — so the ecosystem can grow beyond what the core maintainers can hand-review at scale.

- Agent submission portal with automated structural validation against the [Agent File Standard](./CONTRIBUTING.md#-the-agent-file-standard)
- Community ratings and usage-based discovery
- Verified/official badge for maintainer-reviewed agents
- Category and stack-based search

**Exit criteria:** marketplace live, accepting external submissions, with a moderation and quality-review pipeline distinct from the core repository's PR process.

---

## How Phases Are Paced

We do not start a new phase until the previous phase's exit criteria are met. This is intentional: a repository with 100 shallow agents is worth less than one with 20 excellent ones. If you want to help accelerate a phase, the highest-leverage thing you can do is contribute a single, excellent agent — see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Suggesting Roadmap Changes

Open a GitHub Discussion tagged `roadmap` if you think a phase is missing something, ordered wrong, or if you want to propose a new division entirely. Roadmap changes are discussed in the open — this is a community-shaped project.
