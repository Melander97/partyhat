/**
 * Records of the player's best performances, persisted to localStorage.
 *
 * Schema is versioned so future changes (e.g., adding per-milestone records)
 * can be migrated cleanly rather than wiping users' progress.
 */

/** Current schema version. Bump and add migration logic when shape changes. */
export const CURRENT_SCHEMA_VERSION = 1;

/** A single completed run \u2014 the streak the player achieved and how long it took. */
export interface Run {
  streak: number;
  timeMs: number;
}

/** The full records object stored in localStorage. */
export interface Records {
  version: number;
  highestStreak: number;
  bestRun: Run | null;
}

/** Default records for a player with no saved data yet. */
export const EMPTY_RECORDS: Records = {
  version: CURRENT_SCHEMA_VERSION,
  highestStreak: 0,
  bestRun: null,
};
