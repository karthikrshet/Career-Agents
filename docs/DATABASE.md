# Career OS — Database Reference

Prisma schema, model documentation, and database configuration for Career OS.

---

## Overview

Career OS uses **Prisma ORM** with **PostgreSQL** as the production database.

**Important:** Career OS runs fully without a database in **guest mode**. All data is stored in browser `localStorage` via Zustand. The database enables server-side persistence for authenticated users (multi-device sync, data backup).

---

## Guest Mode vs. Database Mode

| Feature | Guest Mode (localStorage) | Database Mode (PostgreSQL) |
|---|---|---|
| Resume Analysis | ✅ Stored locally | ✅ Synced to DB |
| GitHub Analysis | ✅ Stored locally | ✅ Synced to DB |
| Interview Sessions | ✅ Stored locally | ✅ Synced to DB |
| Job Applications | ✅ Stored locally | ✅ Synced to DB |
| Copilot History | ✅ Stored locally | ✅ Synced to DB |
| Settings | ✅ Stored locally | ✅ Synced to DB |
| Multi-device Sync | ❌ | ✅ |
| Sign-in (OAuth) | ❌ | ✅ |
| Requires setup | No setup needed | PostgreSQL + env vars |

---

## Setup

### Step 1: Create PostgreSQL Database

```sql
CREATE DATABASE career_os;
CREATE USER career_os_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE career_os TO career_os_user;
```

Or use a hosted service (Neon, Supabase, Railway):
```env
DATABASE_URL="postgresql://career_os_user:password@db.example.com:5432/career_os"
```

### Step 2: Set Environment Variable

```env
DATABASE_URL="postgresql://career_os_user:password@localhost:5432/career_os"
```

### Step 3: Push the Schema

From `apps/web/`:
```bash
npx prisma db push
```

This creates all tables without running migrations. For production environments, use migrations:
```bash
npx prisma migrate deploy
```

### Step 4: Verify

```bash
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can browse your data.

---

## Schema Reference

Schema file: `apps/web/prisma/schema.prisma`

### User

```prisma
model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  emailVerified   DateTime?
  image           String?
  githubUsername  String?
  linkedinUrl     String?
  targetRole      String?
  targetCompany   String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  resumeAnalyses    ResumeAnalysis[]
  githubAnalyses    GitHubAnalysis[]
  interviewSessions InterviewSession[]
  jobApplications   JobApplication[]
  copilotSessions   CopilotSession[]
  metrics           CareerMetrics?
  settings          UserSettings?
  
  @@map("users")
}
```

**Fields:**
| Field | Type | Description |
|---|---|---|
| `id` | `String` (CUID) | Primary key, auto-generated |
| `name` | `String` | Display name from OAuth provider |
| `email` | `String` | Unique email address |
| `emailVerified` | `DateTime?` | Email verification timestamp |
| `image` | `String?` | Avatar URL from OAuth provider |
| `githubUsername` | `String?` | GitHub username (optional) |
| `linkedinUrl` | `String?` | LinkedIn profile URL (optional) |
| `targetRole` | `String?` | User's target job title |
| `targetCompany` | `String?` | User's target company |

---

### CareerMetrics

```prisma
model CareerMetrics {
  id               String   @id @default(cuid())
  userId           String   @unique
  careerScore      Int      @default(0)
  resumeScore      Int      @default(0)
  githubScore      Int      @default(0)
  linkedinScore    Int      @default(0)
  interviewScore   Int      @default(0)
  applicationScore Int      @default(0)
  updatedAt        DateTime @updatedAt
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("career_metrics")
}
```

One-to-one with `User`. Stores the 5-dimensional career score breakdown. Updated whenever the user runs an analysis.

---

### ResumeAnalysis

```prisma
model ResumeAnalysis {
  id               String   @id @default(cuid())
  userId           String
  fileName         String
  rawText          String   @db.Text
  overallScore     Int
  atsScore         Int
  sections         Json     -- { hasExperience, hasEducation, hasSkills, hasProjects, hasSummary }
  weakBullets      Json     -- Array of { original, issue, suggested }
  missingKeywords  String[]
  detectedKeywords String[]
  recommendations  String[]
  aiRewrite        String?  @db.Text
  analyzedAt       DateTime @default(now())
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("resume_analyses")
}
```

One-to-many with `User`. Each upload creates a new record. `sections`, `weakBullets` stored as JSON.

---

### GitHubAnalysis

```prisma
model GitHubAnalysis {
  id             String   @id @default(cuid())
  userId         String
  username       String
  portfolioScore Int
  data           Json     -- Full GitHubAnalysis object
  analyzedAt     DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("github_analyses")
}
```

Stores the full GitHub analysis result as JSON. One-to-many with `User`.

---

### InterviewSession

```prisma
model InterviewSession {
  id          String    @id @default(cuid())
  userId      String
  company     String
  role        String
  mode        String    -- "behavioral" | "technical" | "system_design" | "hr"
  difficulty  String    -- "Easy" | "Medium" | "Hard"
  round       String
  questions   Json      -- Array of { id, text, type, followUp }
  responses   Json      -- Array of { questionId, answer }
  scorecard   Json?     -- { scores: {...}, feedback, strengths, improvements }
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("interview_sessions")
}
```

Each mock interview session. `questions`, `responses`, and `scorecard` stored as JSON.

---

### JobApplication

```prisma
model JobApplication {
  id          String   @id @default(cuid())
  userId      String
  company     String
  role        String
  status      String   -- "wishlist" | "applied" | "phone_screen" | "interview" | "offer" | "rejected"
  location    String?
  salary      String?
  referral    String?
  recruiter   String?
  notes       String?
  url         String?
  tags        String[]
  appliedDate DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("job_applications")
}
```

Kanban job tracker. Each application is a card that can be moved through `status` stages.

---

### CopilotSession

```prisma
model CopilotSession {
  id        String   @id @default(cuid())
  userId    String
  title     String
  messages  Json     -- Array of { id, role, content, timestamp }
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("copilot_sessions")
}
```

Each Career Copilot conversation. `messages` is a JSON array of chat messages.

---

### UserSettings

```prisma
model UserSettings {
  id            String   @id @default(cuid())
  userId        String   @unique
  aiProvider    String   @default("groq")
  aiModel       String   @default("llama3-70b-8192")
  temperature   Float    @default(0.7)
  theme         String   @default("dark")
  notifications Boolean  @default(true)
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_settings")
}
```

One-to-one with `User`. Persists AI provider preferences and UI settings server-side.

---

## Entity Relationship Diagram

```
User (1) ─────────── (1) CareerMetrics
     │
     ├──── (many) ResumeAnalysis
     ├──── (many) GitHubAnalysis
     ├──── (many) InterviewSession
     ├──── (many) JobApplication
     ├──── (many) CopilotSession
     └──── (1) UserSettings
```

All child records cascade-delete when a `User` is deleted.

---

## Prisma Commands Reference

```bash
# From apps/web/

# Push schema changes to database (development)
npx prisma db push

# Create and apply migrations (production)
npx prisma migrate dev --name "description"
npx prisma migrate deploy

# Open Prisma Studio (database browser)
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate

# Reset database (DANGEROUS — deletes all data)
npx prisma db push --force-reset
```

---

## Notes

- **API keys are never stored in the database.** They stay in `localStorage` only.
- **No PostgreSQL = guest mode.** The app works without `DATABASE_URL`.
- **CUID** is used for all primary keys (collision-resistant, URL-safe).
- **JSON fields** (`sections`, `weakBullets`, `messages`, etc.) store complex nested data without normalization for simplicity.
