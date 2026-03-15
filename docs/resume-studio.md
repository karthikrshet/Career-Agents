# ATS Resume Studio

Welcome to the **ATS Resume Studio** — a comprehensive suite of developer tools built inside the Career-Agents workspace to help candidates create, score, optimize, and match their resumes for ATS parsing filters and FAANG hiring bars.

---

## ⚡ Installation & Quick Start

Ensure you have Node.js installed in your local environment, clone the repository, install dependencies, and link the binary:
```bash
npm install
npm link
```
Verify the installation by running the resume help command:
```bash
career-agents resume help
```

---

## 💻 CLI Commands

### 1. List Templates (`career-agents resume templates`)
Inspect the available **20 ATS-optimized templates** designed for various experience levels and specialties:
```bash
career-agents resume templates
```

### 2. Build Resume (`career-agents resume build`)
Launch the interactive CLI wizard questionnaire to compile a standard Markdown, TXT, and JSON resume.
- Optionally supply a starting template structure using the `--template` flag:
```bash
career-agents resume build --template senior-swe
```
Outputs are compiled to the `exports/resumes/` folder.

### 3. Score Resume (`career-agents resume score`)
Audit your resume JSON file against standard ATS compatibility metrics:
```bash
career-agents resume score exports/resumes/jane-doe.json
```
Computes subscores for:
*   Layout & Formatting Completeness (sections presence)
*   Keywords & Technical Skills Density
*   Accomplishments Detail & Depth
*   Impact Metrics & Action Verbs Ratio

### 4. Job Match Analysis (`career-agents resume match`)
Assess how closely your resume aligns with a target job description:
```bash
career-agents resume match exports/resumes/jane-doe.json "Looking for a React and Next.js developer with Node.js experience."
```
Outputs match ratio, highlights strengths/gaps, and recommends specialized Career Paths, Workflows, or AI Agents to bridge missing skills.

### 5. FAANG Optimizer (`career-agents resume faang`)
Audit your resume against company-specific rubrics for top-tier tech:
```bash
career-agents resume faang exports/resumes/jane-doe.json google
```
Supported Company IDs: `google`, `meta`, `amazon`, `microsoft`, `openai`, `stripe`, `atlassian`, `databricks`, `netflix`, `uber`.

---

## 📈 ATS Resume Best Practices

1. **Keep Formatting Clean:** Use standard section headers (`Professional Summary`, `Work Experience`, `Education`, `Technical Skills`). Do not use fancy icons, columns, or tables which can confuse ATS parsers.
2. **Quantify Achievements:** Ensure at least 40% of your experience bullets contain quantifiable metric achievements (e.g. `improved system latency by 20%`, `reduced customer tickets by 150/mo`). Use the STAR or Google X-Y-Z formula.
3. **Keyword Density:** Align your technical skills section directly with target job descriptions. Do not dump irrelevant keywords, but make sure key terms match exactly.

---

## 🏢 FAANG Rubric Guidelines

*   **Google:** Emphasize complexity analysis, high-availability, scalability engineering, and algorithmic correctness.
*   **Meta:** Emphasize moving fast, end-to-end product execution, performance tuning, and high user scale metrics.
*   **Amazon:** Emphasize extreme ownership, Bias for Action, customer obsession, and leadership metrics.
*   **OpenAI:** Highlight vector databases, model inference efficiency, fine-tuning structures, and safety layers.
