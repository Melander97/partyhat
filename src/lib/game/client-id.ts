const STORAGE_KEY = 'partyhat:client-id';

/**
 * Loads the anonymous per-browser client id, or null if one hasn't been
 * generated yet (first visit) or localStorage isn't available (SSR, some
 * private-browsing modes).
 */
export function loadClientId(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  return window.localStorage.getItem(STORAGE_KEY);
}

/**
 * Saves the client id. Silently no-ops if localStorage is unavailable or
 * the write fails (quota, private browsing) — a fresh id will just be
 * generated again next visit, which is an acceptable fallback here.
 */
export function saveClientId(id: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Quota exceeded or other write failure — fail silently.
  }
}
