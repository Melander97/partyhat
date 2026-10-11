import type { SubmitRequestBody, SubmitResponse } from '@/lib/leaderboard/api-types';

/**
 * A leaderboard submission that didn't go through. `status` is the HTTP
 * status, or 0 when the request never got an answer (offline, DNS failure).
 * `message` is already written for the player to read.
 */
export class SubmitRunError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'SubmitRunError';
  }
}

/**
 * Player-facing wording for each way a submission can fail. Deliberately
 * ignores the server's own error text: those messages are written for
 * developers ("Body must include a receipt (string)") and the form already
 * validates the handle before sending, so a 400 here is unexpected.
 */
export function describeSubmitFailure(status: number): string {
  switch (status) {
    case 0:
      return "Couldn't reach the server. Check your connection and try again.";
    case 400:
      return "That didn't look right. Check your name and try again.";
    case 401:
      return "This run couldn't be verified, so it can't be submitted.";
    case 409:
      return 'This run is already on the leaderboard.';
    case 410:
      return 'This run is too old to submit. Runs can be submitted for 10 minutes after they end.';
    case 422:
      return 'A run needs at least one correct guess to be submitted.';
    case 429:
      return 'Slow down a little and try again in a moment.';
    default:
      return status >= 500
        ? 'Something went wrong on our end. Try again.'
        : "This run can't be submitted.";
  }
}

/**
 * Whether trying the same submission again could plausibly work. Network
 * failures, a bad handle, rate limiting and server errors can all clear up;
 * a forged, duplicate, expired or empty run never will.
 */
export function isRetryableSubmitFailure(status: number): boolean {
  return status === 0 || status === 400 || status === 429 || status >= 500;
}

/** Submits a finished run. Throws SubmitRunError on any failure. */
export async function submitRun(body: SubmitRequestBody): Promise<SubmitResponse> {
  let res: Response;
  try {
    res = await fetch('/api/leaderboard/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new SubmitRunError(describeSubmitFailure(0), 0);
  }

  if (!res.ok) {
    throw new SubmitRunError(describeSubmitFailure(res.status), res.status);
  }

  try {
    return (await res.json()) as SubmitResponse;
  } catch {
    // A 200 with an unreadable body is the server's fault, not the player's.
    throw new SubmitRunError(describeSubmitFailure(500), 500);
  }
}
