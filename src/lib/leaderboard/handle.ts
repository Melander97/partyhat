export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 12;

/** Letters, digits, spaces, underscores, hyphens. ASCII only, which also rules out lookalike-unicode impersonation and invisible characters. */
const ALLOWED_CHARACTERS = /^[A-Za-z0-9 _-]+$/;
const HAS_LETTER_OR_DIGIT = /[A-Za-z0-9]/;

export type HandleResult = { ok: true; handle: string } | { ok: false; error: string };

/**
 * Validates and normalizes a player-chosen leaderboard handle.
 *
 * Normalization happens first (trim the ends, collapse runs of spaces), so
 * the stored value is exactly what gets displayed and "  Iron   Man " and
 * "Iron Man" become the same handle. Takes `unknown` because it's handed
 * raw request-body data, and checks the type itself rather than trusting it.
 *
 * Deliberately NOT handled yet: profanity filtering. That's a separate
 * concern with real trade-offs (word lists, false positives) and is
 * tracked as its own follow-up.
 */
export function validateHandle(raw: unknown): HandleResult {
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Handle must be text' };
  }

  const handle = raw.trim().replace(/ +/g, ' ');

  if (handle.length < HANDLE_MIN_LENGTH) {
    return { ok: false, error: `Handle must be at least ${HANDLE_MIN_LENGTH} characters` };
  }
  if (handle.length > HANDLE_MAX_LENGTH) {
    return { ok: false, error: `Handle must be at most ${HANDLE_MAX_LENGTH} characters` };
  }
  if (!ALLOWED_CHARACTERS.test(handle)) {
    return {
      ok: false,
      error: 'Handle can only contain letters, numbers, spaces, underscores and hyphens',
    };
  }
  if (!HAS_LETTER_OR_DIGIT.test(handle)) {
    return { ok: false, error: 'Handle must contain at least one letter or number' };
  }

  return { ok: true, handle };
}
