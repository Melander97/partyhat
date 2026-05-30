'use client';

import { useCallback, useEffect, useState } from 'react';
import { applyRun } from '@/lib/records/compare';
import { loadRecords, saveRecords } from '@/lib/records/storage';
import { EMPTY_RECORDS, type Records, type Run } from '@/lib/records/types';

/**
 * Tracks player records (highest streak and best run), backed by localStorage.
 *
 * Returns:
 *  - `records`: the current saved records (or EMPTY_RECORDS before mount / on first load)
 *  - `saveRun`: call this with a completed run; updates state + localStorage if it's a new record
 *  - `lastResult`: info about whether the most recent saveRun set a new record
 *    (null until the first saveRun call this session)
 *  - `mounted`: true once records have been read from localStorage. Use this to
 *    avoid showing "first run" UI before we know what's actually stored.
 */
export function useRecords() {
  const [records, setRecords] = useState<Records>(EMPTY_RECORDS);
  const [mounted, setMounted] = useState(false);
  const [lastResult, setLastResult] = useState<{
    newHighestStreak: boolean;
    newBestRun: boolean;
  } | null>(null);

  // Load records from localStorage on mount (client-only)
  useEffect(() => {
    setRecords(loadRecords());
    setMounted(true);
  }, []);

  const saveRun = useCallback(
    (run: Run) => {
      const result = applyRun(records, run);

      if (!result) {
        // No new record; clear any stale "last result" so UI doesn't re-show old flash
        setLastResult(null);
        return;
      }

      setRecords(result.updated);
      saveRecords(result.updated);
      setLastResult({
        newHighestStreak: result.newHighestStreak,
        newBestRun: result.newBestRun,
      });
    },
    [records],
  );

  return { records, saveRun, lastResult, mounted };
}
