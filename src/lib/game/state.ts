import type { Item } from '@/types/item';
import { getRandomItem, getRandomItemExcept, getRandomPair } from '@/lib/items';

/**
 * The phases a single round goes through:
 *  - 'guessing':  player sees the anchor's price, mystery's price hidden, waiting for guess
 *  - 'revealed':  guess submitted, mystery's price revealed, waiting for "next" or showing game over
 *  - 'over':      player guessed wrong on the last round; final streak shown
 */
export type Phase = 'guessing' | 'revealed' | 'over';

export type Guess = 'higher' | 'lower';

export interface GameState {
  /** The item on the left \u2014 the "known" item whose price is visible */
  anchor: Item;
  /** The item on the right \u2014 the one being guessed about */
  mystery: Item;
  /** Current round phase */
  phase: Phase;
  /** Number of correct guesses in a row this run */
  streak: number;
  /** The guess the player just made (only set when phase === 'revealed' or 'over') */
  lastGuess: Guess | null;
  /** Whether the last guess was correct (only meaningful when phase !== 'guessing') */
  lastGuessCorrect: boolean | null;
}

export type GameAction = { type: 'guess'; guess: Guess } | { type: 'next' } | { type: 'restart' };

/**
 * Returns the initial state for a fresh game.
 * Called on mount and on restart.
 */
export function createInitialState(): GameState {
  const [anchor, mystery] = getRandomPair();
  return {
    anchor,
    mystery,
    phase: 'guessing',
    streak: 0,
    lastGuess: null,
    lastGuessCorrect: null,
  };
}

/**
 * The core game reducer \u2014 pure function from (state, action) to new state.
 * All game rules live here. The UI just dispatches actions and renders state.
 */
export function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  // Initial null state \u2014 only 'restart' can populate it
  if (state === null) {
    if (action.type === 'restart') return createInitialState();
    return null;
  }

  switch (action.type) {
    case 'guess': {
      // Ignore guesses if we're not in the guessing phase
      // (e.g., button-spam during reveal animation)
      if (state.phase !== 'guessing') return state;

      const correct = isGuessCorrect(action.guess, state.anchor.price, state.mystery.price);

      return {
        ...state,
        phase: correct ? 'revealed' : 'over',
        lastGuess: action.guess,
        lastGuessCorrect: correct,
        streak: correct ? state.streak + 1 : state.streak,
      };
    }

    case 'next': {
      // Only valid from the 'revealed' phase (i.e., after a correct guess)
      if (state.phase !== 'revealed') return state;

      // Mystery becomes new anchor, fresh mystery appears
      const newAnchor = state.mystery;
      const newMystery = getRandomItemExcept(newAnchor);

      return {
        anchor: newAnchor,
        mystery: newMystery,
        phase: 'guessing',
        streak: state.streak,
        lastGuess: null,
        lastGuessCorrect: null,
      };
    }

    case 'restart': {
      return createInitialState();
    }
  }
}

/**
 * Pure helper: given a guess and two prices, did the player guess correctly?
 * Tie (equal prices) counts as correct per our design.
 */
function isGuessCorrect(guess: Guess, anchorPrice: number, mysteryPrice: number): boolean {
  if (mysteryPrice === anchorPrice) return true;
  if (guess === 'higher') return mysteryPrice > anchorPrice;
  return mysteryPrice < anchorPrice;
}

/**
 * Returns a short comment based on the player's final streak.
 * Designed to add personality without being condescending on low scores.
 */
export function getStreakComment(streak: number): string {
  if (streak === 0) return 'Tough start. Try again.';
  if (streak < 3) return 'Just warming up.';
  if (streak < 6) return 'Solid.';
  if (streak < 10) return 'Nice run.';
  if (streak < 15) return 'Impressive.';
  if (streak < 25) return 'You know your prices.';
  if (streak < 50) return 'Outstanding.';
  if (streak < 100) return 'Did you High Alch the wiki?';
  return 'B0aty is that you?';
}
