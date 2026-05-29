'use client';

import { useEffect } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

interface FinalStreakNumberProps {
  value: number;
}

export function FinalStreakNumber({ value }: FinalStreakNumberProps) {
  const count = useMotionValue(0);
  const displayed = useTransform(count, (latest) => `${Math.round(latest)}`);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.7,
      ease: 'easeOut',
      delay: 0.8,
    });
    return () => controls.stop();
  }, [value, count]);

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 250, damping: 22 }}
      className="font-display text-accent text-5xl leading-none font-bold"
    >
      {displayed}
    </motion.span>
  );
}
