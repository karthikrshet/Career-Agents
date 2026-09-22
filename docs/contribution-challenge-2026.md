# Career-Agents Open Source Contribution Challenge 2026

> **Tagline:** Find a real problem. Build the fix. Pass review. Get merged.

Welcome to the official **Career-Agents Open Source Contribution Challenge 2026**, organized by **Career-Agents × CodeMyFYP**. This global open-source engineering event invites software developers, AI engineers, systems architects, technical writers, and open-source enthusiasts to contribute directly to the production codebase of Career-Agents—the open-source AI Career Operating System.

---

## Key Event Information

| Detail | Specification |
|---|---|
| **Official Event Name** | Career-Agents Open Source Contribution Challenge 2026 |
| **Short Name** | CareerOS OSS Challenge 2026 |
| **Event Window** | September 25, 2026 – October 15, 2026 |
| **Submission Deadline** | October 15, 2026 at 11:59 PM IST |
| **Format** | Global, Online, 100% Free |
| **Organizers** | Career-Agents × CodeMyFYP |
| **Registration URL** | [https://luma.com/3df31stw](https://luma.com/3df31stw) |
| **Official Repository** | [https://github.com/karthikrshet/Career-Agents](https://github.com/karthikrshet/Career-Agents) |

---

## Event Overview & Purpose

The **Career-Agents Open Source Contribution Challenge 2026** is designed to encourage meaningful, production-grade open-source engineering. This event is **not a standalone hackathon or demo-video competition**. Participants work directly on the official Career-Agents repository, addressing real issues, introducing architecture improvements, optimizing algorithms, expanding MCP capabilities, enhancing AI agent behaviors, and improving developer experience.

### Core Event Philosophy
- **Impact > Lines of Code:** A clean 15-line fix resolving a critical bug is more valuable than a 1,000-line unrequested refactor.
- **Quality > PR Count:** Submitting multiple superficial or low-quality Pull Requests does not increase score or eligibility.
- **Merged-Quality Engineering:** Contributions are evaluated based on maintainability, testing rigor, documentation clarity, and adherence to project standards.
- **Submission Farming Rejected:** Spammy, automated, or trivial submissions will be closed and disqualified.

---

## Who Can Participate

The challenge is open to developers of all experience levels globally:
- **Experienced Open-Source Engineers:** Tackle complex system architecture, MCP protocol server tools, RAG context selection, performance bottlenecks, or CLI engine capabilities.
- **AI & Systems Developers:** Improve 167+ specialized AI agent personas, prompt design, evaluation benchmarks, or context-routing accuracy.
- **Full-Stack & Web Developers:** Resolve UI/UX edge cases, accessibility standards, responsive layouts, or API integration handling.
- **First-Time Open-Source Contributors:** Fix confirmed bugs, improve developer documentation, expand unit test coverage, or correct error diagnostics.

---

## Contribution Tracks

Participants may contribute across 14 dedicated engineering tracks:

### 1. Bug Fixes & Issue Resolution
Identify, reproduce, and resolve confirmed bugs or regressions in the core system, API endpoints, CLI scripts, or web application.
- *Examples:* Resolving copilot session hydration bugs on page refresh, fixing broken parameter passing in workflow engines, addressing edge-case state crashes.

### 2. AI Agents & Career Intelligence
Enhance existing agent prompts, improve context retention, refine evaluation metrics, or build specialized new career coaching agent definitions.
- *Examples:* Improving system prompt constraints for system design interview coaches, refining STAR framework output quality, expanding agent skill taxonomies.

### 3. Model Context Protocol (MCP) & Agentic Infrastructure
Upgrade MCP server implementations, protocol handlers, tool definitions, schema validation, or IDE extension compatibility.
- *Examples:* Adding schema validation to custom MCP tools, improving stdio transport reliability, optimizing tool discovery latency.

### 4. CLI & Developer Experience
Improve the command-line interface (`scripts/cli.js`), terminal output formatting, diagnostic commands, or cross-platform behavior (Windows, macOS, Linux).
- *Examples:* Enhancing terminal color themes and progress indicators, improving `career doctor` diagnostic checks, handling cross-platform PATH resolution.

### 5. Job Search & Automation
Refine job discovery parsers, ATS platform integrations (Greenhouse, Lever, Ashby, Workable, Workday), candidate matching algorithms, or application tracker logic.
- *Examples:* Improving HTML element selectors for job descriptions, optimizing keyword extraction heuristics, refining application status state machines.

### 6. Resume & ATS Intelligence
Enhance ATS scoring algorithms, resume parsing, keyword gap detection, PDF export rendering, or ATS Resume Studio templates.
- *Examples:* Improving section detection in resume text parsing, expanding keyword weighting dictionaries, fixing layout alignments in single-page HTML templates.

### 7. Interview Intelligence
Improve technical and behavioral question banks, company interview tracks, voice AI workflow logic, or mock interview evaluation rubrics.
- *Examples:* Adding behavioral STAR question banks for FAANG tracks, optimizing voice recognition latency handling, refining candidate feedback formatting.

### 8. AI, RAG & Context Retrieval
Optimize vector index mapping, knowledge graph queries, context window selection, hallucination prevention, or LLM provider integrations.
- *Examples:* Improving node-edge traversal efficiency in `knowledge-graph.json`, optimizing token window truncation, expanding multi-provider fallback handling.

### 9. Testing & Reliability
Expand automated test coverage across unit tests, integration tests, CLI commands, MCP tools, and regression suites.
- *Examples:* Adding unit tests for workflow engine state transitions, building mock API tests for external providers, expanding edge-case validation suites.

### 10. Security & Responsible Disclosure
Harden system security, sanitize user inputs, secure credential handling, or improve dependency safety.
- *Note:* Security vulnerability disclosures **must** be submitted privately following [SECURITY.md](../SECURITY.md). Publicly exposing exploitable vulnerabilities will lead to disqualification.

### 11. Performance & Resource Optimization
Reduce system latency, decrease startup overhead, optimize token consumption, or accelerate build/validation times.
- *Examples:* Implementing local prompt caching to reduce token usage by up to 85%, eliminating redundant JSON index parses, optimizing memory overhead.

### 12. Web, UX & Accessibility
Fix web UI layout bugs, improve dark mode styling, enhance keyboard navigation, add screen reader ARIA labels, or improve loading/error states.
- *Examples:* Fixing responsive container overflow on mobile screens, improving focus indicators for interactive buttons, adding ARIA attributes to modal dialogs.

### 13. Internationalization & Localization
Expand multi-language support, handle international resume standards, or adapt regional job search workflows.
- *Examples:* Adding support for international date/currency formats, supporting non-US resume structures, translating CLI guidance strings.

### 14. Documentation & Developer Education
Create high-value architecture guides, API tutorials, MCP configuration examples, step-by-step setup guides, or contributor onboarding resources.
- *Examples:* Writing clear MCP setup guides for VS Code and Cursor, documenting workflow engine state diagrams, improving troubleshooting flowcharts.

---

## Participation Workflow

Follow this step-by-step workflow for challenge participation:

```
┌──────────┐     ┌───────────────┐     ┌─────────────┐     ┌────────────┐
│ 1. Explore│ ──> │ 2. Find Problem│ ──> │ 3. Open Issue│ ──> │ 4. Fork Repo│
└──────────┘     └───────────────┘     └─────────────┘     └────────────┘
                                                                 │
┌──────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──v─────────┐
│ 8. Submit PR │ <── │ 7. Validate  │ <── │ 6. Implement│ <── │ 5. Branch  │
└──────────────┘     └──────────────┘     └─────────────┘     └────────────┘
       │
┌──────v───────┐     ┌──────────────┐     ┌─────────────┐
│ 9. Review    │ ──> │ 10. Revise   │ ──> │ 11. Merge   │
└──────────────┘     └──────────────┘     └─────────────┘
```

1. **Register:** Register your participation at [https://luma.com/3df31stw](https://luma.com/3df31stw).
2. **Explore:** Review the codebase, existing issues, and project documentation ([CONTRIBUTING.md](../CONTRIBUTING.md), [AGENTS.md](../AGENTS.md), [ROADMAP.md](../ROADMAP.md)).
3. **Find a Problem / Opportunity:** Identify a reproducible bug, a missing test suite, a performance bottleneck, or an approved feature request.
4. **Open or Claim an Issue:** Use the official GitHub issue templates (`.github/ISSUE_TEMPLATE/challenge_contribution.yml`, `challenge_bug.yml`, or `challenge_feature.yml`). Prefix issue titles with `[Challenge 2026]:`.
5. **Fork & Branch:** Fork the repository and create a descriptive working branch (`fix/description`, `feature/description`, `docs/description`, `agent/agent-id`).
6. **Implement:** Write clean, maintainable, TypeScript / Python / Markdown code adhering to project conventions.
7. **Test & Verify:** Run unit tests, linting, and local verification commands.
8. **Run Integrity Pipeline:**
   ```bash
   python scripts/generate-data.py
   python scripts/validate.py
   ```
   *Both commands must pass with exit code 0.*
9. **Submit Pull Request:** Open a PR using `.github/PULL_REQUEST_TEMPLATE/contribution-challenge-2026.md`. Ensure the PR references your issue (`Fixes #123`).
10. **Maintainer Review:** Maintainers will review your PR for code quality, architectural fit, test coverage, and documentation.
11. **Revise:** Address review feedback constructively and update your branch.
12. **Merge:** Upon maintainer approval, your PR is merged into `main`!

---

## AI-Assisted Development Policy

We explicitly welcome AI-assisted development using tools such as:
- **OpenAI Codex**
- **Claude Code**
- **Cursor / Roo Code**
- **Gemini CLI / Aider**
- **GitHub Copilot**
- **Windsurf / Cascade**

### Policy & Contributor Responsibilities
While AI tools are permitted, **the human contributor remains 100% accountable for all submitted code**.
- **Code Understanding:** You must thoroughly understand every line of code submitted.
- **Validation:** You must manually review, test, and verify AI-generated output.
- **No Fabricated APIs:** Do not submit PRs containing hallucinated API endpoints, fictitious npm packages, or non-existent configuration options.
- **No License Infringement:** Ensure AI output does not copy proprietary or incompatibly licensed code.
- **Transparency:** Declare AI usage in the PR template section provided.
- **Low-Quality AI Spam Rejected:** Mass-generated, unreviewed, or broken AI code will be closed immediately without review.

---

## Repository Integrity & Generation Rules

Career-Agents relies on interconnected database registries, search indexes, knowledge graph maps, and generated metadata.

### Strict Integrity Rules (per [AGENTS.md](../AGENTS.md))
- **Never Create Duplicate IDs:** Ensure all new agent or feature IDs are unique across `agent-registry.json`.
- **Never Leave Orphaned Entities:** When registering an agent, ensure it exists in both `agent-registry.json` and `divisions.json`.
- **Do Not Manually Edit Generated Data Files:** Do not write direct manual edits to:
  - `career-agents.json`
  - `search-index.json`
  - `knowledge-graph.json`
  - `agent-map.json`, `workflow-map.json`, `company-map.json`, `career-path-map.json`
  - `llms.txt`, `llms-full.txt`, `career-agents-index.json`
  - `README.md` (always edit `scripts/generate-data.py`'s template instead)
- **Required Validation Command:**
  ```bash
  python scripts/generate-data.py
  python scripts/validate.py
  ```

---

## Testing & Verification Requirements

Every Pull Request must include empirical testing verification:
1. **Automated Validation:** `python scripts/generate-data.py` and `python scripts/validate.py` must complete cleanly (status 0).
2. **Type & Lint Checks:** Where web or TypeScript code is touched (`apps/web` or `apps/chrome-extension`), `npm run type-check` and `npm run lint` must pass.
3. **Execution Evidence:** Include test execution logs, terminal output, or screenshots demonstrating that your change works in practice.

---

## Evaluation Matrix & Scoring Model

Contributions are evaluated holistically by project maintainers according to the following 100% model:

| Evaluation Criteria | Weight | Focus Areas |
|---|---|---|
| **Technical Quality & Maintainability** | **30%** | Clean architecture, robust error handling, adherence to project standards, zero lint/type errors. |
| **Real-World Impact** | **25%** | Problem significance, engineering utility, user benefit, system improvement. |
| **Problem Understanding** | **15%** | Accuracy of root cause diagnosis, clarity of proposed approach, avoidance of side effects. |
| **Testing & Reliability** | **15%** | Test coverage, edge-case handling, verification evidence, build status 0. |
| **Open-Source Collaboration** | **5%** | Responsiveness to maintainer review, clear PR descriptions, constructive communication. |
| **Documentation Clarity** | **5%** | Clear code comments, updated documentation files, accurate docstrings. |
| **Security & Responsible AI** | **5%** | Input validation, credential protection, safe AI prompts, responsible disclosure. |

*Note: PR count, lines of code, or commit quantity are NOT part of the evaluation.*

---

## Recognition Categories

Participants may be recognized across the following categories based on maintainer review:

1. 🏆 **Outstanding Open-Source Contributor:** Highest overall contribution quality and technical impact.
2. ⚙️ **Core Engineering Contributor:** Exceptional architecture, system, or API performance contribution.
3. 🤖 **AI Systems Contributor:** Significant agent enhancement, prompt engineering, or routing optimization.
4. ⚡ **MCP Engineering Contributor:** High-impact Model Context Protocol tool or infrastructure improvement.
5. 🐛 **Bug Hunter Award:** Best root-cause analysis and fix for a critical project issue.
6. 🛡️ **Reliability Champion:** Outstanding test suite expansion or edge-case reliability enhancement.
7. 🔐 **Security Contributor:** Exceptional security hardening or responsible vulnerability resolution.
8. 🎨 **Developer Experience Contributor:** High-impact CLI, tooling, or workflow productivity improvement.
9. ♿ **Web & Accessibility Contributor:** Exceptional frontend UX, layout, or screen-reader accessibility fix.
10. 📖 **Documentation Contributor:** Outstanding technical documentation, setup guide, or tutorial contribution.
11. 🌱 **Best First-Time Open-Source Contributor:** Exceptional contribution from a developer making their first open-source PR.

*Note: Recognition categories may be withheld if no eligible submission meets the required engineering standard.*

---

## Contributor Recognition & Certificates

Qualifying contributors whose Pull Requests pass maintainer review and are merged into Career-Agents will receive:
- **Public GitHub Committer Record:** Permanent author attribution on the official Career-Agents repository.
- **Verified Digital Contributor Certificate:** Issued by Career-Agents × CodeMyFYP recognizing open-source contributions.
- **Community Spotlight:** Recognition across the Career-Agents ecosystem and release notes.
- **Invitation to Core Contributor Network:** Potential invitation to join maintainer discussions and long-term project initiatives.

*Note: Registration or PR submission alone does not guarantee a certificate or award. Contributions must be merged or meet maintainer quality standards.*

---

## Submission Deadline & Timing Rules

- **Submission Window:** September 25, 2026 – October 15, 2026 at 11:59 PM IST.
- **Review Window:** Maintainer review may continue after October 15, 2026 for PRs opened before the deadline.
- **Ongoing Revisions:** As long as a qualifying PR was submitted before the deadline, contributors may push requested review fixes during the maintainer evaluation period.

---

## Responsible Security Disclosure Policy

Security is paramount for Career-Agents.
- **Do NOT open public issues for security vulnerabilities.**
- Follow [SECURITY.md](../SECURITY.md) and report security findings privately via [GitHub Security Advisories](https://github.com/karthikrshet/Career-Agents/security/advisories/new) or by emailing `security@career-os.dev`.
- Security contributions reported privately and resolved via security patches remain fully eligible for event recognition.

---

## Authorship, Git Co-Authorship & Code of Conduct

- **Authorship Integrity:** Submissions must represent your original work or properly attributed open-source contributions. Plagiarism or claiming uncredited work will result in immediate disqualification.
- **Git Co-Authorship:** Use standard Git `Co-authored-by:` trailers in commit messages when collaborating with teammates.
- **Code of Conduct:** All participants must adhere strictly to the [Contributor Covenant Code of Conduct](../CODE_OF_CONDUCT.md). Harassment, toxic language, or disrespectful communication will not be tolerated.

---

## Frequently Asked Questions (FAQ)

#### Q1: Is participation completely free?
**Yes.** The challenge is 100% free, online, and open to anyone globally.

#### Q2: Can I submit a separate hackathon app or standalone project?
**No.** This challenge focuses on contributing directly to the Career-Agents repository. All contributions must take the form of Pull Requests to `karthikrshet/Career-Agents`.

#### Q3: Can I use AI coding tools like Cursor, Claude Code, or Copilot?
**Yes.** AI coding tools are encouraged, provided you manually inspect, test, understand, and validate all generated code before submitting your PR.

#### Q4: What if my PR is opened before the deadline but merged after October 15?
As long as your Pull Request was submitted prior to October 15, 2026 at 11:59 PM IST, it remains eligible for challenge evaluation while maintainer review and minor revisions take place.

#### Q5: Will submitting 10 small PRs increase my chances of winning?
**No.** We evaluate technical quality, problem depth, maintainability, and real-world impact. One well-tested, high-impact fix is worth far more than multiple trivial PRs.

#### Q6: How do I get started as a first-time contributor?
Look for issues labeled [`good-first-issue`](https://github.com/karthikrshet/Career-Agents/labels/good-first-issue) or [`help-wanted`](https://github.com/karthikrshet/Career-Agents/labels/help-wanted), or browse documentation gaps, unit test needs, and CLI error formatting improvements.

---

## Maintainer Authority & Licensing

- **Maintainer Judgment:** Project maintainers reserve final authority regarding code acceptance, code reviews, PR approval, and category recognition.
- **Licensing:** All contributions to Career-Agents are submitted under the repository's existing [MIT License](../LICENSE).

---

## Quick Links & Resources

- 📝 **Registration:** [https://luma.com/3df31stw](https://luma.com/3df31stw)
- 💻 **GitHub Repository:** [https://github.com/karthikrshet/Career-Agents](https://github.com/karthikrshet/Career-Agents)
- 📖 **Contributing Guide:** [CONTRIBUTING.md](../CONTRIBUTING.md)
- 🤖 **AI Contributor Guide:** [AGENTS.md](../AGENTS.md)
- 🛡️ **Security Policy:** [SECURITY.md](../SECURITY.md)
- 💬 **GitHub Discussions:** [https://github.com/karthikrshet/Career-Agents/discussions](https://github.com/karthikrshet/Career-Agents/discussions)
