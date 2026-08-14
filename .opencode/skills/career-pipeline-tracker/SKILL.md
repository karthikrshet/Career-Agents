---
name: career-pipeline-tracker
description: Manage live application pipeline tracker, statuses, and updates
license: MIT
---

# career-pipeline-tracker

Tracks job applications through a complete lifecycle state machine:
`bookmarked` → `applied` → `screening` → `interviewing` → `offer` → `accepted` / `rejected` / `withdrawn`

Persists in dual Markdown table (`pipeline-tracker.md`) and JSON format.

## Usage

```bash
# Add new application
career-agents pipeline add <company> <role> <url>

# Update status
career-agents pipeline status <company> <status> [notes]

# List active applications
career-agents pipeline list
```

