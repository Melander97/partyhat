/**
 * Verifies /api/game/start and /api/game/guess against a running dev
 * server. Requires `npm run dev` running in another terminal first \u2014
 * this can't be checked against your DB from a sandbox without your
 * DATABASE_URL, so it has to run here, against the real thing.
 *
 * Run: npx tsx scripts/test-game-routes.ts
 */
const BASE_URL = 'http://localhost:3000';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  \u2713 ${message}`);
}

async function main() {
  console.log('1. POST /api/game/start');
  const startRes = await fetch(`${BASE_URL}/api/game/start`, { method: 'POST' });
  assert(startRes.ok, `start route returns 200 (got ${startRes.status})`);
  const start = await startRes.json();

  assert(typeof start.anchor?.price === 'number', 'anchor has a numeric price');
  assert(
    start.mystery && !('price' in start.mystery),
    'mystery item has NO price field at all \u2014 the actual point of this refactor',
  );
  assert(typeof start.token === 'string' && start.token.includes('.'), 'a signed token is issued');
  assert(start.streak === 0, 'streak starts at 0');

  console.log('\n2. POST /api/game/guess with a real guess');
  const guessRes = await fetch(`${BASE_URL}/api/game/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: start.token, guess: 'higher' }),
  });
  assert(guessRes.ok, `guess route returns 200 (got ${guessRes.status})`);
  const guess = await guessRes.json();
  assert(typeof guess.correct === 'boolean', 'response says whether the guess was correct');
  assert(typeof guess.revealedPrice === 'number', 'the real price is revealed after guessing');

  if (guess.correct) {
    assert(typeof guess.token === 'string', 'a new token is issued to continue the run');
    assert(
      guess.nextMystery && !('price' in guess.nextMystery),
      'the NEXT mystery item also has no price field',
    );
  } else {
    assert(typeof guess.finalStreak === 'number', 'wrong guess returns a final streak');
    assert(typeof guess.durationMs === 'number', 'wrong guess returns a duration');
  }

  console.log('\n3. Tampered token is rejected');
  const tamperedToken = start.token.slice(0, -4) + 'xxxx';
  const tamperedRes = await fetch(`${BASE_URL}/api/game/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: tamperedToken, guess: 'higher' }),
  });
  assert(
    tamperedRes.status === 401,
    `tampered token is rejected with 401 (got ${tamperedRes.status})`,
  );

  console.log('\n4. Malformed body is rejected');
  const malformedRes = await fetch(`${BASE_URL}/api/game/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: start.token, guess: 'sideways' }),
  });
  assert(
    malformedRes.status === 400,
    `invalid guess direction is rejected with 400 (got ${malformedRes.status})`,
  );

  console.log('\nAll checks passed.');
}

main().catch((error) => {
  console.error('\n' + error.message);
  console.error('\n(Is `npm run dev` running in another terminal?)');
  process.exit(1);
});
