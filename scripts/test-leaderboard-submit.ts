/**
 * Verifies POST /api/leaderboard/submit against a running dev server.
 *
 * Mints its own run receipts using GAME_TOKEN_SECRET from your .env, so no
 * real game needs to be played. Test rows are tagged with a recognizable
 * clientId and deleted in a `finally` block, even if a check fails.
 *
 * Heads up: if your local DATABASE_URL points at the same Neon database as
 * production, the rows are briefly visible on the live leaderboard while
 * this runs.
 *
 * Requires `npm run dev` running in another terminal.
 * Run: npx tsx scripts/test-leaderboard-submit.ts
 */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/db';
import { leaderboardEntries } from '../src/db/schema';
import { issueRunReceipt } from '../src/lib/game/receipt';
import { issueGuessToken } from '../src/lib/game/token';

const BASE_URL = 'http://localhost:3000';
const TEST_CLIENT_ID = 'test-script-submit-0000';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function submit(body: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/api/leaderboard/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as Record<string, unknown>;
  return { status: res.status, json };
}

async function main() {
  const suffix = Math.random().toString(36).slice(2, 8);
  const receiptFor = (streak: number, durationMs: number, tag: string) =>
    issueRunReceipt({ runId: `test-submit-${suffix}-${tag}`, streak, durationMs });

  try {
    console.log('1. A valid submission is accepted');
    // Streak 100000 is far above anything real, so this entry is guaranteed rank 1.
    const goodReceipt = receiptFor(100_000, 42_000, 'good');
    const ok = await submit({
      receipt: goodReceipt,
      handle: '  zz  test   ',
      clientId: TEST_CLIENT_ID,
    });
    assert(ok.status === 200, `returns 200 (got ${ok.status})`);
    assert(
      ok.json.rank === 1,
      `reports rank 1 for an unbeatable streak (got ${String(ok.json.rank)})`,
    );
    assert(ok.json.handle === 'zz test', 'handle is stored normalized (trimmed, spaces collapsed)');
    assert(ok.json.streak === 100_000, 'streak comes from the receipt');

    console.log('\n2. The submitted run shows up on the public leaderboard');
    const board = await fetch(`${BASE_URL}/api/leaderboard?limit=1`);
    const boardJson = (await board.json()) as {
      entries: Array<{ handle: string; streak: number }>;
    };
    assert(
      boardJson.entries[0]?.handle === 'zz test' && boardJson.entries[0]?.streak === 100_000,
      'GET /api/leaderboard lists it first',
    );

    console.log('\n3. Submitting the same run twice is rejected');
    const again = await submit({
      receipt: goodReceipt,
      handle: 'zz other',
      clientId: TEST_CLIENT_ID,
    });
    assert(again.status === 409, `second submit returns 409 (got ${again.status})`);

    console.log('\n4. Streak and duration cannot be overridden from the body');
    const sneaky = await submit({
      receipt: receiptFor(3, 9_000, 'sneaky'),
      handle: 'zz sneaky',
      clientId: TEST_CLIENT_ID,
      streak: 999_999,
      durationMs: 1,
    });
    assert(sneaky.status === 200, `submission itself succeeds (got ${sneaky.status})`);
    assert(sneaky.json.streak === 3, "stored streak is the receipt's 3, not the body's 999999");
    assert(sneaky.json.durationMs === 9_000, "stored duration is the receipt's, not the body's");

    console.log('\n5. Forged and wrong-kind receipts are rejected');
    // Keep the genuine signature but swap in a payload claiming a different streak.
    const [receiptBody, receiptSignature] = goodReceipt.split('.') as [string, string];
    const originalPayload = JSON.parse(Buffer.from(receiptBody, 'base64url').toString());
    const tamperedBody = Buffer.from(JSON.stringify({ ...originalPayload, streak: 5 })).toString(
      'base64url',
    );
    const tampered = `${tamperedBody}.${receiptSignature}`;
    const forged = await submit({
      receipt: tampered,
      handle: 'zz forged',
      clientId: TEST_CLIENT_ID,
    });
    assert(forged.status === 401, `tampered receipt returns 401 (got ${forged.status})`);

    const liveGuessToken = issueGuessToken({
      runId: `test-submit-${suffix}-guesstoken`,
      anchorId: 1,
      mysteryId: 2,
      streak: 50,
      startedAt: Date.now(),
      seenItemIds: [1, 2],
    });
    const wrongKind = await submit({
      receipt: liveGuessToken,
      handle: 'zz wrongkind',
      clientId: TEST_CLIENT_ID,
    });
    assert(
      wrongKind.status === 401,
      `a live guess token is rejected as a receipt (got ${wrongKind.status})`,
    );

    console.log('\n6. A zero-streak run is rejected');
    const zero = await submit({
      receipt: receiptFor(0, 1_500, 'zero'),
      handle: 'zz zero',
      clientId: TEST_CLIENT_ID,
    });
    assert(zero.status === 422, `streak 0 returns 422 (got ${zero.status})`);

    console.log('\n7. Bad input is rejected before anything is stored');
    const badHandle = await submit({
      receipt: receiptFor(4, 8_000, 'badhandle'),
      handle: '<script>',
      clientId: TEST_CLIENT_ID,
    });
    assert(badHandle.status === 400, `invalid handle returns 400 (got ${badHandle.status})`);

    const noClient = await submit({
      receipt: receiptFor(4, 8_000, 'noclient'),
      handle: 'zz noclient',
    });
    assert(noClient.status === 400, `missing clientId returns 400 (got ${noClient.status})`);

    const notJson = await fetch(`${BASE_URL}/api/leaderboard/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'this is not json',
    });
    assert(notJson.status === 400, `non-JSON body returns 400 (got ${notJson.status})`);

    console.log('\n8. Rejected submissions left nothing behind');
    const stored = await db
      .select({ handle: leaderboardEntries.handle })
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.clientId, TEST_CLIENT_ID));
    const handles = stored.map((row) => row.handle).sort();
    assert(
      handles.join(',') === 'zz sneaky,zz test',
      `only the 2 accepted runs were stored (found: ${handles.join(', ')})`,
    );

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
