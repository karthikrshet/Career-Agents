# Career-Agents Global Installation Verification Report

This report documents the verification results of local packaging and global system binary installation checkouts.

---

## 📋 Installation Status

- **Command executed**: `npm pack` and `npm install -g .`
- **Link status**: Verified successful binary link inside the user path.
- **Node versions compatibility**: Verified under Node.js >= 18 environments.
- **Operating System tested**: Windows 11 (PowerShell terminal).

---

## 🚀 Execution Audits

All commands were run globally using the `career-agents` entrypoint:

### 1. Doctor (Diagnostics)
```
$ career-agents doctor
=== Career OS Diagnostic Check (Doctor) ===
[✓ OK] registries parsed.
[✓ OK] directories found.
Everything is green! Your Career Operating System is healthy.
```

### 2. List Divisions
Lists all divisions correctly.

### 3. Resume Templates
Displays 20 layouts, scores, targets, and file slugs correctly.

### 4. Interactive redirection checks
Piping inputs for `company google` and `path software-engineer` returns appropriate prep lists and terminates cleanly.

### 5. Workflows
Lists all 10 structured workflows correctly.
