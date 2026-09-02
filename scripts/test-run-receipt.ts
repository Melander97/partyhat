/**
 * Verifies the run-receipt round-trips correctly: valid receipts verify,
 * tampered ones are rejected, and expired ones are rejected.
 *
 * Run: npx tsx scripts/test-run-receipt.ts
 */
import 'dotenv/config';
import {
  issueRunReceipt,
  verifyRunReceipt,
  InvalidReceiptError,
  ExpiredReceiptError,
  type RunReceiptPayload,
} from '../src/lib/game/receipt';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function main() {
  const basePayload: Omit<RunReceiptPayload, 'exp' | 'kind'> = {
    runId: 'test-run-456',
    streak: 17,
    durationMs: 45_230,
  };

  console.log('1. Issue a receipt and verify it round-trips');
  const receipt = issueRunReceipt(basePayload);
  const verified = verifyRunReceipt(receipt);
  assert(verified.runId === basePayload.runId, 'runId survives round-trip');
  assert(verified.streak === basePayload.streak, 'streak survives round-trip');
  assert(verified.durationMs === basePayload.durationMs, 'durationMs survives round-trip');
  assert(verified.kind === 'run-receipt', 'kind is stamped as run-receipt');

  console.log('\n2. Reject a tampered payload (streak bumped client-side)');
  const [, signature] = receipt.split('.');
  const tamperedPayload = { ...verified, streak: 99999 };
  const tamperedBody = Buffer.from(JSON.stringify(tamperedPayload)).toString('base64url');
  const tamperedReceipt = `${tamperedBody}.${signature}`;
  try {
    verifyRunReceipt(tamperedReceipt);
    throw new Error('FAILED: tampered receipt was accepted');
  } catch (error) {
    assert(
      error instanceof InvalidReceiptError,
      'tampered streak is rejected as InvalidReceiptError',
    );
  }

  console.log('\n3. Reject a malformed receipt');
  try {
    verifyRunReceipt('not-a-real-receipt');
    throw new Error('FAILED: malformed receipt was accepted');
  } catch (error) {
    assert(
      error instanceof InvalidReceiptError,
      'malformed receipt is rejected as InvalidReceiptError',
    );
  }

  console.log('\n4. Reject an expired receipt');
  const expiredPayload: RunReceiptPayload = {
    ...basePayload,
    kind: 'run-receipt',
    exp: Date.now() - 1000,
  };
  const expiredBody = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const { createHmac } = await import('crypto');
  const expiredSig = createHmac('sha256', process.env.GAME_TOKEN_SECRET!)
    .update(expiredBody)
    .digest('base64url');
  const expiredReceipt = `${expiredBody}.${expiredSig}`;
  try {
    verifyRunReceipt(expiredReceipt);
    throw new Error('FAILED: expired receipt was accepted');
  } catch (error) {
    assert(
      error instanceof ExpiredReceiptError,
      'expired receipt is rejected as ExpiredReceiptError',
    );
  }

  console.log('\n5. A live guess token must NOT be usable as a run receipt');
  // This is the actual exploit the `kind` discriminator exists to close:
  // without it, a still-unexpired guess token — trivially available to any
  // player mid-run — would pass signature verification here too, since it's
  // signed with the same secret. That would let someone submit their
  // CURRENT streak as if the run had already ended, before ever losing.
  const { issueGuessToken } = await import('../src/lib/game/token');
  const guessToken = issueGuessToken({
    runId: 'test-run-456',
    anchorId: 1,
    mysteryId: 2,
    streak: 50,
    startedAt: Date.now(),
    seenItemIds: [1, 2],
  });
  try {
    verifyRunReceipt(guessToken);
    throw new Error('FAILED: a guess token was accepted as a run receipt');
  } catch (error) {
    assert(
      error instanceof InvalidReceiptError,
      'a live guess token is correctly rejected when presented as a receipt',
    );
  }

  console.log('\nAll checks passed.');
}

main().catch((error) => {
  console.error('\n' + error.message);
  process.exit(1);
});
