/**
 * Verifies GET /api/leaderboard against a running dev server.
 *
 * Nothing writes to leaderboard_entries yet, so this seeds a few clearly
 * fake rows directly, checks the ordering and privacy properties through
 * the real endpoint, then deletes them again in a `finally` block.
 *
 * Heads up: if your local DATABASE_URL points at the same Neon database
 * as production, those rows are briefly visible on the live leaderboard
 * while this runs. They're all tagged clientId 'test-script' and removed
 * at the end, even if a check fails.
 *
 * Requires `npm run dev` running in another terminal.
 * Run: npx tsx scripts/test-leaderboard-read.ts
 */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/db';
import { leaderboardEntries } from '../src/db/schema';

const BASE_URL = 'http://localhost:3000';
const TEST_CLIENT_ID = 'test-script';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function getLeaderboard(query = '') {
  const res = await fetch(`${BASE_URL}/api/leaderboard${query}`);
  assert(res.ok, `GET /api/leaderboard${query} returns 200 (got ${res.status})`);
  return (await res.json()) as {
    entries: Array<Record<string, unknown> & { handle: string; rank: number }>;
  };
}

async function main() {
  const suffix = Math.random().toString(36).slice(2, 8);
  const seed = [
    { handle: 'zz-test-A', streak: 5, durationMs: 30_000 },
    { handle: 'zz-test-B', streak: 9, durationMs: 50_000 },
    { handle: 'zz-test-C', streak: 9, durationMs: 40_000 },
    { handle: 'zz-test-D', streak: 2, durationMs: 10_000 },
  ];

  try {
    await db.insert(leaderboardEntries).values(
      seed.map((row) => ({
        ...row,
        runId: `test-script-${suffix}-${row.handle}`,
        clientId: TEST_CLIENT_ID,
      })),
    );

    console.log('1. Ordering: streak DESC, then duration ASC');
    const all = await getLeaderboard('?limit=100');
    const ours = all.entries.filter((e) => e.handle.startsWith('zz-test-'));
    assert(ours.length === 4, 'all 4 seeded entries are returned');
    assert(
      ours.map((e) => e.handle).join(',') === 'zz-test-C,zz-test-B,zz-test-A,zz-test-D',
      'C (streak 9, faster) ranks above B (streak 9, slower), then A, then D',
    );

    console.log('\n2. Ranks are 1-based and strictly increasing');
    const ranks = all.entries.map((e) => e.rank);
    assert(ranks[0] === 1, 'first entry has rank 1');
    assert(
      ranks.every((rank, i) => rank === i + 1),
      'ranks run 1..N with no gaps',
    );

    console.log('\n3. Private fields never appear in the response');
    const leaked = all.entries.some((e) => 'clientId' in e || 'runId' in e || 'id' in e);
    assert(!leaked, 'no entry contains clientId, runId, or id');

    console.log('\n4. The limit parameter');
    const one = await getLeaderboard('?limit=1');
    assert(one.entries.length === 1, 'limit=1 returns exactly one entry');
    const junk = await getLeaderboard('?limit=abc');
    assert(junk.entries.length <= 50, 'a non-numeric limit falls back to the default (50)');
    const negative = await getLeaderboard('?limit=-5');
    assert(negative.entries.length <= 50, 'a negative limit falls back to the default (50)');
    const huge = await getLeaderboard('?limit=100000');
    assert(huge.entries.length <= 100, 'an oversized limit is clamped to the max (100)');

    console.log('\nAll checks passed.');
  } finally {
    await db.delete(leaderboardEntries).where(eq(leaderboardEntries.clientId, TEST_CLIENT_ID));
    console.log('\n(Cleaned up test rows.)');
  }
}

main().catch((error) => {
  console.error('\n' + error.message);
  console.error('\n(Is `npm run dev` running in another terminal?)');
  process.exit(1);
});
