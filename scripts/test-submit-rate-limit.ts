/**
 * Verifies the submit route's rate limit against a running dev server.
 *
 * Sends junk submissions (an invalid receipt, so nothing is ever written to
 * the database) until the limit kicks in. Needs the Redis REST URL and token
 * (UPSTASH_REDIS_REST_* or KV_REST_API_*) in your .env; without them the limiter is off by
 * design and this script says so instead of failing.
 *
 * Heads up: this uses up your own quota for the next 10 minutes, so wait
 * before re-running it or before submitting a real run from the same IP.
 *
 * Requires `npm run dev` running in another terminal.
 * Run: npx tsx scripts/test-submit-rate-limit.ts
 */
import 'dotenv/config';

const BASE_URL = 'http://localhost:3000';
const ATTEMPTS = 12; // the limit is 10 per 10 minutes

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`ok: ${message}`);
}

async function submitJunk() {
  return fetch(`${BASE_URL}/api/leaderboard/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receipt: 'not-a-real-receipt',
      handle: 'ratelimit',
      clientId: 'test-script-ratelimit-0000',
    }),
  });
}

async function main() {
  const hasUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const hasToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!hasUrl || !hasToken) {
    console.log('SKIP: Upstash env vars not set, so the limiter is off locally (expected).');
    return;
  }

  const statuses: number[] = [];
  let retryAfter: string | null = null;
  for (let i = 0; i < ATTEMPTS; i++) {
    const res = await submitJunk();
    statuses.push(res.status);
    if (res.status === 429 && retryAfter === null) retryAfter = res.headers.get('Retry-After');
  }

  console.log('statuses:', statuses.join(' '));
  assert(
    statuses.slice(0, 10).every((s) => s === 401),
    'first 10 attempts reach receipt check (401)',
  );
  assert(
    statuses.slice(10).every((s) => s === 429),
    'attempts past the limit are rejected (429)',
  );
  assert(
    retryAfter !== null && Number(retryAfter) > 0 && Number(retryAfter) <= 600,
    `429 carries a sensible Retry-After (${retryAfter}s)`,
  );
  console.log('All checks passed.');
}

main();
