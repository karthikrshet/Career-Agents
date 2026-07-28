// apps/web/src/lib/analytics.ts

export interface AnalyticsPayload {
  eventName: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

export function isHostedDeployment(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  // Only track active hosted environments (e.g. Vercel, Netlify, custom domain), skip local dev clones
  return !["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname) && !hostname.endsWith(".local");
}

export async function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;
  
  // Only track on the hosted production deployment to preserve repository privacy for forks
  if (!isHostedDeployment()) {
    console.log("[Analytics-Sandbox-Local]", eventName, properties);
    return;
  }

  // Enforce GDPR/CCPA cookie consent check
  const consent = localStorage.getItem("cookie-consent");
  if (consent === "declined") return;

  let sessionId = sessionStorage.getItem("analytics-session-id");
  if (!sessionId) {
    sessionId = `sess-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("analytics-session-id", sessionId);
  }

  const payload: AnalyticsPayload = {
    eventName,
    properties,
    sessionId,
  };

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to forward telemetry logs:", err);
  }
}
