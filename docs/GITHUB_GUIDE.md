# GitHub Portfolio Analyzer Guide

This document describes the metrics, audits, and scorecard systems used to grade developer portfolios.

---

## Overview

The GitHub Portfolio Analyzer connects to public profiles to evaluate code contribution history, readme documentation quality, project traction, and architecture descriptions.

---

## Metrics Scorecard

The system calculates a cumulative **Portfolio Score** based on four indicators:

| Indicator | Metric Measured | Score Weight |
| :--- | :--- | :---: |
| **Traction Stars** | Total star counts across public repositories. | 30% |
| **Language Coverage**| Diversity and modern stack usage. | 20% |
| **README Quality** | Readme headings completeness and installation instructions. | 30% |
| **Architecture Detail**| Architecture descriptions and Mermaid diagrams. | 20% |

---

## Auditing Guidelines

### 1. README Validation
Scans repository README files for structural components:
- **Prerequisites & Setup**: Verifies presence of setup command blocks.
- **Contribution Policy**: Checks for contributing rules.
- **Badges**: Audits presence of build status or npm version indicators.

### 2. Project Quality
- Inspects pinned repositories to evaluate repository description completeness.
- Analyzes repository forks vs original code to verify custom contributions.

### 3. Recommendations
Suggests specific improvements, such as adding architectural diagrams, conventional commit specifications, or automated testing steps.
