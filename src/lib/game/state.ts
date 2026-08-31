import type { Guess } from '@/lib/game/rules';
import type { GuessResponse, HiddenItem } from '@/lib/game/api-types';
import type { Item } from '@/types/item';

export type { Guess };

export type Phase = 'guessing' | 'revealed' | 'over';

/** The next round's data, prefetched as part of a correct guess response so
 * clicking "Next" is instant — no second network round-trip per round. */
interface PendingNext {
  anchor: Item;
  mystery: HiddenItem;
  token: string;
}

export interface GameState {
  anchor: Item;
  mystery: HiddenItem;
  phase: Phase;
  streak: number;
  lastGuess: Guess | null;
  lastGuessCorrect: boolean | null;
  /** The mystery item's real price, once the server has revealed it. */
  revealedPrice: number | null;
  /** True while a guess is in flight — used to disable the buttons. */
  submitting: boolean;
  /** True only for the (very unlikely) case where the item pool was fully
   * exhausted on a correct guess — a win, not a loss, so the game-over
   * screen shouldn't show a "wrong" verdict. */
  wonByExhaustion: boolean;
  startedAt: number | null;
  finalElapsedMs: number | null;
  /** Signed token for the *current* guessing round. Sent with the next guess. */
  token: string;
  pendingNext: PendingNext | null;
  /** A brief user-facing note, e.g. after an idle-token expiry auto-restart. */
  notice: string | null;
}

export type GameAction =
  | { type: 'started'; anchor: Item; mystery: HiddenItem; token: string; notice?: string }
  | { type: 'guessSubmitted'; guess: Guess }
  | { type: 'guessResolved'; result: GuessResponse }
  | { type: 'next' }
  | { type: 'dismissNotice' };

export function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  if (action.type === 'started') {
    return {
      anchor: action.anchor,
      mystery: action.mystery,
      phase: 'guessing',
      streak: 0,
      lastGuess: null,
      lastGuessCorrect: null,
      revealedPrice: null,
      submitting: false,
      wonByExhaustion: false,
      // Starts now, matching the server — the token's startedAt was already
      // stamped at the /api/game/start call this is a response to.
      startedAt: Date.now(),
      finalElapsedMs: null,
      token: action.token,
      pendingNext: null,
      notice: action.notice ?? null,
    };
  }

  if (state === null) return null;

  switch (action.type) {
    case 'guessSubmitted': {
      if (state.phase !== 'guessing' || state.submitting) return state;
      return { ...state, submitting: true, lastGuess: action.guess };
    }

    case 'guessResolved': {
      if (!state.submitting) return state;
      const { result } = action;

      if (!result.correct) {
        return {
          ...state,
          phase: 'over',
          submitting: false,
          lastGuessCorrect: false,
          wonByExhaustion: false,
          revealedPrice: result.revealedPrice,
          finalElapsedMs: result.durationMs,
        };
      }

      if (result.poolExhausted) {
        return {
          ...state,
          phase: 'over',
          submitting: false,
          lastGuessCorrect: true,
          wonByExhaustion: true,
          revealedPrice: result.revealedPrice,
          streak: result.finalStreak,
          finalElapsedMs: result.durationMs,
        };
      }

      return {
        ...state,
        phase: 'revealed',
        submitting: false,
        lastGuessCorrect: true,
        revealedPrice: result.revealedPrice,
        streak: result.streak,
        pendingNext: {
          anchor: result.nextAnchor,
          mystery: result.nextMystery,
          token: result.token,
        },
      };
    }

    case 'next': {
      if (state.phase !== 'revealed' || !state.pendingNext) return state;
      const { anchor, mystery, token } = state.pendingNext;
      return {
        ...state,
        anchor,
        mystery,
        token,
        phase: 'guessing',
        lastGuess: null,
        lastGuessCorrect: null,
        revealedPrice: null,
        pendingNext: null,
      };
    }

    case 'dismissNotice': {
      return { ...state, notice: null };
    }

    default:
      return state;
  }
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
