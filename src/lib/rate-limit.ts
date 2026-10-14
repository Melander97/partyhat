import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * The caller's IP as Vercel reports it. Vercel sets x-forwarded-for itself
 * and overwrites any value the client sent, so the first entry can be
 * trusted there. Locally the header is usually absent, which is fine: every
 * local request then shares the bucket "unknown".
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first && first.length > 0 ? first : 'unknown';
}

/**
 * Builds a limiter, or returns null when Upstash isn't configured. Null
 * means "don't limit": local dev and tests work without any setup, at the
 * cost that a production deploy missing the env vars is silently
 * unprotected, which is why that case logs a warning.
 */
function createLimiter(
  prefix: string,
  requests: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        `Rate limiting is OFF for "${prefix}": UPSTASH_REDIS_REST_URL/TOKEN are not set`,
      );
    }
    return null;
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `partyhat:${prefix}`,
  });
}

// Module-level so the limiter (and its connection) is reused between
// requests on a warm server instead of being rebuilt every time.
const submitLimiter = createLimiter('submit', 10, '10 m');

/**
 * Checks and counts one leaderboard submission attempt from this caller.
 * Fails open: if Redis is unreachable we let the request through rather
 * than turning a rate-limit outage into a leaderboard outage. The receipt
 * checks and unique run id still apply either way.
 */
export async function checkSubmitRateLimit(request: Request): Promise<RateLimitResult> {
  if (submitLimiter === null) return { ok: true };

  try {
    const { success, reset } = await submitLimiter.limit(getClientIp(request));
    if (success) return { ok: true };
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
  } catch (error) {
    console.error('Rate limit check failed, allowing request:', error);
    return { ok: true };
  }
}
