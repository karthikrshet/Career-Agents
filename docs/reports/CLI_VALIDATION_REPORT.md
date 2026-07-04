# Career-Agents CLI Validation Report

This report summarizes the validation results of all primary global commands for the `career-agents` CLI tool.

---

## 📋 Command Verification Matrix

| CLI Command | Mode | Status | Verification Summary |
|---|---|---|---|
| `doctor` | Non-Interactive | ✅ PASS | Verified core files parsing and registry directories. |
| `list` | Non-Interactive | ✅ PASS | Displayed all 19 career divisions and agent counts. |
| `search resume` | Non-Interactive | ✅ PASS | Discovered 14 matching agents, divisions, and bundles. |
| `company google` | Redirected | ✅ PASS | Displayed process, skills, workflow, and agents. |
| `path ai-engineer` | Redirected | ✅ PASS | Displayed competencies, divisions, and agents list. |
| `resume templates` | Non-Interactive | ✅ PASS | Displayed ATS resume templates slugs and score targets. |
| `recommend` | Automated Array | ✅ PASS | Accepted skills, experience, and role, mapping 3 agents. |
| `assess` | Automated Array | ✅ PASS | Processed 5 metrics questions, calculating score card. |

---

## 🚀 Execution Audits

All commands were validated locally from the repository root:

- **Doctor Routine**:
  ```bash
  === Career OS Diagnostic Check (Doctor) ===
  [✓ OK] career-os.json parsed.
  [✓ OK] agent-registry.json parsed...
  [✓ PASS] validate.py checks pass.
  ```

- **Profile recommendation**:
  ```bash
  === Career OS Recommendation Report ===
  Inputs -> Skills: [react, node.js], Experience: mid, Target Co: google
  🤖 Recommended Agents: google-interview-coach, google-swe-coach, ats-resume-reviewer
  ```
