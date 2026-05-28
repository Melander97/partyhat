'use client';

import { useEffect } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';
import { formatGP } from '@/lib/format';

interface RevealedPriceProps {
  /** The final price to count up to */
  value: number;
  /** When true, the price counts up from 0. When false, shows instantly. */
  animate?: boolean;
  /** Optional className for layout/positioning */
  className?: string;
}

export function RevealedPrice({
  value,
  animate: shouldAnimate = true,
  className,
}: RevealedPriceProps) {
  // A motion value holds an animated number that doesn't trigger re-renders.
  // We animate THIS, then derive the displayed string from it.
  const count = useMotionValue(0);

  // useTransform creates a derived motion value \u2014 here, a formatted string
  // that updates every frame as `count` animates.
  const displayed = useTransform(count, (latest) => `${formatGP(Math.round(latest))} gp`);

  useEffect(() => {
    if (!shouldAnimate) {
      // Skip animation \u2014 jump straight to final value
      count.set(value);
      return;
    }

    // Animate from 0 to the target value
    const controls = animate(count, value, {
      duration: 0.7,
      ease: 'easeOut',
    });

    // Cleanup: stop the animation if the component unmounts or value changes mid-animation
    return () => controls.stop();
  }, [value, shouldAnimate, count]);

  return <motion.span className={className}>{displayed}</motion.span>;
}
