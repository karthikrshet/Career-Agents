# Career Agents — API Reference

Complete reference for all Career Agents API routes.

> **Base URL (development):** `http://localhost:3000/api`  
> **Authentication:** Most routes accept an AI provider config in the request body. No auth token required for API routes in guest mode.

---

## Endpoints Overview

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/copilot` | Career Copilot streaming chat |
| `POST` | `/api/interview` | Generate interview questions or evaluate answers |
| `POST` | `/api/resume/analyze` | Analyze resume text (ATS scoring) |
| `POST` | `/api/github/analyze` | Analyze a GitHub profile |
| `POST` | `/api/linkedin/analyze` | Optimize a LinkedIn profile |
| `POST` | `/api/reports/generate` | Generate career report (HTML/MD/PDF/JSON) |
| `POST` | `/api/parse-file` | Parse uploaded resume file (PDF/DOCX/TXT/MD/RTF) |
| `POST` | `/api/parse-file/url` | Parse resume from a URL |
| `POST` | `/api/providers/test` | Test AI provider connectivity |
| `GET` | `/api/profile` | Get current user profile |

---

## POST /api/copilot

Streams AI responses using Server-Sent Events (SSE). Automatically routes to the most relevant agents from the registry and injects career context.

### Request Body

```json
{
  "messages": [
    { "role": "user", "content": "Help me optimize my resume for a Google SWE role" }
  ],
  "config": {
    "provider": "groq",
    "model": "llama3-70b-8192",
    "apiKey": "gsk_...",
    "temperature": 0.7,
    "maxTokens": 4096,
    "streaming": true
  },
  "context": {
    "profile": {
      "name": "Jane Smith",
      "targetRole": "Software Engineer",
      "targetCompany": "Google"
    },
    "metrics": {
      "careerScore": 72,
      "resumeScore": 68,
      "githubScore": 75,
      "linkedinScore": 60,
      "interviewScore": 80
    },
    "resumeAnalysis": { "atsScore": 68, "weakBullets": [], "missingKeywords": [] },
    "GitHubAnalysis": { "publicRepos": 12, "totalStars": 45, "readmeGrade": "Good" },
    "linkedinAnalysis": { "headlineAnalysis": { "current": "Software Engineer" } },
    "jobApplications": [],
    "enabledPlugins": { "star-coach": true }
  }
}
```

### Response

Streams `text/event-stream` (SSE format):

```
data: {"choices":[{"delta":{"content":"Let me help you..."}}]}

data: {"choices":[{"delta":{"content":" optimize your resume"}}]}

data: [DONE]
```

### Error Response

If no API key is configured, returns HTTP 200 with `success: false`:

```json
{
  "success": false,
  "provider": "groq",
  "error": "API key not configured"
}
```

### Notes
- `context` is optional — omit for a basic chat without career data
- Agent routing happens automatically based on the last user message
- Plugin context is injected when `enabledPlugins` contains enabled plugin IDs
- Use `AbortController` to cancel streaming

---

## POST /api/interview

Generates interview questions or evaluates answers using AI.

### Action: `generate` — Generate Questions

**Request Body:**
```json
{
  "action": "generate",
  "company": "Google",
  "role": "Software Engineer",
  "mode": "behavioral",
  "difficulty": "Hard",
  "aiConfig": {
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "apiKey": "AIza..."
  }
}
```

**`mode` values:** `behavioral` | `technical` | `system_design` | `hr`  
**`difficulty` values:** `Easy` | `Medium` | `Hard`

**Success Response:**
```json
{
  "questions": [
    {
      "id": "q1",
      "text": "Tell me about a time you demonstrated ownership at Google.",
      "type": "behavioral",
      "followUp": "What was the outcome and what did you learn?"
    }
  ]
}
```

**Fallback:** If no API key is configured, returns 5 curated sample questions — the UI is fully functional without an AI key.

---

### Action: `evaluate` — Evaluate Answers (STAR Scoring)

**Request Body:**
```json
{
  "action": "evaluate",
  "company": "Google",
  "mode": "behavioral",
  "responses": [
    {
      "question": "Tell me about a time you owned a critical project.",
      "answer": "In my previous role, I led the migration of our monolithic API..."
    }
  ],
  "aiConfig": {
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "apiKey": "AIza..."
  }
}
```

**Success Response:**
```json
{
  "scores": {
    "situation": 8,
    "task": 7,
    "action": 9,
    "result": 8,
    "ownership": 9,
    "leadership": 7,
    "communication": 8,
    "technicalDepth": 9,
    "problemSolving": 8,
    "confidence": 8,
    "overall": 81
  },
  "feedback": "Strong technical depth and clear ownership demonstrated...",
  "strengths": ["Clear situation setup", "Quantified results"],
  "improvements": ["Add more specifics on team size", "Include timeline"]
}
```

**Error Response (AI unavailable):**
```json
{
  "success": false,
  "error": "Unable to evaluate because AI provider is unavailable.",
  "actions": ["retry", "switch_provider", "save_draft"]
}
```

---

## POST /api/resume/analyze

Analyzes resume text with the ATS scoring engine.

### Request Body

```json
{
  "text": "John Smith\nSoftware Engineer\n\nExperience:\n- Led backend migration...",
  "fileName": "john-smith-resume.pdf",
  "aiConfig": {
    "provider": "groq",
    "apiKey": "gsk_..."
  }
}
```

### Response

```json
{
  "id": "res_abc123",
  "fileName": "john-smith-resume.pdf",
  "overallScore": 74,
  "atsScore": 74,
  "sections": {
    "hasExperience": true,
    "hasEducation": true,
    "hasSkills": true,
    "hasProjects": true,
    "hasSummary": false
  },
  "weakBullets": [
    {
      "original": "led the backend team to migrate the API",
      "issue": "passive_verb",
      "suggested": "Orchestrated backend API migration resulting in..."
    }
  ],
  "missingKeywords": ["Docker", "Kubernetes", "CI/CD", "GraphQL"],
  "detectedKeywords": ["TypeScript", "React", "Node.js", "PostgreSQL"],
  "recommendations": [
    "Add a professional summary section at the top.",
    "Add missing keywords to your Skills section: Docker, Kubernetes, CI/CD, GraphQL."
  ],
  "starAnalysis": [...],
  "analyzedAt": "2026-07-26T12:00:00.000Z"
}
```

---

## POST /api/github/analyze

Fetches and analyzes a GitHub profile using the GitHub REST API.

### Request Body

```json
{
  "username": "torvalds",
  "token": "ghp_optional_token"
}
```

### Response

```json
{
  "username": "torvalds",
  "name": "Linus Torvalds",
  "avatarUrl": "https://avatars.githubusercontent.com/...",
  "bio": "Nothing to see here, move along.",
  "followers": 238000,
  "following": 0,
  "publicRepos": 8,
  "totalStars": 220000,
  "totalForks": 65000,
  "portfolioScore": 98,
  "readmeGrade": "Good",
  "languages": [
    { "name": "C", "percent": 75, "color": "#555555" }
  ],
  "pinnedRepos": [
    {
      "name": "linux",
      "description": "Linux kernel source tree",
      "stars": 220000,
      "forks": 65000,
      "language": "C",
      "hasReadme": true,
      "hasLicense": true,
      "url": "https://github.com/torvalds/linux"
    }
  ],
  "contributionData": [0, 5, 12, 8, ...],
  "recommendations": [],
  "analyzedAt": "2026-07-26T12:00:00.000Z"
}
```

### Notes
- Unauthenticated requests: 60 req/hr GitHub API limit
- With `GITHUB_TOKEN` or user token: 5,000 req/hr
- `contributionData` is a 52-element weekly contribution array (simulated without GraphQL token)

---

## POST /api/linkedin/analyze

Analyzes and optimizes a LinkedIn profile using AI.

### Request Body

```json
{
  "profile": {
    "headline": "Software Engineer at Acme",
    "summary": "Passionate developer with 5 years experience...",
    "experience": [...],
    "skills": ["JavaScript", "Python", "React"]
  },
  "aiConfig": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "sk-..."
  }
}
```

### Response

```json
{
  "overallScore": 72,
  "headlineAnalysis": {
    "current": "Software Engineer at Acme",
    "score": 45,
    "suggestions": ["Add specialization", "Include target company type", "Use keywords recruiters search"]
  },
  "summaryAnalysis": {
    "score": 68,
    "strengths": ["Clear experience mention"],
    "weaknesses": ["Missing quantified achievements", "No call to action"]
  },
  "keywordAnalysis": {
    "found": ["JavaScript", "React"],
    "missing": ["TypeScript", "Node.js", "System Design"],
    "score": 60
  },
  "visibilityIndex": 72,
  "recommendations": [
    "Rewrite headline to include specialization and target role",
    "Add TypeScript and Node.js to skills section"
  ]
}
```

---

## POST /api/reports/generate

Generates a comprehensive career report in the specified format.

### Request Body

```json
{
  "format": "html",
  "data": {
    "profile": { "name": "Jane Smith", "targetRole": "Senior Engineer" },
    "metrics": { "careerScore": 72, "resumeScore": 68, ... },
    "resumeAnalysis": { ... },
    "GitHubAnalysis": { ... },
    "linkedinAnalysis": { ... },
    "interviewSessions": [ ... ]
  }
}
```

**`format` values:** `html` | `markdown` | `pdf` | `json`

### Response

Returns the report as a blob for download. Content-Type depends on format:
- `html` → `text/html`
- `markdown` → `text/markdown`
- `pdf` → `application/pdf`
- `json` → `application/json`

---

## POST /api/parse-file

Parses an uploaded resume file and extracts raw text.

### Request

`multipart/form-data` with a `file` field.

**Supported formats:** `.pdf`, `.docx`, `.txt`, `.md`, `.rtf`, `.odt`

### Response

```json
{
  "text": "John Smith\nSoftware Engineer\n\nSKILLS\n- TypeScript...",
  "fileName": "resume.pdf",
  "fileType": "application/pdf",
  "wordCount": 412
}
```

---

## POST /api/parse-file/url

Downloads and parses a resume from a URL.

### Request Body

```json
{
  "url": "https://example.com/resume.pdf"
}
```

### Response

Same as `/api/parse-file`.

---

## POST /api/providers/test

Tests connectivity to an AI provider.

### Request Body

```json
{
  "provider": "groq",
  "apiKey": "gsk_...",
  "model": "llama3-70b-8192"
}
```

### Success Response

```json
{
  "success": true,
  "provider": "groq",
  "model": "llama3-70b-8192",
  "latencyMs": 423,
  "message": "Connection successful"
}
```

### Error Response

```json
{
  "success": false,
  "provider": "groq",
  "error": "AI provider error (401): Invalid API key"
}
```

---

## GET /api/profile

Returns the current user profile. Requires NextAuth session.

### Response (authenticated)

```json
{
  "id": "user_abc123",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "image": "https://avatars.githubusercontent.com/...",
  "githubUsername": "janesmith",
  "targetRole": "Senior Software Engineer",
  "targetCompany": "Google"
}
```

### Response (unauthenticated — guest mode)

```json
{
  "user": null,
  "guestMode": true
}
```

---

## Common Error Codes

| Code | Meaning | Resolution |
|---|---|---|
| 400 | Invalid request body | Check required fields |
| 401 | AI provider auth failed | Verify API key |
| 429 | AI provider rate limited | Wait or switch provider |
| 500 | Internal server error | Check server logs |
| 503 | AI provider unavailable | Switch provider or retry |

---

## API Key Priority

For AI-powered routes, keys are resolved in this order:
1. `apiKey` in the request body (user's own key from Settings)
2. Server-side env var (`GROQ_API_KEY`, `OPENAI_API_KEY`, etc.)
3. Local providers (Ollama, LM Studio) — no key required

**Security note:** API keys in request bodies are only used server-side to call the AI provider. They are never stored on the server.
