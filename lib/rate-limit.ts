/**
 * In-Memory Sliding Window Rate Limiter
 *
 * Tracks request counts per key (usually IP) within a sliding time window.
 * Suitable for single-instance deployments. For multi-instance / serverless,
 * replace with Redis-backed solution (e.g., @upstash/ratelimit).
 *
 * @example
 * const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10 });
 * const result = limiter.check(clientIp);
 * if (!result.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 */

interface RateLimiterOptions {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed within the window */
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

interface TokenBucket {
  timestamps: number[];
}

export function createRateLimiter({ windowMs, maxRequests }: RateLimiterOptions) {
  const store = new Map<string, TokenBucket>();

  // Lazy garbage collection interval (at least 60s or 2x the window)
  const CLEANUP_INTERVAL = Math.max(windowMs * 2, 60_000);
  // Track last cleanup time for lazy garbage collection
  let lastCleanup = Date.now();

  function cleanupIfNeeded() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, bucket] of store.entries()) {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
      if (bucket.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }

  return {
    check(key: string): RateLimitResult {
      cleanupIfNeeded();
      const now = Date.now();
      let bucket = store.get(key);

      if (!bucket) {
        bucket = { timestamps: [] };
        store.set(key, bucket);
      }

      // Remove timestamps outside the current window
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

      if (bucket.timestamps.length >= maxRequests) {
        const oldestInWindow = bucket.timestamps[0];
        return {
          allowed: false,
          remaining: 0,
          resetMs: oldestInWindow + windowMs - now,
        };
      }

      bucket.timestamps.push(now);
      return {
        allowed: true,
        remaining: maxRequests - bucket.timestamps.length,
        resetMs: windowMs,
      };
    },

    /** Reset a specific key (e.g., after successful login) */
    reset(key: string): void {
      store.delete(key);
    },
  };
}

/* ----------------------------------------------------------------
   Pre-configured limiters for different endpoint sensitivity levels
   ---------------------------------------------------------------- */

/** Login: 5 attempts per 15 minutes */
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

/** Booking creation / Contact form: 10 per minute */
export const formLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
});

/** General API: 60 per minute */
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
});
