// packages/security/rate-limiter.ts


interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

const BUCKET_TTL_MS = 5 * 60 * 1000;
const SWEEP_INTERVAL_MS = 60 * 1000;
let lastSweep = 0;

/**
 * Drop buckets untouched for longer than the TTL, so the map does not grow
 * once per distinct IP forever.
 *
 * This sweeps lazily on call rather than from a module-scope setInterval: a
 * background timer keeps the Node event loop alive and is not a good fit for
 * the Edge runtime that Next.js middleware runs on.
 */
function sweepExpiredBuckets(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  buckets.forEach((bucket, ip) => {
    if (now - bucket.lastRefill > BUCKET_TTL_MS) {
      buckets.delete(ip);
    }
  });
}

/**
 * Exposed for tests and diagnostics.
 */
export function _bucketCount(): number {
  return buckets.size;
}

/**
 * Sliding Token Bucket rate-limiter.
 * Returns true if request is allowed, false if rate limited.
 */
export function checkRateLimit(
  ip: string,
  limit: number = 60,
  windowMs: number = 60000,
  burst: number = 10
): boolean {
  const now = Date.now();
  sweepExpiredBuckets(now);
  const maxCapacity = limit + burst;

  const bucket = buckets.get(ip) || {
    tokens: maxCapacity,
    lastRefill: now,
  };

  const elapsed = now - bucket.lastRefill;
  // Refill token rate
  const refill = (elapsed / windowMs) * limit;

  bucket.tokens = Math.min(maxCapacity, bucket.tokens + refill);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(ip, bucket);
    return true;
  }

  buckets.set(ip, bucket);
  return false;
}

interface RequestLimitOptions {
  maxSize?: number;       // Max payload size in bytes (default: 5MB)
  rateLimitCount?: number; // Refill count (default: 30)
  rateLimitWindow?: number; // Window time in ms (default: 60000)
  burstLimit?: number;    // Burst tokens (default: 5)
  isUser?: boolean;       // If the requester is an authenticated user
}

/**
 * Enforces rate limiting and payload size limits on a Next.js request.
 * Returns a NextResponse if limits are exceeded, otherwise returns null.
 */
export function enforceRequestLimits(
  req: Request,
  ip: string,
  options: RequestLimitOptions = {}
): Response | null {
  const maxSize = options.maxSize ?? 5 * 1024 * 1024; // 5MB default
  const isUser = options.isUser ?? false;
  
  // Generous request limits for unrestricted application usage
  const limitCount = options.rateLimitCount ?? (isUser ? 300 : 300);
  const limitWindow = options.rateLimitWindow ?? 60000;
  const burstLimit = options.burstLimit ?? (isUser ? 100 : 100);

  // 1. Enforce payload size limit using Content-Length header
  const contentLengthStr = req.headers.get("content-length");
  if (contentLengthStr) {
    const contentLength = parseInt(contentLengthStr, 10);
    if (!isNaN(contentLength) && contentLength > maxSize) {
      return Response.json(
        { error: "Payload too large", code: "PAYLOAD_TOO_LARGE" },
        { status: 413 }
      );
    }
  }

  // 2. Enforce IP rate limiting
  const allowed = checkRateLimit(ip, limitCount, limitWindow, burstLimit);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return null;
}
