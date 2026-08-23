/**
 * Verifies the signed guess-token round-trips correctly before anything
 * is built on top of it: valid tokens verify, tampered tokens are rejected,
 * and expired tokens are rejected.
 *
 * Run: npx tsx scripts/test-guess-token.ts
 * You can delete this script once you've confirmed it passes \u2014 same as
 * the earlier test-db.ts.
 */
import 'dotenv/config';
import {
  issueGuessToken,
  verifyGuessToken,
  InvalidTokenError,
  ExpiredTokenError,
  type GuessTokenPayload,
} from '../src/lib/game/token';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  \u2713 ${message}`);
}

async function main() {
  const basePayload: Omit<GuessTokenPayload, 'exp'> = {
    runId: 'test-run-123',
    anchorId: 1038,
    mysteryId: 1042,
    streak: 3,
    startedAt: Date.now(),
    seenItemIds: [1038, 1040, 1041],
  };

  console.log('1. Issue a token and verify it round-trips');
  const token = issueGuessToken(basePayload);
  const verified = verifyGuessToken(token);
  assert(verified.runId === basePayload.runId, 'runId survives round-trip');
  assert(verified.streak === basePayload.streak, 'streak survives round-trip');
  assert(
    JSON.stringify(verified.seenItemIds) === JSON.stringify(basePayload.seenItemIds),
    'seenItemIds survives round-trip',
  );

  console.log('\n2. Reject a tampered payload (streak bumped client-side)');
  const [, signature] = token.split('.');
  const tamperedPayload = { ...verified, streak: 9999 };
  const tamperedBody = Buffer.from(JSON.stringify(tamperedPayload)).toString('base64url');
  const tamperedToken = `${tamperedBody}.${signature}`;
  try {
    verifyGuessToken(tamperedToken);
    throw new Error('FAILED: tampered token was accepted');
  } catch (error) {
    assert(error instanceof InvalidTokenError, 'tampered streak is rejected as InvalidTokenError');
  }

  console.log('\n3. Reject a malformed token');
  try {
    verifyGuessToken('not-a-real-token');
    throw new Error('FAILED: malformed token was accepted');
  } catch (error) {
    assert(error instanceof InvalidTokenError, 'malformed token is rejected as InvalidTokenError');
  }

  console.log('\n4. Reject a token signed with a different secret');
  const originalSecret = process.env.GAME_TOKEN_SECRET;
  process.env.GAME_TOKEN_SECRET = 'a-completely-different-secret';
  const forgedToken = issueGuessToken(basePayload);
  process.env.GAME_TOKEN_SECRET = originalSecret;
  try {
    verifyGuessToken(forgedToken);
    throw new Error('FAILED: forged token was accepted');
  } catch (error) {
    assert(error instanceof InvalidTokenError, 'token signed with wrong secret is rejected');
  }

  console.log('\n5. Reject an expired token');
  // Can't wait 60s in a test script \u2014 forge an already-expired payload
  // using the same body/sign shape verifyGuessToken expects.
  const expiredPayload: GuessTokenPayload = { ...basePayload, exp: Date.now() - 1000 };
  const expiredBody = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const { createHmac } = await import('crypto');
  const expiredSig = createHmac('sha256', process.env.GAME_TOKEN_SECRET!)
    .update(expiredBody)
    .digest('base64url');
  const expiredToken = `${expiredBody}.${expiredSig}`;
  try {
    verifyGuessToken(expiredToken);
    throw new Error('FAILED: expired token was accepted');
  } catch (error) {
    assert(error instanceof ExpiredTokenError, 'expired token is rejected as ExpiredTokenError');
  }

  console.log('\nAll checks passed.');
}

main().catch((error) => {
  console.error('\n' + error.message);
  process.exit(1);
});
