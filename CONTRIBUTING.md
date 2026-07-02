# Contributing to Career Operating System (Career OS)

Welcome! We are excited that you want to contribute to **Career-Agents**, the world's leading open-source Career Operating System. 

By standardizing our agent specification format and local tooling, we are building the open infrastructure for career advancement, developer growth, placement preparation, and startup execution.

---

## 🏛️ New Division Architecture

All additions must align with our standardized divisions. If you are proposing a new agent, make sure it is assigned to one of the following directories:

1. **career/** — Job applications, salary negotiation, career planning.
2. **company-interviews/** — Company-specific (FAANG+) loop coaching.
3. **engineering/** — System architecture, Next.js optimization, DevOps pipelines.
4. **interview/** — STAR behavioral answers, system design, mock screens.
5. **networking/** — LinkedIn cold messaging, warm referrals, recruiter screenings.
6. **projects/** — Final Year Projects, documentation reviews, viva defense.
7. **resume/** — Achievements metrics (STAR/XYZ), ATS keywords, formats.
8. **startup/** — MVPs, competitor audits, product growth loops.

---

## 🚀 How to Contribute

### 1. Developer Onboarding
Please review the complete onboarding steps documented in [**docs/contributor-guide.md**](./docs/contributor-guide.md). 

### 2. Standardized Agent Format
Every agent markdown file must adhere strictly to the [**docs/agent-standard.md**](./docs/agent-standard.md) file structure, containing:
- Full YAML frontmatter (`name`, `description`, `color`, `emoji`, `vibe`).
- 9 required headings (starting with `## 🧠 Your Identity & Memory`).
- Minimum 1,500 words of high-fidelity, consulting-grade advice.

### 3. Registry & Index Updates
Any new agent addition requires updating the registries. Rather than editing files manually, run the automation helper:
```bash
python scripts/sync.py
```
This script rebuilds `agent-registry.json` and `divisions.json` with correct metrics and metadata.

### 4. Code Quality & Formatting
Ensure all files are validated by running:
```bash
python scripts/validate.py
```

---

## 💬 Community Discussions & Submissions
- Suggest feature requests or report bugs using our structured **GitHub Issue Templates**.
- Share custom workflows or discuss desktop features in the **GitHub Discussions** area.
