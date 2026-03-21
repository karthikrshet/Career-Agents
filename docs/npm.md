# NPM Global Package Distribution Guide

This guide details how to install, verify, and run the `career-agents` CLI utility globally on Windows, macOS, and Linux.

---

## 📥 Installation

Install the package globally from NPM:
```bash
npm install -g career-agents
```

### Verification Checks

After installation, verify that the binary is linked correctly and is available in your shell:
```bash
career-agents --help
```

---

## 🛠️ CLI Commands Reference

### 1. `career-agents --help`
Prints the help menu listing all available subcommands and general usage guidelines.

### 2. `career-agents doctor`
Runs diagnostic checks verifying registry health (checking that `career-os.json`, `agent-registry.json`, and directories are valid).

### 3. `career-agents search <query>`
Searches the catalog index for matching agents, divisions, workflows, and bundles.
```bash
career-agents search resume
```

### 4. `career-agents recommend`
Launches an interactive prompt checklist builder requesting your primary skills, experience level, and target role to generate matching recommendation summaries.

### 5. `career-agents assess`
Starts the Career OS compliance scoring questionnaire to evaluate your roadmap, resume structure, interview readiness, outreach pipelines, and proof-of-work status.

### 6. `career-agents company [company-id]`
Inspects tier-1 company preparation tracks.
```bash
career-agents company google
```

### 7. `career-agents path [path-id]`
Views mapped career roadmap details, competencies, and recommended agents.
```bash
career-agents path software-engineer
```

### 8. `career-agents workflows`
Lists all repeatable workflows available within the Career Operating System.

### 9. `career-agents resume <command>`
Launches the ATS Resume Studio suite.
```bash
career-agents resume templates
career-agents resume score path/to/resume.json
```

---

## 🪵 Versioning Policy

We strictly adhere to Semantic Versioning (SemVer) standards:
- **PATCH** version updates represent prompt wording revisions, bug fixes, or catalog updates.
- **MINOR** version updates introduce new career paths, templates, company tracks, or CLI subcommands.
- **MAJOR** version updates signify breaking registry structure changes or directory re-allocations.
