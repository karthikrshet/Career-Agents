# Interview Lab Guide

This document describes the interactive mock interview loop processes, STAR assessment rules, and integrated coding consoles.

---

## Overview

The Interview Lab runs terminal and visual mock simulations. It tests behavioral responses against STAR rubrics and presents algorithmic code environments.

---

## Interactive Loop Flow

```
Configure (Company, Mode, Round)
             ↓
     Prompt Question
             ↓
   Record User Response (Text / Code)
             ↓
  ---------------------------------
  |                               |
Next Question?             Complete Session
  |                               |
  ---------------------------------
             ↓
  Compute Scorecard & STAR Feedback
```

---

## Evaluation Parameters

### 1. STAR Behavioral Audit
Checks if the candidate's answers follow the STAR framework:
- **Situation**: Contextual background of the problem.
- **Task**: The candidate's specific ownership and objective.
- **Action**: Detailed technical execution.
- **Result**: Quantifiable outcomes and metrics.

### 2. Algorithmic Coding Audit
- **Complexity Estimation**: Validates if the candidate explains Big-O runtime and memory complexity before coding.
- **Idempotency & Edge cases**: Audits handling of concurrent inputs, rate limits, and failure states.

### 3. Scorecard
Generates a numeric grade and lists critical improvements.
