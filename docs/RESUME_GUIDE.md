# Resume Studio Pro Guide

This guide details the parsing engines, score calculation rules, and formatting constraints of the Resume Studio module.

---

## Overview

Resume Studio parses and audits resumes to ensure they comply with Applicant Tracking System (ATS) guidelines and industry expectations. It checks layouts, scans action verbs, identifies missing keywords, and evaluates formatting constraints.

---

## Technical Architecture

```
User Resume File (PDF/DOCX/TXT)
              ↓
      file-parser.js (Extraction)
              ↓
      scorer.js & studio.js (Auditing)
              ↓
  -----------------------------------------
  |                   |                   |
Weak Bullets     ATS Warnings     Keywords Gaps
  |                   |                   |
  -----------------------------------------
              ↓
    Dynamic JSON / HTML Report
```

---

## Evaluation Engine Rules

### 1. File Parsers
Normalizes inputs across multiple extensions:
- **PDF**: Uses pdf-parse to extract text streams and parse section headers.
- **DOCX**: Extracts textual content and bullet listings from XML tables.
- **TXT/Markdown**: Directly reads file text strings.

### 2. Formatting Audits (ATS Constraints)
Audits files for formatting elements that block standard parsers:
- **Multi-column Layouts**: Warns if double-column tables or float blocks are detected, as they disrupt reading flow sequence.
- **Graphics & Icons**: Identifies visual indicators, profile photos, and charts.
- **Text Boxes**: Triggers warnings if floating containers hide text properties.

### 3. Weak Bullet Audits
Scans accomplishments to verify they structure impact quantitatively (STAR method).
- **Weak verb detection**: Catches passive indicators (e.g. *led*, *managed*, *responsible for*, *worked on*).
- **Quantification**: Identifies bullets that lack metrics ($, %, counts).
- **Rewrites**: Generates alternative sentences starting with action verbs (e.g. *shipped*, *architected*, *orchestrated*).

### 4. Keyword Signaling Gaps
Compares skills sections against industry reference templates (e.g. API design, caching, system design) to compile missing keyword summaries.
