// apps/web/src/lib/env.ts

const REQUIRED_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GROQ_API_KEY",
  "OPENAI_API_KEY",
];

export function validateEnv() {
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "test";
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key] || process.env[key]?.trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const errorMsg = `[Env Validation] Missing required environment secrets:\n${missing.map(m => `  - ${m}`).join("\n")}`;
    
    if (isBuildPhase) {
      console.warn(`\n⚠️  WARNING: ${errorMsg}\nEnsure these variables are added in Vercel project configurations.\n`);
    } else {
      throw new Error(errorMsg);
    }
  }
}

validateEnv();
