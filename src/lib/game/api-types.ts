import type { Item } from '@/types/item';

/** The mystery item as sent to the client — note there is no `price` key at all. */
export type HiddenItem = Omit<Item, 'price'>;

export interface StartResponse {
  anchor: Item;
  mystery: HiddenItem;
  streak: 0;
  token: string;
}

export interface StartErrorResponse {
  error: string;
}

export type CorrectGuessResponse = {
  correct: true;
  poolExhausted?: false;
  revealedPrice: number;
  streak: number;
  nextAnchor: Item;
  nextMystery: HiddenItem;
  token: string;
};

export type PoolExhaustedResponse = {
  correct: true;
  poolExhausted: true;
  revealedPrice: number;
  finalStreak: number;
  durationMs: number;
  /** Signed proof the run legitimately ended this way — required by the leaderboard submit route. */
  receipt: string;
};

export type WrongGuessResponse = {
  correct: false;
  revealedPrice: number;
  finalStreak: number;
  durationMs: number;
  /** Signed proof the run legitimately ended this way — required by the leaderboard submit route. */
  receipt: string;
};

export type GuessResponse = CorrectGuessResponse | PoolExhaustedResponse | WrongGuessResponse;

export interface GuessErrorResponse {
  error: string;
}
