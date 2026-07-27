// packages/security/types.ts

export interface SecureFetchOptions extends RequestInit {
  timeout?: number;      // Request timeout in milliseconds (default: 30000)
  retries?: number;      // Number of retries on transient errors (default: 3)
  retryDelay?: number;   // Delay between retries in milliseconds (default: 1000)
  allowedProvider?: string; // Optional provider constraint (e.g. "openai", "gemini")
  maxRedirects?: number; // Maximum redirect follow count (default: 3)
  maxResponseSize?: number; // Maximum response size in bytes (default: 10 * 1024 * 1024)
}

export interface ProviderEndpoint {
  provider: string;
  baseUrl: string;
}
