# Career OS CLI Reference

This document details the command catalog, parameter options, and syntax examples for the Career OS Command Line Interface.

---

## Installation

Install the package globally to add the `career-agents` executable to your environment path:

```bash
npm install -g career-agents
```

---

## Global Options

- `--help`, `-h`: Show help documentation for any command or subcommand.
- `--version`, `-v`: Display current CLI package version.

---

## Command Catalog

### 1. General Diagnostic and Info

#### list
Lists all functional divisions, agent coaches, and workflow blueprints available in the registry.
```bash
career-agents list
```

#### doctor
Checks system environment parameters, Node.js runtime, API key variables, and folder structures.
```bash
career-agents doctor
```

#### recommend
Provides custom agent suggestions based on user-supplied skills, target role, and experience level.
```bash
career-agents recommend --skills "react,typescript" --experience "senior" --company "stripe"
```

---

### 2. Resume Studio

#### review
Audits resume formatting, contact completeness, layout warnings, and computes weak bullet counts.
```bash
career-agents review resume.pdf
```

#### score
Computes overall ATS compatibility scores from parsed details.
```bash
career-agents score resume.pdf
```

#### improve
Extracts bullet points failing metrics rules and generates suggested rewrites using action verbs.
```bash
career-agents improve resume.pdf
```

#### ats
Validates formatting indicators (such as multi-column layouts, graphics, or text boxes) that block parsers.
```bash
career-agents ats resume.pdf
```

#### match
Calculates profile compatibility against target job descriptions.
```bash
career-agents jobs resume.pdf job-description.txt
```

#### faang
Audits resume keyword signaling against targeted Tier-1 company rubrics.
```bash
career-agents resume faang resume.json google
```

---

### 3. Portfolio & Profile Analyzers

#### github
Grades repository write-ups, language coverage, and README discoverability metrics.
```bash
career-agents github karthikrshet
```

#### linkedin
Critiques headlines, tagline signaling, and narrative copy.
```bash
career-agents linkedin profile-copy.txt
```

---

### 4. Preparation & Roadmaps

#### mock
Launches interactive terminal interview drills structured around STAR behavioral techniques.
```bash
career-agents mock stripe technical
```

#### roadmap
Compiles custom 30-60-90 day milestone readiness checklists for target companies.
```bash
career-agents roadmap google
```

#### project
Generates boilerplates and skeleton configurations for technical projects.
```bash
career-agents project backend
```

---

### 5. Integration

#### mcp
Starts the Model Context Protocol stdio server to connect with IDE tools.
```bash
career-agents mcp
```
