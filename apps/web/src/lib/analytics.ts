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
    let randStr = "";
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      randStr = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    } else if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const array = new Uint32Array(2);
      crypto.getRandomValues(array);
      randStr = Array.from(array, dec => dec.toString(36)).join("").slice(0, 8);
    } else {
      randStr = Date.now().toString(36);
    }
    sessionId = `sess-${randStr}`;
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
