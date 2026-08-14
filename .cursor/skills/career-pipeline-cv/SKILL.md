---
name: career-pipeline-cv
description: Compile ATS single-page HTML and LaTeX resumes
license: MIT
---

# career-pipeline-cv

Compile ATS single-page HTML and LaTeX resumes

## Usage

`ash
# Direct binary execution
career-agents pipeline cv [profile.json] [--latex|--html]

# Workspace script execution (fallback)
node ./scripts/cli.js pipeline cv [profile.json] [--latex|--html]
`
