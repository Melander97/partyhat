export type Guess = 'higher' | 'lower';

/**
 * The single rule the whole game is built on. Shared between the client
 * reducer (for local/instant UI before the server-authoritative guess
 * endpoint exists) and the server guess route (the actual source of truth).
 * Equal prices always count as correct, matching the original client logic.
 */
export function isGuessCorrect(guess: Guess, anchorPrice: number, mysteryPrice: number): boolean {
  if (mysteryPrice === anchorPrice) return true;
  if (guess === 'higher') return mysteryPrice > anchorPrice;
  return mysteryPrice < anchorPrice;
}
