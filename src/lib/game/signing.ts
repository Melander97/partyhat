import { createHmac, timingSafeEqual } from 'crypto';

/** The signature didn't match — malformed, tampered, or forged with a different secret. */
export class InvalidSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSignatureError';
  }
}

/** The signature was valid, but the payload's own `exp` has passed. */
export class ExpiredPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpiredPayloadError';
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
 * Signs any JSON-serializable payload that carries its own `exp` (epoch ms)
 * and `kind` (a literal tag identifying the payload type). Shared by
 * token.ts (in-progress run state) and receipt.ts (completed run proof) —
 * identical HMAC mechanics, but each caller decides its own TTL and payload
 * shape, so neither is baked in here.
 */
export function signPayload<T extends { exp: number; kind: string }>(payload: T): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

/**
 * Verifies a signed payload's signature, kind, and expiry, returning it if
 * valid. The `kind` check exists specifically so a valid-but-wrong-type
 * token (e.g. a live guess token, still unexpired) can't be handed to a
 * different verifier and accepted just because the signature is genuine —
 * a shared secret proves *who* signed something, not *what* it is.
 * Throws InvalidSignatureError (malformed / tampered / forged / wrong kind)
 * or ExpiredPayloadError.
 */
export function verifySignedPayload<T extends { exp: number; kind: string }>(
  token: string,
  expectedKind: T['kind'],
): T {
  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new InvalidSignatureError('Malformed token');
  }
  const [body, signature] = parts as [string, string];

  const expectedSignature = sign(body);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  // Length check first: timingSafeEqual throws on mismatched lengths rather
  // than returning false, and a tampered signature won't always be the same
  // length as the real one.
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    throw new InvalidSignatureError('Signature does not match — token was tampered with or forged');
  }

  let payload: T;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as T;
  } catch {
    throw new InvalidSignatureError('Token body is not valid JSON');
  }

  if (payload.kind !== expectedKind) {
    throw new InvalidSignatureError(
      `Expected a "${expectedKind}" token, got "${payload.kind ?? 'unknown'}"`,
    );
  }

  if (Date.now() > payload.exp) {
    throw new ExpiredPayloadError('Token has expired');
  }

  return payload;
}
