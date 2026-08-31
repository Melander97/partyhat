import type {
  StartResponse,
  StartErrorResponse,
  GuessResponse,
  GuessErrorResponse,
} from '@/lib/game/api-types';
import type { Guess } from '@/lib/game/rules';

/**
 * A run's token expired (idle tab past the TTL) or one of its items dropped
 * out of the pool mid-run. Both are expected, recoverable conditions — the
 * caller should quietly start a new run, not show an error screen.
 */
export class RunExpiredError extends Error {}

/**
 * Anything else the server rejected the request for: a malformed body, a
 * tampered/invalid token, no items available at all. These aren't expected
 * to happen from normal play, so callers should let them bubble up.
 */
export class GameApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'GameApiError';
  }
}

export async function startRun(): Promise<StartResponse> {
  const res = await fetch('/api/game/start', { method: 'POST' });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Unknown error' }))) as StartErrorResponse;
    throw new GameApiError(body.error, res.status);
  }

  return (await res.json()) as StartResponse;
}

export async function submitGuess(token: string, guess: Guess): Promise<GuessResponse> {
  const res = await fetch('/api/game/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, guess }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Unknown error' }))) as GuessErrorResponse;
    if (res.status === 410 || res.status === 409) {
      throw new RunExpiredError(body.error);
    }
    throw new GameApiError(body.error, res.status);
  }

  return (await res.json()) as GuessResponse;
}
