# FAANG Preparation Example: Google SWE Interview

This guide outlines a structured timeline to prepare for Google Software Engineer loops.

---

## 📅 The 3-Stage Prep Loop

### Stage 1: Assessment & Gap Sourcing
Run the profile recommender to identify matching coaches:
```bash
node scripts/cli.js recommend
# Skills: Java, Spring, MySQL
# Experience: mid
# Company: google
# Role: software-engineer
```
Target agents: `google-interview-coach`, `system-design-coach`.

### Stage 2: Structural Algorithms Practice
Review Google-specific expectations and required skills:
```bash
node scripts/cli.js company google
```
Focus areas: graph algorithms, dynamic programming, space-time trade-offs.

### Stage 3: Live Mock Simulation
Execute the mock interviewer loop to practice communicating problem decomposition out loud:
```bash
node scripts/cli.js run mock-interviewer
```
Review feedback templates, complexity metrics, and performance scorecards.
