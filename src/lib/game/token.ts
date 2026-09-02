import {
  signPayload,
  verifySignedPayload,
  InvalidSignatureError,
  ExpiredPayloadError,
} from '@/lib/game/signing';

/**
 * Stateless, server-signed representation of an in-progress game run.
 *
 * The client holds this as an opaque string between guesses and echoes it
 * back on every request. The server verifies + re-issues it each step,
 * instead of keeping a DB row per in-progress run. Anything in here is
 * trusted by the server purely because the signature checks out — never
 * because the client claims it.
 */
export interface GuessTokenPayload {
  kind: 'guess-token';
  /** Random id tying together every guess in one run. Not secret — just a correlation id. */
  runId: string;
  anchorId: number;
  mysteryId: number;
  streak: number;
  /** Epoch ms when the run started. Powers the time-tiebreaker on the leaderboard. */
  startedAt: number;
  /** Items already used this run, so a fresh mystery item never repeats one already shown. */
  seenItemIds: number[];
  /** Epoch ms. Short-lived and refreshed on every valid guess. */
  exp: number;
}

const TOKEN_TTL_MS = 60_000;

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class ExpiredTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpiredTokenError';
  }
}

/**
 * Signs a new token. Callers provide everything except `exp`/`kind`, which
 * this function sets.
 */
export function issueGuessToken(payload: Omit<GuessTokenPayload, 'exp' | 'kind'>): string {
  return signPayload<GuessTokenPayload>({
    ...payload,
    kind: 'guess-token',
    exp: Date.now() + TOKEN_TTL_MS,
  });
}

/**
 * Verifies a token's signature, kind, and expiry, returning its payload if
 * valid. Throws InvalidTokenError (malformed / tampered / wrong kind) or
 * ExpiredTokenError.
 */
export function verifyGuessToken(token: string): GuessTokenPayload {
  try {
    return verifySignedPayload<GuessTokenPayload>(token, 'guess-token');
  } catch (error) {
    if (error instanceof ExpiredPayloadError) throw new ExpiredTokenError(error.message);
    if (error instanceof InvalidSignatureError) throw new InvalidTokenError(error.message);
    throw error;
  }
}
