import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Imported from the module directly rather than the `packages/security` barrel,
// which re-exports url-validator and would pull Node's `net`/`dns` into the
// Edge runtime this middleware compiles to.
import { checkRateLimit } from "packages/security/rate-limiter";

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute
const RATE_LIMIT_BURST = 10;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // 1. Enforce Rate Limiting for API routes
  //
  // Delegates to packages/security/rate-limiter, which evicts idle buckets.
  // The previous inline Map was never pruned, so it retained one entry per
  // distinct client IP for the lifetime of the process.
  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

    if (!checkRateLimit(ip, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_BURST)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", "Retry-After": "60" }
        }
      );
    }
  }

  // 2. Set Security Headers
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.set("Cross-Origin-Embedder-Policy", "credentialless");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");

  // Content Security Policy
  const cspHeader = [
    "default-src 'self';",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data: https:;",
    "font-src 'self' data:;",
    "connect-src 'self' https: http://localhost:11434 http://localhost:1234 http://127.0.0.1:11434 http://127.0.0.1:1234;",
    "frame-src 'none';",
    "object-src 'none';"
  ].join(" ");
  res.headers.set("Content-Security-Policy", cspHeader);

  return res;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
