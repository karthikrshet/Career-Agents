import { validateExternalUrl, resolveAndValidateHost, resolveAndGetSafeIp } from "./url-validator";
import { NetworkError, ValidationError } from "./errors";
import { SecureFetchOptions } from "./types";

const SENSITIVE_HEADERS = ["authorization", "api-key", "x-api-key", "cookie", "set-cookie"];

/**
 * Perform a secure fetch request enforcing SSRF defenses, redirects validation, 
 * timeouts, and retries.
 */
export async function secureFetch(
  urlStr: string,
  options: SecureFetchOptions = {}
): Promise<Response> {
  const timeoutMs = options.timeout ?? 30000;
  const maxRetries = options.retries ?? 3;
  const retryDelay = options.retryDelay ?? 1000;
  const maxRedirects = options.maxRedirects ?? 3;
  const allowedProvider = options.allowedProvider;

  let currentUrl = validateExternalUrl(urlStr, allowedProvider);
  let redirectCount = 0;

  // Compile active headers
  const headers = new Headers(options.headers || {});

  // Fail-safe retry loop
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      // 1. Resolve host and validate against private IP address (DNS rebinding check)
      const isLocalAllowed = allowedProvider === "ollama" || allowedProvider === "lmstudio";
      const resolvedIp = await resolveAndGetSafeIp(currentUrl.hostname, isLocalAllowed);

      const targetUrl = new URL(currentUrl.toString());
      const isOfficialProvider = allowedProvider && allowedProvider !== "custom";
      if (!isOfficialProvider) {
        targetUrl.hostname = resolvedIp;
      }

      // 2. Setup timeout and abort controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Clone headers for the current request context and set Host header
      const requestHeaders = new Headers(headers);
      requestHeaders.set("Host", currentUrl.hostname);

      // 3. Construct manual redirect option to inspect locations
      const fetchOptions: RequestInit = {
        ...options,
        headers: requestHeaders,
        redirect: "manual",
        signal: options.signal
          ? // Combine signals if custom signal is passed
            AbortSignal.any([controller.signal, options.signal])
          : controller.signal,
      };

      const res = await fetch(targetUrl.toString(), fetchOptions);
      clearTimeout(timeoutId);

      // Enforce response size limits
      const maxResponseSize = options.maxResponseSize ?? 10 * 1024 * 1024; // 10MB default
      const contentLengthStr = res.headers.get("content-length");
      if (contentLengthStr) {
        const contentLength = parseInt(contentLengthStr, 10);
        if (!isNaN(contentLength) && contentLength > maxResponseSize) {
          throw new ValidationError(`Response size exceeds limit of ${maxResponseSize} bytes`);
        }
      }

      // 4. Handle redirects manually to prevent redirect SSRF
      if ([301, 302, 303, 307, 308].includes(res.status)) {
        redirectCount++;
        if (redirectCount > maxRedirects) {
          throw new ValidationError(`Redirect chain exceeded limit of ${maxRedirects}`);
        }

        const location = res.headers.get("location");
        if (!location) {
          throw new ValidationError("Redirect response missing Location header");
        }

        // Resolve relative redirects
        const nextUrl = new URL(location, currentUrl.toString());

        // Validate the next redirect URL
        validateExternalUrl(nextUrl.toString(), allowedProvider);

        // Header sanitization across different hosts
        if (nextUrl.host !== currentUrl.host) {
          for (const headerKey of SENSITIVE_HEADERS) {
            headers.delete(headerKey);
          }
        }

        currentUrl = nextUrl;
        attempt = 0; // Reset retry counter for new redirect target
        continue;
      }

      // Check for transient server errors to retry
      if ([429, 502, 503, 504].includes(res.status) && attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      // Return successful response
      return res;
    } catch (err: any) {
      if (err.name === "AbortError") {
        if (attempt < maxRetries) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
          continue;
        }
        throw new NetworkError(`Request timeout after ${timeoutMs}ms`, 408);
      }

      if (err instanceof ValidationError) {
        throw err;
      }

      // Other fetch network/socket failures
      if (attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      throw new NetworkError(err.message || "Network request failed");
    }
  }

  throw new NetworkError("Max request retries exceeded");
}
