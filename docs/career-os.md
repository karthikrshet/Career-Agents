# Career OS Dashboard Specification

This document details the functional specifications for the **Career OS Dashboard**, designed to help users track metrics and orchestrate advisor workflows during their job search or developer growth journeys.

---

## 📊 Core Modules

The dashboard is structured around 4 distinct operational trackers that capture progress across career milestones:

### 1. Resume Tracker
- **Integrated Agent:** `ats-resume-reviewer`, `resume-keyword-optimizer`.
- **Functionality:** Users upload draft resumes (PDF or markdown). The panel calculates an ATS readiness score, highlights missing keyword lists, and flags formatting anomalies.

### 2. Application Tracker
- **Integrated Agent:** `internship-application-strategist`, `job-search-strategist`.
- **Functionality:** Kanban board tracking applications (Sourced, Applied, Interview, Offer, Rejected). Tracks dates, job descriptions, and follow-up deadlines.

### 3. Interview Tracker
- **Integrated Agent:** `mock-interviewer`, `system-design-coach`, `behavioral-interview-specialist`.
- **Functionality:** Logs scheduled interviews and displays relevant preparation materials. Integrates structured simulators to run behavioral and technical mock interviews.

### 4. Networking Tracker
- **Integrated Agent:** `linkedin-outreach-specialist`, `referral-strategy-coach`.
- **Functionality:** Logs connection targets, cold email status (Drafted, Sent, Replied), and referral pipeline mappings.

---

## 🛠️ Dashboard Features

- **Skill Roadmaps:** Dynamic learning paths linking specific engineering or AI divisions to structural timelines (e.g. "DevOps Mastery in 8 Weeks").
- **Weekly Goals:** System-generated micro-tasks (e.g. "Draft 3 cold outreach messages using Cold Outreach Specialist", "Perform one Mock Interview loop").
- **Agent Recommendations:** Automatically suggest specialist agents depending on active Application or Interview stages. (For instance, if an application enters "Interview" state, highlight the `Google Interview Coach` or `Technical Interview Coach`).
