---
name: career-pipeline-match
description: Evaluate candidate readiness against raw job descriptions using canonical Blocks A-G rubric
license: MIT
---

# career-pipeline-match

Evaluates candidate fit against job descriptions using the canonical scoring engine in `services/readiness.js` and formats a structured evaluation report.

## Report Structure
- **Block A**: Role & Company Summary (Verdict)
- **Block B**: Candidate Match & Evidence Analysis (Verified Strengths vs Skill Gaps)
- **Block C**: Level & Seniority Strategy
- **Block D**: Market Positioning & Compensation
- **Block E**: Personalization & Resume Tailoring (Action + Tech + Verified Metric)
- **Block F**: STAR+R Interview Scenarios (Situation, Task, Action, Result, Reflection)
- **Block G**: Posting Legitimacy & Work Authorization Notice

## Usage

```bash
career-agents pipeline match <jdFilePathOrText> <company> <role>

# Example:
career-agents pipeline match "Python, Kubernetes, PyTorch" Google "AI/ML Infrastructure Engineer"
```

