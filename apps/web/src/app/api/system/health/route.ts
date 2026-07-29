import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { runHealthCheck } from "../../../../../../../packages/ai-router/services/health";
import fs from "fs";
import path from "path";
import net from "net";

export const dynamic = "force-dynamic";

// Helper to test TCP connectivity for databases and caches
async function testTcp(urlStr: string, defaultPort = 80): Promise<{ ok: boolean; latency: number }> {
  const start = Date.now();
  try {
    let hostname = "localhost";
    let port = defaultPort;

    if (urlStr.includes("://")) {
      const parsed = new URL(urlStr);
      hostname = parsed.hostname;
      port = parsed.port ? parseInt(parsed.port) : defaultPort;
    } else {
      const parts = urlStr.split(":");
      hostname = parts[0];
      if (parts[1]) port = parseInt(parts[1]);
    }

    return new Promise((resolve) => {
      const socket = new net.Socket();
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          socket.destroy();
          resolve({ ok: false, latency: 0 });
        }
      }, 1500);

      socket.connect(port, hostname, () => {
        clearTimeout(timer);
        resolved = true;
        socket.end();
        resolve({ ok: true, latency: Date.now() - start });
      });

      socket.on("error", () => {
        clearTimeout(timer);
        resolved = true;
        socket.destroy();
        resolve({ ok: false, latency: 0 });
      });
    });
  } catch {
    return { ok: false, latency: 0 };
  }
}

export async function GET() {
  const start = Date.now();
  logger.info("Executing system health check diagnostics", { route: "/api/system/health" });
  const checks: Record<string, { status: "Connected" | "Healthy" | "Partial" | "Missing" | "Offline" | "Disabled"; latency: number; details?: string }> = {};

  // 1. Environment variables check
  const requiredEnv = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];
  const missingEnv = requiredEnv.filter((k) => !process.env[k]);
  checks["Environment"] = {
    status: missingEnv.length === 0 ? "Healthy" : "Missing",
    latency: 0,
    details: missingEnv.length === 0 ? "All core secrets set" : `Missing: ${missingEnv.join(", ")}`,
  };

  // 2. Database connectivity check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    // Schema check: verify if required tables exist
    try {
      const missingTables: string[] = [];
      const verifyTable = async (name: string, checkFn: () => Promise<any>) => {
        try {
          await checkFn();
        } catch {
          missingTables.push(name);
        }
      };

      await verifyTable("users", () => prisma.user.count());
      await verifyTable("accounts", () => prisma.account.count());
      await verifyTable("sessions", () => prisma.session.count());
      await verifyTable("chat_messages", () => (prisma as any).chatMessage.count());
      await verifyTable("resumes", () => prisma.resumeAnalysis.count());
      await verifyTable("workflows", () => (prisma as any).workflow.count());
      await verifyTable("reports", () => (prisma as any).report.count());
      await verifyTable("analytics_events", () => prisma.analyticsEvent.count());

      if (missingTables.length === 0) {
        checks["Database"] = { 
          status: "Healthy", 
          latency: Date.now() - dbStart, 
          details: "Database connected and schema verified" 
        };
      } else {
        checks["Database"] = { 
          status: "Partial", 
          latency: Date.now() - dbStart, 
          details: `Connected, but tables missing (run migrations): ${missingTables.join(", ")}` 
        };
      }
    } catch (schemaErr: any) {
      checks["Database"] = { 
        status: "Partial", 
        latency: Date.now() - dbStart, 
        details: `Connected, but schema check failed: ${schemaErr.message}` 
      };
    }
  } catch (err: any) {
    checks["Database"] = { status: "Offline", latency: 0, details: err.message };
  }

  // 3. Redis check
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redisCheck = await testTcp(redisUrl, 6379);
    checks["Redis"] = {
      status: redisCheck.ok ? "Healthy" : "Offline",
      latency: redisCheck.latency,
      details: redisCheck.ok ? "Redis connection successful" : "TCP check timed out/refused",
    };
  } else {
    checks["Redis"] = { status: "Disabled", latency: 0, details: "REDIS_URL not configured" };
  }

  // 4. Prisma Client validation
  try {
    const isPrismaConnected = !!prisma;
    checks["Prisma"] = { status: isPrismaConnected ? "Healthy" : "Offline", latency: 0 };
  } catch {
    checks["Prisma"] = { status: "Offline", latency: 0 };
  }

  // 5. NextAuth check
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  checks["NextAuth"] = {
    status: nextAuthUrl && process.env.NEXTAUTH_SECRET ? "Healthy" : "Disabled",
    latency: 0,
    details: nextAuthUrl ? `Callback URL: ${nextAuthUrl}` : "Missing config secrets",
  };

  // 6. Groq check
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groqStart = Date.now();
    try {
      const report = await runHealthCheck("groq", groqKey);
      checks["Groq"] = {
        status: report.healthy ? "Healthy" : "Offline",
        latency: Date.now() - groqStart,
        details: report.status,
      };
    } catch {
      checks["Groq"] = { status: "Offline", latency: 0 };
    }
  } else {
    checks["Groq"] = { status: "Disabled", latency: 0 };
  }

  // 7. Gemini check
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const geminiStart = Date.now();
    try {
      const report = await runHealthCheck("gemini", geminiKey);
      checks["Gemini"] = {
        status: report.healthy ? "Healthy" : "Offline",
        latency: Date.now() - geminiStart,
        details: report.status,
      };
    } catch {
      checks["Gemini"] = { status: "Offline", latency: 0 };
    }
  } else {
    checks["Gemini"] = { status: "Disabled", latency: 0 };
  }

  // 8. OpenRouter check
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    const orStart = Date.now();
    try {
      const report = await runHealthCheck("openrouter", openRouterKey);
      checks["OpenRouter"] = {
        status: report.healthy ? "Healthy" : "Offline",
        latency: Date.now() - orStart,
        details: report.status,
      };
    } catch {
      checks["OpenRouter"] = { status: "Offline", latency: 0 };
    }
  } else {
    checks["OpenRouter"] = { status: "Disabled", latency: 0 };
  }

  // 9. GitHub OAuth
  checks["GitHub OAuth"] = {
    status: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? "Healthy" : "Disabled",
    latency: 0,
  };

  // 10. Google OAuth
  checks["Google OAuth"] = {
    status: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? "Healthy" : "Disabled",
    latency: 0,
  };

  // 11. Blob Storage Check
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  checks["Blob Storage"] = {
    status: blobToken ? "Healthy" : "Disabled",
    latency: 0,
    details: blobToken ? "Vercel Blob active" : "BLOB_READ_WRITE_TOKEN not set",
  };

  // 12. Filesystem Check (Check if tmp dir is writeable)
  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const testFile = path.join(tmpDir, "health-write-test.txt");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    checks["Filesystem"] = { status: "Healthy", latency: 0, details: "Local tmp dir writeable" };
    // Keep 'Storage' as well for frontend display backwards compatibility
    checks["Storage"] = { status: "Healthy", latency: 0, details: "Local filesystem writeable" };
  } catch (err: any) {
    checks["Filesystem"] = { status: "Offline", latency: 0, details: err.message };
    checks["Storage"] = { status: "Offline", latency: 0, details: err.message };
  }

  // 13. MCP check (Check JSON-RPC semantic configuration status)
  try {
    const mcpConfigPath = path.join(process.cwd(), "mcp-servers.json");
    const mcpExists = fs.existsSync(mcpConfigPath);
    checks["MCP"] = {
      status: mcpExists ? "Healthy" : "Disabled",
      latency: 0,
      details: mcpExists ? "Config settings registered" : "mcp-servers.json not found",
    };
  } catch {
    checks["MCP"] = { status: "Offline", latency: 0 };
  }

  logger.info("System health check diagnostics finished", {
    route: "/api/system/health",
    latency: Date.now() - start,
  });

  return NextResponse.json({ success: true, checks });
}
