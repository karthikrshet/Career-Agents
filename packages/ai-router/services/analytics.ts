// packages/ai-router/services/analytics.ts
import { UsageAnalytics, RouterLog, AIProviderId, AIErrorCode } from "../types";

let currentLogs: RouterLog[] = [];

export function recordRouterLog(log: RouterLog): void {
  currentLogs = [log, ...currentLogs.slice(0, 99)]; // Keep last 100 logs
}

export function getRouterLogs(): RouterLog[] {
  return currentLogs;
}

export function clearRouterLogs(): void {
  currentLogs = [];
}

export function compileUsageAnalytics(): UsageAnalytics {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weeklyStart = todayStart - 7 * 24 * 60 * 60 * 1000;
  const monthlyStart = todayStart - 30 * 24 * 60 * 60 * 1000;

  let requestsToday = 0;
  let requestsWeekly = 0;
  let requestsMonthly = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let estimatedCostUSD = 0;
  let latencySum = 0;
  let successCount = 0;

  const errorCounts: Record<AIErrorCode, number> = {
    AUTH_FAILED: 0,
    MODEL_NOT_FOUND: 0,
    RATE_LIMITED: 0,
    QUOTA_EXCEEDED: 0,
    CONTEXT_TOO_LONG: 0,
    INVALID_INPUT: 0,
    UNAVAILABLE: 0,
    TIMEOUT: 0,
    UNKNOWN: 0,
  };

  for (const log of currentLogs) {
    const timestampMs = new Date(log.timestamp).getTime();
    if (timestampMs >= todayStart) requestsToday++;
    if (timestampMs >= weeklyStart) requestsWeekly++;
    if (timestampMs >= monthlyStart) requestsMonthly++;

    inputTokens += log.inputTokens;
    outputTokens += log.outputTokens;
    estimatedCostUSD += log.costUSD;
    latencySum += log.durationMs;
    
    if (log.status === "completed") {
      successCount++;
    }

    // Accumulate error stats from execution chain failures
    for (const step of log.executionChain) {
      if (step.status === "failed" && step.error) {
        const errorLower = step.error.toLowerCase();
        if (errorLower.includes("api key") || errorLower.includes("auth") || errorLower.includes("401") || errorLower.includes("403")) {
          errorCounts.AUTH_FAILED++;
        } else if (errorLower.includes("quota") || errorLower.includes("429") || errorLower.includes("exhausted")) {
          errorCounts.QUOTA_EXCEEDED++;
        } else if (errorLower.includes("rate limit")) {
          errorCounts.RATE_LIMITED++;
        } else if (errorLower.includes("context") || errorLower.includes("too long")) {
          errorCounts.CONTEXT_TOO_LONG++;
        } else if (errorLower.includes("model")) {
          errorCounts.MODEL_NOT_FOUND++;
        } else if (errorLower.includes("reach") || errorLower.includes("network") || errorLower.includes("connect")) {
          errorCounts.UNAVAILABLE++;
        } else {
          errorCounts.UNKNOWN++;
        }
      }
    }
  }

  const successRatePercent = currentLogs.length > 0 ? Math.round((successCount / currentLogs.length) * 100) : 100;
  const averageLatencyMs = successCount > 0 ? Math.round(latencySum / currentLogs.length) : 0;

  return {
    requestsToday,
    requestsWeekly,
    requestsMonthly,
    inputTokens,
    outputTokens,
    estimatedCostUSD,
    averageLatencyMs,
    successRatePercent,
    errorCounts,
  };
}
