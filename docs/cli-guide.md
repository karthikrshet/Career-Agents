# Career OS CLI Guide

This guide details usage instructions for the command-line interface tools available in Career OS.

## Installation

Ensure you have Node.js (version 18 or above) installed. You can install the package globally:

```bash
npm install -g career-agents
```

Verify your installation by diagnosing system health:

```bash
career-agents doctor
```

---

## Commands Reference

### 📊 Ecosystem Dashboard
Shows scores for your resume, GitHub profile, LinkedIn alignment, and mock interview preparations.
```bash
career-agents dashboard
```

### 🧾 Resume Studio
Analyzes, scores, and audits your resume against target company expectations.
```bash
# General review card
career-agents review resume.pdf

# ATS compatibility score
career-agents score resume.pdf

# Yield optimization suggestions
career-agents improve resume.pdf

# Checklist of formatting blocking structures
career-agents ats resume.pdf
```

### 🖥️ GitHub Portfolio Analyzer
Audits public repository counts, star traction, language diversity, and readme quality.
```bash
career-agents github <username>
```

### 🤝 LinkedIn Auditor
Scans tagline headers and summary narratives for keyword hooks.
```bash
career-agents linkedin profile_copy.txt
```

### 🗣️ Mock Interview Coach
Conducts interactive QA mock sessions. Evaluates responses for behavioral, technical, coding, or system design roles.
```bash
career-agents mock google coding
career-agents mock stripe technical
```

### 💼 Job Match Engine
Matches resume skills against active company vacancy tracks.
```bash
career-agents jobs resume.pdf
```

### 🎓 Roadmaps Generator
Generates custom 30-60-90 Day career progression roadmaps.
```bash
career-agents roadmap stripe
```

### 🛠️ Project skeletons generator
Creates starter repository architectures for frontend, backend, or AI engineering profiles.
```bash
career-agents project ai-engineer
```
