'use client';

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { formatGP } from '@/lib/format';

interface RevealedPriceProps {
  value: number;
  className?: string;
}

export function RevealedPrice({ value, className }: RevealedPriceProps) {
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(prefersReducedMotion ? value : 0);
  const displayed = useTransform(count, (latest) => `${formatGP(Math.round(latest))} gp`);

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 0.7,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [value, prefersReducedMotion, count]);

  return <motion.span className={className}>{displayed}</motion.span>;
}
