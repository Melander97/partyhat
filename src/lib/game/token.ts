import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Stateless, server-signed representation of an in-progress game run.
 *
 * The client holds this as an opaque string between guesses and echoes it
 * back on every request. The server verifies + re-issues it each step,
 * instead of keeping a DB row per in-progress run. Anything in here is
 * trusted by the server purely because the signature checks out \u2014 never
 * because the client claims it.
 */
export interface GuessTokenPayload {
  /** Random id tying together every guess in one run. Not secret \u2014 just a correlation id. */
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

function getSecret(): string {
  const secret = process.env.GAME_TOKEN_SECRET;
  if (!secret) {
    throw new Error('GAME_TOKEN_SECRET is not set');
  }
  return secret;
}

function sign(body: string): string {
  return createHmac('sha256', getSecret()).update(body).digest('base64url');
}

/**
 * Signs a new token. Callers provide everything except `exp`, which this
 * function sets based on TOKEN_TTL_MS.
 */
export function issueGuessToken(payload: Omit<GuessTokenPayload, 'exp'>): string {
  const full: GuessTokenPayload = { ...payload, exp: Date.now() + TOKEN_TTL_MS };
  const body = Buffer.from(JSON.stringify(full)).toString('base64url');
  return `${body}.${sign(body)}`;
}

/**
 * Verifies a token's signature and expiry, returning its payload if valid.
 * Throws InvalidTokenError (malformed / tampered) or ExpiredTokenError.
 */
export function verifyGuessToken(token: string): GuessTokenPayload {
  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new InvalidTokenError('Malformed token');
  }
  const [body, signature] = parts as [string, string];

  const expectedSignature = sign(body);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  // Length check first: timingSafeEqual throws on mismatched lengths rather
  // than returning false, and a tampered signature won't always be the same
  // length as the real one.
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    throw new InvalidTokenError(
      'Signature does not match \u2014 token was tampered with or forged',
    );
  }

  let payload: GuessTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as GuessTokenPayload;
  } catch {
    throw new InvalidTokenError('Token body is not valid JSON');
  }

  if (Date.now() > payload.exp) {
    throw new ExpiredTokenError('Token has expired');
  }

  return payload;
}
