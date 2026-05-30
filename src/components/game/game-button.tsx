'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentProps } from 'react';

type GameButtonProps = ComponentProps<typeof motion.button> & {
  variant?: 'primary' | 'secondary';
};

export function GameButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: GameButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseStyles =
    'relative rounded-md px-8 py-3 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50';

  const variantStyles =
    variant === 'primary'
      ? 'bg-accent text-bg shadow-[0_2px_0_rgba(184,134,11,0.4)] hover:brightness-110 active:translate-y-[1px] active:shadow-[0_1px_0_rgba(184,134,11,0.4)]'
      : 'border border-border bg-bg-panel text-text hover:border-accent hover:text-accent active:translate-y-[1px]';

  return (
    <motion.button
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
