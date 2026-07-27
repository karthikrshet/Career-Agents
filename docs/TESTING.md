# Career Agents — Testing & Verification Guide

This guide outlines the validation pipelines, TypeScript safety checks, unit tests, and CLI validation scripts used to maintain repository health in Career Agents.

---

## Testing Subsystems

Career Agents organizes testing into three areas:

1. **TypeScript Type Safety Check:** Resolves typescript compilation warnings.
2. **ESLint Static Analysis:** Verifies coding styles and formatting.
3. **Agent Registry Validation:** Validates agent prompt structures and metadata schemas.

---

## Running Verification Pipelines

### 1. TypeScript & Lint Checks

Run these commands inside `apps/web/` to run static linting and type checks:

```bash
# Verify all types resolve correctly
npm run type-check

# Run static linting rules
npm run lint
```

### 2. Registry Validation (`validate.py`)

Run this Python script at the repository root to validate the integrity of agent prompt files, schemas, and links:

```bash
python scripts/validate.py
```

The validation pipeline performs:
- **File Length Check:** Enforces that every agent prompt file is at least 300 words.
- **Section Checking:** Ensures that all required headers (`## Role`, `## Approach`, `## Key Capabilities`, `## When to Use This Agent`, `## Output Format`) exist.
- **Frontmatter Verification:** Validates YAML schemas against the `agent-registry.json` list (e.g. check color formats, difficulty values, and list array structures).
- **Link Checking:** Scans markdown links to ensure no internal references are broken.
- **Orphan Checking:** Guarantees that every registered agent resides in both `agent-registry.json` and `divisions.json`.

---

## Automated CI Pipeline

The GitHub actions script (`.github/workflows/ci.yml`) runs on every pull request and push to the `main` branch:

```yaml
name: CI Validation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        
    - name: Run Python Validator
      run: python scripts/validate.py
      
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: |
        cd apps/web
        npm ci
        
    - name: Type check
      run: |
        cd apps/web
        npm run type-check
        
    - name: Lint check
      run: |
        cd apps/web
        npm run lint
```

---

## Debugging and Pre-commit Hooks

To prevent pushing broken changes, you can install a local git pre-push hook:

Create `.git/hooks/pre-push`:
```bash
#!/bin/sh
python scripts/validate.py && cd apps/web && npm run type-check
```
Make the hook executable:
```bash
chmod +x .git/hooks/pre-push
```
Now, any `git push` command will automatically trigger validation checks and cancel the push if errors are encountered.
