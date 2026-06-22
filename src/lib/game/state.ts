import type { Item } from '@/types/item';

export type Phase = 'guessing' | 'revealed' | 'over';

export type Guess = 'higher' | 'lower';

export interface GameState {
  anchor: Item;
  mystery: Item;
  phase: Phase;
  streak: number;
  lastGuess: Guess | null;
  lastGuessCorrect: boolean | null;
  startedAt: number | null;
  finalElapsedMs: number | null;
  /** Items available for future rounds. Doesn't include anchor or mystery. */
  pool: Item[];
}

export type GameAction =
  | { type: 'guess'; guess: Guess }
  | { type: 'next' }
  | { type: 'restart'; pool: Item[] };

/**
 * Pulls one item from a pool, returning [item, remainingPool].
 * Throws if the pool is empty \u2014 callers must guard against that.
 */
function takeOne(pool: Item[]): { taken: Item; rest: Item[] } {
  if (pool.length === 0) {
    throw new Error('takeOne called with empty pool');
  }
  const index = Math.floor(Math.random() * pool.length);
  const taken = pool[index]!;
  const rest = [...pool.slice(0, index), ...pool.slice(index + 1)];
  return { taken, rest };
}

export function createInitialState(pool: Item[]): GameState {
  if (pool.length < 2) {
    throw new Error(`createInitialState needs at least 2 items, got ${pool.length}`);
  }

  const first = takeOne(pool);
  const second = takeOne(first.rest);

  return {
    anchor: first.taken,
    mystery: second.taken,
    phase: 'guessing',
    streak: 0,
    lastGuess: null,
    lastGuessCorrect: null,
    startedAt: null,
    finalElapsedMs: null,
    pool: second.rest,
  };
}

export function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  if (state === null) {
    if (action.type === 'restart') return createInitialState(action.pool);
    return null;
  }

  switch (action.type) {
    case 'guess': {
      if (state.phase !== 'guessing') return state;

      const correct = isGuessCorrect(action.guess, state.anchor.price, state.mystery.price);

      const startedAt = state.startedAt ?? Date.now();
      const finalElapsedMs = correct ? null : Date.now() - startedAt;

      return {
        ...state,
        phase: correct ? 'revealed' : 'over',
        lastGuess: action.guess,
        lastGuessCorrect: correct,
        streak: correct ? state.streak + 1 : state.streak,
        startedAt,
        finalElapsedMs,
      };
    }

    case 'next': {
      if (state.phase !== 'revealed') return state;

      // Pool exhausted \u2014 player has cleared every item we pre-fetched.
      // For now: end the game. Future work could re-fetch.
      if (state.pool.length === 0) {
        return {
          ...state,
          phase: 'over',
          finalElapsedMs: state.startedAt ? Date.now() - state.startedAt : 0,
        };
      }

      const { taken: newMystery, rest } = takeOne(state.pool);

      return {
        ...state,
        anchor: state.mystery,
        mystery: newMystery,
        phase: 'guessing',
        lastGuess: null,
        lastGuessCorrect: null,
        pool: rest,
      };
    }

    case 'restart': {
      return createInitialState(action.pool);
    }
  }
}

function isGuessCorrect(guess: Guess, anchorPrice: number, mysteryPrice: number): boolean {
  if (mysteryPrice === anchorPrice) return true;
  if (guess === 'higher') return mysteryPrice > anchorPrice;
  return mysteryPrice < anchorPrice;
}

export function getStreakComment(streak: number): string {
  if (streak === 0) return 'Tough start. Try again.';
  if (streak < 3) return 'Just warming up.';
  if (streak < 6) return 'Solid.';
  if (streak < 10) return 'Nice run.';
  if (streak < 15) return 'Impressive.';
  if (streak < 25) return 'You know your prices.';
  if (streak < 50) return 'Outstanding.';
  if (streak < 100) return 'B0aty is that you?';
  return 'Are you sure you’re not a wiki editor?';
}
