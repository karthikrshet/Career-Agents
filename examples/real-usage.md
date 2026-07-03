# Real Usage Example: Daily CLI Commands

This guide shows how a developer uses the Career CLI daily to optimize their profiles and run prep loops.

---

## 💻 Step 1: Run Workspace Diagnostics
Always ensure your local metadata registries are correct:
```bash
node scripts/cli.js diagnose
```

## 📄 Step 2: Run local Resume Reviewer
Start a local sandbox execution loop to audit a resume:
```bash
node scripts/cli.js run ats-resume-reviewer
```
- Input your resume summary when prompted.
- The simulator outputs custom action items.

## 🔌 Step 3: Inject Prompt Rules into Cursor rules
Deploy the same resume reviewer directly into your VS Code / Cursor IDE environment:
```bash
node scripts/cli.js use ats-resume-reviewer cursor
```
This writes the rules to `.cursorrules` in your project root. Ask the editor to review files: `@resume.md check formatting rules`.

## 📦 Step 4: Export to YAML Prompt Pack
Generate a portable YAML prompt to load into an offline LLM or assistant:
```bash
node scripts/cli.js run ats-resume-reviewer --export yaml
```
Find the output file inside `exports/ats-resume-reviewer.yaml`.
