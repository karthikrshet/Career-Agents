# Career OS Dashboard Guide

This document describes the design, features, and profile state synchronization of the Career OS Dashboard module.

---

## Overview

The Core Dashboard is the central control panel of the Career Operating System. It aggregates metrics from Resume Studio, GitHub Analyzer, LinkedIn Optimizer, and Interview Lab into a single, cohesive Readiness Index.

---

## State Synchronization Model

Rather than running as independent, static components, all modules write their scores and evaluation reports to a shared profile state.

```
Resume Studio Score
        |
GitHub Wrapped Grade   -->  Career Readiness Engine  -->  Cumulative Dashboard
        |                                                 Readiness Index (%)
LinkedIn Hook Rating
        |
Interview Lab Score
```

### Metrics Formula
The cumulative Readiness Index is calculated as the average of the active specialty sub-scores:

```
Readiness Index = (Resume Score + GitHub Score + LinkedIn Score + Interview Score) / 4
```

Whenever a user executes a resume check, audits their repositories, critiques taglines, or completes an interactive mock interview, the respective score is updated, instantly recalculating and rendering the new cumulative index.

---

## Features

### 1. Readiness Index Gauge
Renders a visual indicator tracking your overall preparation readiness. Scoring brackets:
- **85% - 100%**: High Signaling (Release/Onsite Ready)
- **65% - 84%**: Moderate (Target audits recommended)
- **0% - 64%**: Needs Development (Initial staging phase)

### 2. Active Vacancies Funnel
Synchronizes with the Job Tracker module to display application numbers across different pipeline stages:
- Wishlist
- Online Assessment (OA) Pending
- Interview Scheduled
- Offers
- Rejected

### 3. Weekly Targets Checklist
Lists diagnostic checklists compiled from reports. Completing checks (e.g. running a resume review or auditing repository readmes) checks off goals.

### 4. Target Company Tracks
Displays preparation completion percentage for pre-mapped company tracks (Google and Stripe), calculating how many prep modules (DSA, System Design, Behavioral) have been completed.
