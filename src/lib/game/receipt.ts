import {
  signPayload,
  verifySignedPayload,
  InvalidSignatureError,
  ExpiredPayloadError,
} from '@/lib/game/signing';

/**
 * Signed proof that a run genuinely ended with this streak and duration —
 * issued by the guess route the moment a run ends (wrong guess, or the pool
 * exhausted on a correct one), and required by the leaderboard submit route
 * instead of trusting a client-supplied streak/duration directly.
 */
export interface RunReceiptPayload {
  kind: 'run-receipt';
  runId: string;
  streak: number;
  durationMs: number;
  exp: number;
}

// Longer than the guess token's 60s TTL — this needs to survive the player
// actually choosing a handle and hitting submit, not just one guess.
const RECEIPT_TTL_MS = 10 * 60_000;

export class InvalidReceiptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReceiptError';
  }
}

export class ExpiredReceiptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpiredReceiptError';
  }
}

export function issueRunReceipt(payload: Omit<RunReceiptPayload, 'exp' | 'kind'>): string {
  return signPayload<RunReceiptPayload>({
    ...payload,
    kind: 'run-receipt',
    exp: Date.now() + RECEIPT_TTL_MS,
  });
}

/**
 * Verifies a receipt's signature, kind, and expiry, returning its payload
 * if valid. Throws InvalidReceiptError (malformed / tampered / wrong kind —
 * including a live guess token being handed in by mistake or on purpose) or
 * ExpiredReceiptError.
 */
export function verifyRunReceipt(receipt: string): RunReceiptPayload {
  try {
    return verifySignedPayload<RunReceiptPayload>(receipt, 'run-receipt');
  } catch (error) {
    if (error instanceof ExpiredPayloadError) throw new ExpiredReceiptError(error.message);
    if (error instanceof InvalidSignatureError) throw new InvalidReceiptError(error.message);
    throw error;
  }
}
