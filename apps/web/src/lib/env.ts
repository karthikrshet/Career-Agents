import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().min(1, "NEXTAUTH_URL is required"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  QDRANT_URL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export function validateEnv() {
  const isDevOrBuild =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test";

  // Parse process.env fields
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.format();
    const missingRequired: string[] = [];
    const missingOptional: string[] = [];

    const requiredKeys = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

    // Find missing fields
    requiredKeys.forEach((key) => {
      if (!process.env[key] || process.env[key]?.trim() === "") {
        missingRequired.push(key);
      }
    });

    const optionalKeys = [
      "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET", "GROQ_API_KEY", "OPENAI_API_KEY",
      "OPENROUTER_API_KEY", "GEMINI_API_KEY", "REDIS_URL", "QDRANT_URL", "SENTRY_DSN"
    ];

    optionalKeys.forEach((key) => {
      if (!process.env[key] || process.env[key]?.trim() === "") {
        missingOptional.push(key);
      }
    });

    if (isDevOrBuild) {
      if (missingRequired.length > 0 || missingOptional.length > 0) {
        console.warn(`\n⚠️  WARNING: Environment configuration issues detected:`);
        if (missingRequired.length > 0) {
          console.warn(`  Missing Required: ${missingRequired.join(", ")}`);
        }
        if (missingOptional.length > 0) {
          console.warn(`  Missing Optional: ${missingOptional.join(", ")} (related features will be disabled)`);
        }
        console.warn(`Ensure variables are configured correctly before going live.\n`);
      }
    } else {
      if (missingRequired.length > 0) {
        throw new Error(
          `[FATAL] Missing required production environment secrets:\n` +
          missingRequired.map(m => `  - ${m}`).join("\n")
        );
      }
      if (missingOptional.length > 0) {
        console.warn(
          `\n⚠️  WARNING: Missing optional environment secrets in production:\n` +
          missingOptional.map(m => `  - ${m} (feature disabled)`).join("\n") + "\n"
        );
      }
    }
  }
}

validateEnv();
