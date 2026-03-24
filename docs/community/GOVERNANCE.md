# Repository Governance

This document defines the management model, decision-making processes, roles, and review standards for **Career-Agents**, the Open-Source Career Operating System.

---

## 👥 Contributor Roles

We define three tiers of community members:

1. **Users**: Individuals utilizing agents, workflows, or the CLI locally.
2. **Contributors**: Members submitting pull requests (PRs) for documentation, integration guides, CLI bug fixes, or agents.
3. **Maintainers**: Core stewards with write access who coordinate releases, review complex changes, and define architectural standards.

---

## 🏛️ Decision Making Process

Our goal is to run a collaborative, high-velocity open-source project while protecting agent quality and registry schema integrity.

### Minor Changes
Minor typos, markdown adjustments, or local scripting improvements can be merged after approval by any active Maintainer.

### Breaking Changes & New Registries
Changes affecting schema architectures (e.g. modifying `agent-registry.json` fields, adding a new top-level registry file, or changing CLI flag syntax) require:
1. An open GitHub issue explaining the design tradeoff.
2. Review and consensus from at least two Maintainers.
3. Local verification via `career-agents doctor`.

---

## 📈 Quality Review Standards

To protect user trust, all pull requests containing agents must pass:
- **Automation checks**: CI must pass (Python validations and JSON syntax tests).
- **Quality standards**: Agent prompt files must avoid generic advice and fulfill the guidelines in `docs/agent-standard.md`.
- **Registry sync**: All files must match metadata entries in registries.
