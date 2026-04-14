# Career OS — Roadmap

This document outlines the planned development trajectory for Career OS.

## Current: v3.0.0 ✅
- **Intelligent Agent Orchestration Engine**: Added `packages/agents` (router, planner, executor, merger, context, cache) for multi-agent context planning, intent routing, and advice merging.
- **Career Memory**: Added `packages/memory` cache interface to persist achievements, milestones, and metrics.
- **Workflow Engine**: Added stateful `packages/core/workflow-engine.js` tracker.
- **Company Intelligence**: Added structured JSON company profiles for `anthropic` and `nvidia` inside `companies/`.
- **OpenAPI / Swagger Reference**: Added an interactive API documentation page at `/api/docs` mapping requests/responses.

## v3.1.0 — Real-Time Collaboration (Q3 2026)
- [ ] Real-time collaborative mock interview sessions (WebRTC)
- [ ] Shared interview prep rooms with peers
- [ ] Live code collaboration for technical interviews
- [ ] Video recording and playback for mock interviews

## v3.2.0 — Cloud Sync & Integrations (Q3 2026)
- [ ] OAuth sync with Google Drive (resume import/export)
- [ ] OAuth sync with Dropbox
- [ ] LinkedIn profile import via OAuth
- [ ] GitHub OAuth for automatic profile linking
- [ ] Notion integration for career notes export

## v2.8.0 — Offline AI & Edge (Q4 2026)
- [ ] WebGPU-powered local inference in-browser
- [ ] Offline resume analysis via WebAssembly
- [ ] Edge runtime for API routes (lower latency)
- [ ] Progressive enhancement for low-bandwidth usage

## v4.0.0 — Team Workspaces (2027)
- [ ] Multi-user team workspaces
- [ ] Shared agent library per organization
- [ ] Team interview question banks
- [ ] Referral tracking and hiring manager views
- [ ] Billing and subscription management (Stripe)
- [ ] White-label deployment option for bootcamps/universities

## v4.1.0 — Enterprise (2027)
- [ ] SSO (SAML, Okta, Auth0)
- [ ] Admin dashboard with usage analytics
- [ ] Custom agent creation UI (no-code)
- [ ] Private MCP server deployment
- [ ] GDPR data export/deletion tools
- [ ] SOC 2 Type II compliance

---

## Long-Term Vision

Career OS aims to become the default career copilot for engineers — a unified workspace that understands your entire professional trajectory and proactively coaches you toward your goals, whether you're a bootcamp grad, a 10x engineer targeting FAANG, or a tech lead navigating executive transitions.

---

> Have a feature request? Open a [GitHub Discussion](https://github.com/karthikrshet/Career-Agents/discussions).
