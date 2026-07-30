---
name: career-pipeline
description: Career-Agents Job Search & Application Pipeline Router. Use to scan ATS boards, evaluate job matches, generate ATS CVs, draft cover letters, track applications, and prepare for interviews.
license: MIT
---

# Career-Agents Pipeline Router

Multi-CLI job application and search command center for Career-Agents.

## Usage

```bash
# View active application pipeline
career-agents pipeline tracker

# Add new application entry
career-agents pipeline add <company> <role> [job-url]

# Update application status
career-agents pipeline status <company> <new-status> [notes]

# Scan ATS job board
career-agents pipeline scan <company-token> [greenhouse|lever|ashby]

# Evaluate candidate readiness against JD
career-agents pipeline match <jd-file-or-text> [company] [role]

# Generate tailored cover letter
career-agents pipeline cover <company> <role>

# View pipeline conversion funnel statistics
career-agents pipeline stats
```

## Modes Reference

- `pipeline`: Full end-to-end evaluation & document generation.
- `tracker`: Application pipeline inspection and follow-up tracking.
- `scan`: ATS board discovery.
- `apply`: Application question answers.
- `cover`: High-impact cover letters.
- `pdf`: ATS CV formatting.
- `interview`: STAR interview preparation.
- `outreach`: Recruiter messaging.
- `upskill`: Skill gap remediation roadmap.
