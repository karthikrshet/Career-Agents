// apps/chrome-extension/src/services/api.ts
import { getPreferences, savePreferences } from "../storage";
import { JobDetails } from "../messaging/types";

async function getAuthHeaders(): Promise<HeadersInit> {
  const prefs = await getPreferences();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (prefs.token) {
    headers["Authorization"] = `Bearer ${prefs.token}`;
  }
  return headers;
}

export async function fetchExtensionAuth(token: string): Promise<any> {
  const prefs = await getPreferences();
  const url = prefs.workspaceUrl || "http://localhost:3000";
  const res = await fetch(`${url}/api/extension/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Authentication failed");
  const data = await res.json();
  if (data.token) {
    await savePreferences({ token: data.token });
  }
  return data;
}

export async function evaluateJobJd(details: JobDetails): Promise<any> {
  const prefs = await getPreferences();
  const url = prefs.workspaceUrl || "http://localhost:3000";
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${url}/api/extension/ats`, {
    method: "POST",
    headers,
    body: JSON.stringify({ details }),
  });
  if (!res.ok) throw new Error("Failed to evaluate job description");
  return res.json();
}

export async function saveJobToHub(details: JobDetails): Promise<any> {
  const prefs = await getPreferences();
  const url = prefs.workspaceUrl || "http://localhost:3000";
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${url}/api/extension/jobs`, {
    method: "POST",
    headers,
    body: JSON.stringify({ details }),
  });
  if (!res.ok) throw new Error("Failed to save job");
  return res.json();
}
