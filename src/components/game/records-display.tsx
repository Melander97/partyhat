'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Records } from '@/lib/records/types';

interface RecordsDisplayProps {
  records: Records;
  /**
   * If set, indicates which categories were just beaten and should flash
   * a "New record!" message. Null means no new record this run.
   */
  newRecord: { newHighestStreak: boolean; newBestRun: boolean } | null;
}

export function RecordsDisplay({ records, newRecord }: RecordsDisplayProps) {
  // First-time player: nothing to compare against, render nothing
  const prefersReducedMotion = useReducedMotion();
  if (records.highestStreak === 0 && records.bestRun === null) {
    return null;
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: prefersReducedMotion ? 0.4 : 1.0, duration: 0.4 }}
      className="border-border bg-bg-panel/60 flex flex-col items-center gap-3 rounded-md border px-6 py-4"
    >
      <p className="text-text-muted text-xs tracking-wider uppercase">Your records</p>

      <div className="flex items-center gap-8">
        <RecordStat
          label="Highest streak"
          value={records.highestStreak.toString()}
          isNew={newRecord?.newHighestStreak ?? false}
        />

        {records.bestRun && (
          <RecordStat
            label="Best run"
            value={`${records.bestRun.streak} in ${formatBestRunTime(records.bestRun.timeMs)}`}
            isNew={newRecord?.newBestRun ?? false}
          />
        )}
      </div>
    </motion.div>
  );
}

interface RecordStatProps {
  label: string;
  value: string;
  isNew: boolean;
}

function RecordStat({ label, value, isNew }: RecordStatProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-text-muted text-xs">{label}</p>
      <p className={`text-base font-semibold ${isNew ? 'text-accent' : 'text-text'}`}>{value}</p>
      {isNew && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 18 }}
          className="text-accent text-xs font-semibold tracking-wider uppercase"
        >
          New!
        </motion.p>
      )}
    </div>
  );
}

function formatBestRunTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}
