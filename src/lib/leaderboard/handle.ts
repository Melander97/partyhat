import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 12;

/** Letters, digits, spaces, underscores, hyphens. ASCII only, which also rules out lookalike-unicode impersonation and invisible characters. */
const ALLOWED_CHARACTERS = /^[A-Za-z0-9 _-]+$/;
const HAS_LETTER_OR_DIGIT = /[A-Za-z0-9]/;

/**
 * Built once at module load: compiling the word list is the expensive part,
 * matching is cheap. The recommended transformers see through the usual
 * disguises (leetspeak like "sh1t", lookalike characters, repeated letters),
 * and the dataset is built to avoid flagging innocent words that merely
 * contain a bad one ("Scunthorpe", "Assassin", "Classic").
 */
const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

/**
 * Checks the handle as typed and again with the separators removed, because
 * "f_u_c_k" and "f u c k" slip past a matcher that sees the letters apart.
 * Stripping can occasionally join two innocent words into a flagged one; for
 * a public display name, declining that is the cheaper mistake.
 */
function isProfane(handle: string): boolean {
  return (
    profanityMatcher.hasMatch(handle) || profanityMatcher.hasMatch(handle.replace(/[ _-]/g, ''))
  );
}

export type HandleResult = { ok: true; handle: string } | { ok: false; error: string };

/**
 * Validates and normalizes a player-chosen leaderboard handle.
 *
 * Normalization happens first (trim the ends, collapse runs of spaces), so
 * the stored value is exactly what gets displayed and "  Iron   Man " and
 * "Iron Man" become the same handle. Takes `unknown` because it's handed
 * raw request-body data, and checks the type itself rather than trusting it.
 *
 * Profanity is checked last, once the handle is known to be well-formed.
 * No word list is perfect: an occasional innocent name will be declined
 * (for example places that contain a flagged word), and a determined
 * player can still find a spelling that gets through. This is a speed bump
 * for casual abuse, not moderation; the leaderboard still needs a way to
 * remove entries by hand.
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

  if (isProfane(handle)) {
    return { ok: false, error: "That name isn't allowed. Try a different one." };
  }

  return { ok: true, handle };
}
