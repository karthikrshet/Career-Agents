# Contributing to CodeMyFYP-Agents

First off — thank you. This repository only becomes the ecosystem it's meant to be through community-built agents, and every well-crafted specialist you contribute raises the bar for everyone who uses this project.

This document is the complete standard for contributing. Read it fully before opening a PR — agents that don't meet this bar will be sent back for revision, not merged as-is.

---

## 📐 Core Principle

> **An agent is a hire, not a prompt.**

Every contribution — new agent or edit to an existing one — must be evaluated against that principle. If it reads like a paragraph of role-play instructions, it isn't ready.

---

## 🗂️ Folder Structure & File Naming

Agents live inside their division folder:

```
career/
engineering/
projects/
startup/
```

**Naming convention:** `kebab-case.md`, named after the role, not the topic.

- ✅ `technical-interview-coach.md`
- ✅ `nextjs-performance-engineer.md`
- ❌ `Interview_Coach.md`
- ❌ `interviewCoach.md`
- ❌ `career-interview-help.md`

If your agent doesn't fit an existing division, open an issue proposing a new division **before** submitting the agent PR — divisions are added deliberately, not per-PR.

---

## 📄 The Agent File Standard

Every agent file must follow this exact structure, in this order. Use `career/placement-coach.md` as the reference implementation — it is the gold-standard template for this repository.

### 1. Frontmatter

```yaml
---
name:
description:
color:
emoji:
vibe:
---
```

- `name`: the agent's display name
- `description`: one sentence, specific enough that someone scanning the roster knows exactly what this agent does and how it differs from a neighboring agent
- `color`: a hex or named color used for UI theming in future tooling
- `emoji`: a single emoji representing the agent
- `vibe`: 3-6 words capturing the agent's personality (e.g. "blunt, data-driven, relentlessly practical")

### 2. `## 🧠 Your Identity & Memory`

Must define the agent's **Role**, **Personality**, **Memory**, and **Experience**. The personality must be specific and human — give the agent real opinions, a few pet peeves, and a background that explains *why* it thinks the way it does. Generic "I am a helpful assistant" framing is an automatic rejection.

### 3. `## 🎯 Your Core Mission`

3–5 mission areas. Each must include **Purpose**, **Responsibilities**, **Expected outcomes**, and **Default requirements**.

### 4. `## 🚨 Critical Rules You Must Follow`

5–10 non-negotiable operating rules covering what the agent refuses to do, the quality bar it holds itself to, and failure modes it actively guards against.

### 5. `## 📋 Technical Deliverables`

At least 2-3 concrete, professionally formatted templates the agent produces — audit reports, scorecards, roadmaps, checklists, matrices. These should be usable as-is, not vague descriptions of what a deliverable "might contain."

### 6. `## 🔄 Workflow Process`

A minimum 5-step repeatable process. Every step needs a stated **Purpose/Goal**, **Input**, **Output**, and **Success criteria**.

### 7. `## 💭 Communication Style`

Describe how the agent talks, teaches, critiques, disagrees, and handles uncertainty. This section is what makes the agent feel consistent across a long conversation — don't skip it or make it generic.

### 8. `## 🔄 Learning & Memory`

What the agent tracks across a conversation or session: patterns, inconsistencies, prior context, recurring mistakes.

### 9. `## 🎯 Success Metrics`

Concrete, measurable outcomes the agent is optimizing for — not "user satisfaction," but things like conversion rates, defect reduction, or specific quality benchmarks relevant to the domain.

### 10. `## 🚀 Advanced Capabilities`

The section that makes the agent feel genuinely elite: named frameworks, real methodologies, industry-standard practices, and expert-level judgment calls a junior version of this agent wouldn't know to make.

---

## ✅ Quality Bar (Enforced at Review)

Every submitted agent must be:

| Requirement | Standard |
|---|---|
| **Length** | Minimum 1,000 words (1,200+ recommended) |
| **Specialization** | Narrow and specific — no "does everything" agents |
| **Personality** | Distinct voice, real opinions, memorable traits |
| **Structure** | Every required section present, in order |
| **Deliverables** | Concrete templates, not descriptions of templates |
| **Actionability** | A user could act on the output immediately |
| **Originality** | Not a reskin of an existing agent in this repo |
| **Tone** | Professional, senior-practitioner voice — never generic AI tone |

Agents that fail any of these are not merged. This isn't gatekeeping for its own sake — the entire value of this repository is that every agent meets this bar, so users never have to wonder if the one they picked is the "good" one.

---

## 🔁 Pull Request Process

1. **Check `divisions.json`** to confirm the agent doesn't already exist or isn't already claimed in an open PR/issue.
2. **Open an issue first** for new agents outside the current roster, briefly describing the role and why it belongs in a specific division. This avoids duplicate work.
3. **Write the agent** following the [Agent File Standard](#-the-agent-file-standard) above.
4. **Self-review** against the [Quality Bar](#-quality-bar-enforced-at-review) checklist before submitting.
5. **Update `divisions.json`**: add your agent's entry under the correct division with `"status": "live"`.
6. **Open the PR** with:
   - Title: `feat(agent): add <agent-id>`
   - A short description of the agent's role and who it's for
   - Confirmation that you've reviewed the file against the quality bar
7. **Review cycle**: a maintainer will review for structural compliance, depth, and originality. Expect at least one round of revision requests on first-time contributions — this is normal, not a rejection.
8. **Merge**: once approved, your agent becomes part of the live roster and the README/roster table is updated.

---

## 🧪 Editing an Existing Agent

Improvements to existing agents are welcome and reviewed with the same rigor as new agents:

- Preserve the existing structure — don't remove required sections.
- If you're expanding a section, make sure it's additive value, not padding.
- If you're fixing an inconsistency (e.g., a workflow step with no clear output), explain the fix in your PR description.
- Personality changes should be proposed in an issue first — the agent's "voice" is core IP and shouldn't shift without discussion.

---

## 🚫 What We Won't Merge

- Agents that are one-paragraph role-play prompts, regardless of section headers being present
- Agents duplicating an existing specialist's scope without meaningful differentiation
- Agents written with generic, AI-sounding language ("I am here to help you succeed!")
- Deliverables described in the abstract rather than shown as usable templates
- Agents missing any of the 10 required sections
- PRs that don't update `divisions.json`

---

## 💬 Questions

Open a [GitHub Discussion](../../discussions) or an issue tagged `question`. If you're unsure whether an agent idea fits the repository's scope, ask before you write 1,200 words — we're happy to help you scope it right the first time.

Thank you for helping build the most useful open-source agent ecosystem for students and early-career builders.

---

## 🧾 Agent Quality Standards (Summary)

- **Minimum length:** 1,000 words (1,200+ recommended). Reviewers may reject short submissions.
- **Deliverables:** At least two concrete, copy-paste-ready templates (reports, scorecards, checklists).
- **Structure:** All 10 required sections must appear in the exact order listed above.
- **Voice:** Senior practitioner, opinionated, not generic AI phrasing.
- **Tests & Validation:** If the agent depends on specific inputs (resume, codebase), include sample inputs and expected outputs.

## 🛠 Contribution Workflow (Quick Steps)

1. Confirm the agent does not already exist in `divisions.json`.
2. Open an issue if adding a new division or if the agent concept needs prior discussion.
3. Author the agent file following the Agent File Standard.
4. Self-review using the Review Checklist below.
5. Update `divisions.json` with the new agent entry and `
