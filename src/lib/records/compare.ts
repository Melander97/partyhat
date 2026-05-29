import type { Records, Run } from './types';

/**
 * Did this run beat the player's records? If so, returns the updated records.
 * If not, returns null (so callers can detect "no change" vs "new record").
 *
 * A new record is set if:
 *  - The run's streak exceeds the previous highest streak, OR
 *  - The run's streak matches the best-run's streak but in less time.
 *
 * Note: highestStreak and bestRun can update independently.
 *   - A short fast streak might beat the best run's time but not the highest streak.
 *   - A long slow streak might raise the highest streak but not improve the best run.
 */
export function applyRun(
  records: Records,
  run: Run,
): { updated: Records; newHighestStreak: boolean; newBestRun: boolean } | null {
  const newHighestStreak = run.streak > records.highestStreak;
  const newBestRun = isBetterRun(run, records.bestRun);

  if (!newHighestStreak && !newBestRun) {
    return null;
  }

  return {
    updated: {
      ...records,
      highestStreak: newHighestStreak ? run.streak : records.highestStreak,
      bestRun: newBestRun ? run : records.bestRun,
    },
    newHighestStreak,
    newBestRun,
  };
}

/**
 * Pure comparison: is `candidate` a better run than `current`?
 * "Better" = higher streak, or same streak in less time.
 */
function isBetterRun(candidate: Run, current: Run | null): boolean {
  if (!current) return true; // any run beats no run
  if (candidate.streak > current.streak) return true;
  if (candidate.streak === current.streak && candidate.timeMs < current.timeMs) {
    return true;
  }
  return false;
}
