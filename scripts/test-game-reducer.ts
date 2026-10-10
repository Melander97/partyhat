/**
 * Verifies the game reducer's handling of the run receipt: it is absent
 * during play, captured when a run ends (wrong guess or pool exhausted),
 * and cleared when a new run starts. Pure function, so no database or dev
 * server needed.
 *
 * Run: npx tsx scripts/test-game-reducer.ts
 */
import { gameReducer, type GameAction, type GameState } from '../src/lib/game/state';
import type { Item } from '../src/types/item';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

const anchor: Item = { id: 1, name: 'Anchor', price: 1000, iconUrl: 'https://example.test/a.png' };
const mystery = { id: 2, name: 'Mystery', iconUrl: 'https://example.test/b.png' };

function run(actions: GameAction[]): GameState {
  let state: GameState | null = null;
  for (const action of actions) {
    state = gameReducer(state, action);
  }
  if (state === null) throw new Error('reducer returned null');
  return state;
}

const started: GameAction = { type: 'started', anchor, mystery, token: 'token-1' };
const guessed: GameAction = { type: 'guessSubmitted', guess: 'higher' };

console.log('1. A new run has no receipt');
assert(run([started]).receipt === null, 'receipt is null right after a run starts');

console.log('\n2. A correct guess does not produce a receipt (the run is still going)');
const afterCorrect = run([
  started,
  guessed,
  {
    type: 'guessResolved',
    result: {
      correct: true,
      revealedPrice: 2000,
      streak: 1,
      nextAnchor: { ...mystery, price: 2000 },
      nextMystery: { id: 3, name: 'Next', iconUrl: 'https://example.test/c.png' },
      token: 'token-2',
    },
  },
]);
assert(afterCorrect.phase === 'revealed', 'phase moves to revealed');
assert(afterCorrect.receipt === null, 'receipt stays null mid-run');

console.log('\n3. A wrong guess captures the receipt');
const afterWrong = run([
  started,
  guessed,
  {
    type: 'guessResolved',
    result: {
      correct: false,
      revealedPrice: 500,
      finalStreak: 0,
      durationMs: 1234,
      receipt: 'receipt-wrong',
    },
  },
]);
assert(afterWrong.phase === 'over', 'phase moves to over');
assert(afterWrong.receipt === 'receipt-wrong', 'the receipt from the response is stored');
assert(afterWrong.finalElapsedMs === 1234, 'duration is still stored alongside it');

console.log('\n4. Exhausting the item pool on a correct guess also captures the receipt');
const afterExhausted = run([
  started,
  guessed,
  {
    type: 'guessResolved',
    result: {
      correct: true,
      poolExhausted: true,
      revealedPrice: 2000,
      finalStreak: 7,
      durationMs: 9999,
      receipt: 'receipt-exhausted',
    },
  },
]);
assert(afterExhausted.phase === 'over', 'phase moves to over');
assert(afterExhausted.receipt === 'receipt-exhausted', 'the receipt from the response is stored');
assert(afterExhausted.streak === 7, 'final streak is stored');

console.log("\n5. Starting a new run clears the previous run's receipt");
const restarted = run([
  started,
  guessed,
  {
    type: 'guessResolved',
    result: {
      correct: false,
      revealedPrice: 500,
      finalStreak: 0,
      durationMs: 1234,
      receipt: 'receipt-old',
    },
  },
  { type: 'started', anchor, mystery, token: 'token-fresh' },
]);
assert(restarted.phase === 'guessing', 'a fresh run is back in the guessing phase');
assert(
  restarted.receipt === null,
  'the old receipt is gone, so it can never attach to the new run',
);

console.log('\nAll checks passed.');
