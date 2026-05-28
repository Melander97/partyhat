'use client';

import { motion } from 'framer-motion';

interface VerdictBadgeProps {
  /** Whether the player's guess was correct */
  correct: boolean;
}

export function VerdictBadge({ correct }: VerdictBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 18,
        delay: 0.6,
      }}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold ${
        correct
          ? 'border border-green-500/30 bg-green-500/15 text-green-400'
          : 'border border-red-500/30 bg-red-500/15 text-red-400'
      }`}
    >
      {correct ? (
        <>
          <span aria-hidden="true">✓</span>
          <span>Correct</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">✗</span>
          <span>Wrong</span>
        </>
      )}
    </motion.div>
  );
}
