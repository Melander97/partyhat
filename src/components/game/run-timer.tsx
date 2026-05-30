'use client';

import { useEffect, useState } from 'react';

interface RunTimerProps {
  /** Timestamp (Date.now() ms) when the run started. Null = run hasn't begun. */
  startedAt: number | null;
  /** Final elapsed time at game-over. When set, timer freezes here instead of ticking live. */
  finalElapsedMs: number | null;
}

export function RunTimer({ startedAt, finalElapsedMs }: RunTimerProps) {
  // Local tick state — updates every 100ms while a run is active.
  // Stored as a number purely to trigger re-renders; the value itself is just `Date.now()`.
  const [, setTick] = useState(0);

  useEffect(() => {
    // Only tick if a run is actively in progress (started, not yet ended)
    if (startedAt === null || finalElapsedMs !== null) return;

    const interval = setInterval(() => {
      setTick(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, [startedAt, finalElapsedMs]);

  // Decide what to display
  const elapsedMs =
    finalElapsedMs !== null ? finalElapsedMs : startedAt !== null ? Date.now() - startedAt : 0;

  return (
    <p className="text-text-muted font-mono text-sm tabular-nums" aria-label="Run time">
      {formatElapsed(elapsedMs)}
    </p>
  );
}

/** Formats ms as "M:SS.t" — minutes, seconds, tenths of a second. */
function formatElapsed(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}
