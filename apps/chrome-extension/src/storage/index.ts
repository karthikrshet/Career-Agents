// apps/chrome-extension/src/storage/index.ts

export interface StoragePreferences {
  workspaceUrl: string;
  theme: 'light' | 'dark' | 'system';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  workAuth: string;
  currentRole?: string;
  yearsOfExperience?: string;
  education?: string;
  visaSponsorship?: string;
  expectedSalary?: string;
  primarySkills?: string;
  apiProvider?: string;
  apiKey?: string;
  selectedAgentId?: string;
  tokenOptimization?: boolean;
  token?: string;
}

export function getPreferences(): Promise<Partial<StoragePreferences>> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([
      "workspaceUrl", "theme", "firstName", "lastName", "email", "phone",
      "linkedin", "github", "portfolio", "workAuth", "currentRole",
      "yearsOfExperience", "education", "visaSponsorship", "expectedSalary",
      "primarySkills", "apiProvider", "apiKey", "selectedAgentId", "tokenOptimization", "token"
    ], (res) => {
      resolve(res);
    });
  });
}

export function savePreferences(prefs: Partial<StoragePreferences>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(prefs, () => {
      resolve();
    });
  });
}

export function getLocalCache(key: string): Promise<any> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (res) => {
      resolve(res[key] || null);
    });
  });
}

export function saveLocalCache(key: string, value: any): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}
