import { CURRENT_SCHEMA_VERSION, EMPTY_RECORDS, type Records } from './types';

const STORAGE_KEY = 'partyhat:records';

/**
 * Loads records from localStorage, handling all the failure modes:
 *  - localStorage doesn't exist (SSR, private browsing in some browsers)
 *  - Key doesn't exist (first-time player)
 *  - JSON is malformed (corruption, manual editing)
 *  - Schema version is older than current (run migrations)
 *  - Schema version is newer than current (user downgraded? play it safe)
 *
 * Returns EMPTY_RECORDS as a safe fallback in all failure cases.
 */
export function loadRecords(): Records {
  // SSR / no localStorage available
  if (typeof window === 'undefined' || !window.localStorage) {
    return EMPTY_RECORDS;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return EMPTY_RECORDS;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupted JSON \u2014 reset to empty
    return EMPTY_RECORDS;
  }

  // Type-check the parsed value before migrating
  if (!isRecordsLike(parsed)) {
    return EMPTY_RECORDS;
  }

  return migrate(parsed);
}

/**
 * Saves records to localStorage. Silently no-ops if localStorage is unavailable.
 */
export function saveRecords(records: Records): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Quota exceeded or other write failure \u2014 fail silently
    // The game still works; just won't persist this run
  }
}

/**
 * Bring an arbitrary records-shaped object up to the current schema version.
 * Add a new case here for each schema bump.
 */
function migrate(records: { version: number }): Records {
  // Current version: nothing to do
  if (records.version === CURRENT_SCHEMA_VERSION) {
    return records as Records;
  }

  // Future migrations go here, e.g.:
  //   if (records.version === 1) { records = migrateV1ToV2(records); }
  //   if (records.version === 2) { records = migrateV2ToV3(records); }

  // Unknown / newer version \u2014 reset to safe state.
  // Could also try to "see" the data, but resetting is safest.
  return EMPTY_RECORDS;
}

/**
 * Narrow `unknown` to "looks like a records object" before we trust it.
 * Doesn't deeply validate, just enough to safely pass into migration.
 */
function isRecordsLike(value: unknown): value is { version: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof (value as { version: unknown }).version === 'number'
  );
}
