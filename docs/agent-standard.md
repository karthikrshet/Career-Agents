# Agent Standard

## Purpose

This document defines the quality bar for Career-Agents markdown agents. The repository is meant to feel like a professional collection of specialist advisors, not a pile of prompt snippets. Every agent should read as if a real practitioner with domain judgment, habits, frustrations, and repeatable methods is sitting behind it.

The standard exists so contributors can write agents that are consistent enough to belong together while still distinct enough to feel alive. A resume agent should not sound like a founder agent. A viva coach should not sound like a DevOps engineer. Consistency comes from structure; personality comes from domain-specific judgment.

## Scope

This guide applies to files inside `career/`, `company-interviews/`, `engineering/`, `interview/`, `networking/`, `projects/`, `resume/`, and `startup/`. It does not define workflows, documentation pages, release notes, or registry schemas. Workflows should use the workflow standard described by their own files; docs should follow the documentation expectations in this folder.

## Required Frontmatter

Every agent must begin with exactly this frontmatter structure:

```yaml
---
name:
description:
color:
emoji:
vibe:
---
```

Frontmatter standards:

- `name` should be human-readable and match the agent's specialist identity.
- `description` should explain what the agent does and why a user would choose it.
- `color` should be a valid hex color.
- `emoji` should visually reinforce the role without becoming silly.
- `vibe` should describe tone and operating style, not generic positivity.

## Required Sections

Use these sections in this order:

```markdown
# Agent Name

## 🧠 Your Identity & Memory

## 🎯 Your Core Mission

## 🚨 Critical Rules You Must Follow

## 📋 Technical Deliverables

## 🔄 Workflow Process

## 💭 Communication Style

## 🔄 Learning & Memory

## 🎯 Success Metrics

## 🚀 Advanced Capabilities
```

The headings are part of the repository contract. Do not invent new top-level sections for agent files. If a concept is important, place it inside the closest required section.

## Standards

Strong agents should meet these standards:

- Minimum 1,200 words; complex specialist agents should often exceed 1,500 words.
- Complete frontmatter.
- Strong professional identity.
- Distinct personality, frustrations, biases, and decision philosophy.
- Practical deliverables with copy-ready templates.
- Workflow steps with objectives, inputs, outputs, and validation criteria.
- Domain-specific critical rules.
- Measurable success metrics.
- Advanced capabilities that reflect real professional methods.

The agent should never feel like a generic assistant wearing a role label. It should feel like a specialist who knows what usually goes wrong in the domain and has a disciplined way to prevent it.

## Examples

A weak identity:

```markdown
You help users improve resumes and give suggestions.
```

A stronger identity:

```markdown
You are an ATS Resume Reviewer: a line-by-line resume auditor who understands parser behavior, recruiter skim-time, keyword mapping, and the difference between truthful optimization and dishonest inflation.
```

A weak rule:

```markdown
- Be helpful and accurate.
```

A stronger rule:

```markdown
1. Never insert keywords for skills the candidate cannot defend in an interview. ATS matches create interviews; interviews verify claims.
```

A weak deliverable:

```markdown
- Resume checklist
```

A stronger deliverable:

```markdown
### Tailored Keyword Map
JD phrase -> Resume line(s) mapping
"React" -> Experience bullet 2 with project context
"CI/CD" -> Tools section + deployment bullet under current role
```

## Best Practices

- Start by reading high-quality existing agents in the same or adjacent division.
- Write the agent as a practitioner, not as a search result.
- Give the agent a specific frustration that reveals judgment.
- Use templates users can immediately copy into their work.
- Use examples that show the expected level of specificity.
- Name what the agent must refuse, slow down, or verify.
- Make the workflow professional enough that a consultant could run it.
- Keep advice tied to evidence, artifacts, metrics, or decisions.
- Avoid repeated paragraphs and filler encouragement.
- Make advanced capabilities genuinely advanced: frameworks, models, diagnostics, or decision systems.

## Common Mistakes

- **Generic AI voice:** "I provide helpful guidance" is not an identity.
- **Bullet-only sections:** Bullets are useful, but long-form sections need explanation and judgment.
- **Shallow deliverables:** A checklist with three vague items is not a technical deliverable.
- **No memory model:** Agents must track information across the conversation.
- **No refusal rules:** Strong agents know what not to do.
- **No measurable outcomes:** Success should be observable.
- **Copied personality:** Adjacent agents may share structure, but each needs its own specialist voice.
- **Overlapping scope:** Do not create an agent that duplicates an existing one without a sharper use case.

## Implementation Guidance

Before writing a new agent:

1. Search the repository for similar agents.
2. Decide the exact user problem the new agent owns.
3. Define what the agent does better than adjacent agents.
4. Draft frontmatter and required sections.
5. Add practical templates and examples.
6. Review for domain specificity and personality.
7. Validate word count, headings, and metadata.
8. Update `divisions.json` and `agent-registry.json` if the agent is new.

Before submitting, ask:

- Would a user know when to choose this agent?
- Does the agent have a memorable professional personality?
- Are the deliverables usable without additional explanation?
- Does the workflow produce outputs, not just advice?
- Are the success metrics measurable?
- Does the agent match the quality of the strongest repository agents?
