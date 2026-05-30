'use client';

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

interface FinalStreakNumberProps {
  value: number;
}

export function FinalStreakNumber({ value }: FinalStreakNumberProps) {
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(prefersReducedMotion ? value : 0);
  const displayed = useTransform(count, (latest) => `${Math.round(latest)}`);

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 0.7,
      ease: 'easeOut',
      delay: 0.8,
    });
    return () => controls.stop();
  }, [value, prefersReducedMotion, count]);

  return (
    <motion.span
      initial={prefersReducedMotion ? false : { scale: 0.85, opacity: 0 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
      transition={{
        delay: prefersReducedMotion ? 0.4 : 0.8,
        type: prefersReducedMotion ? 'tween' : 'spring',
        stiffness: 250,
        damping: 22,
        duration: prefersReducedMotion ? 0.2 : undefined,
      }}
      className="font-display text-accent text-5xl leading-none font-bold"
    >
      {displayed}
    </motion.span>
  );
}
