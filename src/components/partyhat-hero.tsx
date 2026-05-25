'use client';

import { motion } from 'framer-motion';

export function PartyHatHero() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, rotate: -15 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.1 }}
      className="relative"
    >
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="A red partyhat — the iconic OSRS status item"
      >
        {/* Partyhat — simplified geometric version */}
        <polygon points="60,15 35,95 85,95" fill="var(--color-accent-red)" />
        <polygon points="60,15 35,95 60,95" fill="var(--color-accent-red)" opacity="0.85" />
        {/* Highlight stripe */}
        <line x1="60" y1="15" x2="60" y2="95" stroke="#ffffff" strokeWidth="1" opacity="0.15" />
        {/* Sparkles */}
        <circle cx="95" cy="35" r="2" fill="var(--color-accent)" />
        <circle cx="25" cy="55" r="1.5" fill="var(--color-accent)" />
        <circle cx="100" cy="70" r="1" fill="var(--color-accent)" />
      </motion.svg>
    </motion.div>
  );
}
