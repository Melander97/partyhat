import type { Item } from '@/types/item';
import { getRandomItem, getRandomItemExcept, getRandomPair } from '@/lib/items';

export type Phase = 'guessing' | 'revealed' | 'over';

export type Guess = 'higher' | 'lower';

export interface GameState {
  anchor: Item;
  mystery: Item;
  phase: Phase;
  streak: number;
  lastGuess: Guess | null;
  lastGuessCorrect: boolean | null;
  /**
   * Timestamp (Date.now() ms) when the run started \u2014 set on the first guess.
   * Null until the player makes their first move.
   */
  startedAt: number | null;
  /**
   * Final elapsed time in ms, frozen at the moment of game-over.
   * Null until the game ends. The live timer during play is computed from
   * `startedAt` in the UI rather than stored in state, to avoid storing
   * a value that changes every frame.
   */
  finalElapsedMs: number | null;
}

export type GameAction = { type: 'guess'; guess: Guess } | { type: 'next' } | { type: 'restart' };

export function createInitialState(): GameState {
  const [anchor, mystery] = getRandomPair();
  return {
    anchor,
    mystery,
    phase: 'guessing',
    streak: 0,
    lastGuess: null,
    lastGuessCorrect: null,
    startedAt: null,
    finalElapsedMs: null,
  };
}

export function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  if (state === null) {
    if (action.type === 'restart') return createInitialState();
    return null;
  }

  switch (action.type) {
    case 'guess': {
      if (state.phase !== 'guessing') return state;

      const correct = isGuessCorrect(action.guess, state.anchor.price, state.mystery.price);

      // Start the timer on the very first guess of the run (when startedAt is still null)
      const startedAt = state.startedAt ?? Date.now();

      // On a wrong guess, freeze the final elapsed time
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

      const newAnchor = state.mystery;
      const newMystery = getRandomItemExcept(newAnchor);

      return {
        anchor: newAnchor,
        mystery: newMystery,
        phase: 'guessing',
        streak: state.streak,
        lastGuess: null,
        lastGuessCorrect: null,
        startedAt: state.startedAt, // preserve across rounds
        finalElapsedMs: null, // not over yet
      };
    }

    case 'restart': {
      return createInitialState();
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
  return 'Did you High alch the wiki?';
}
