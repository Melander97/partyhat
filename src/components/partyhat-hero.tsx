'use client';

import { motion } from 'framer-motion';
import { Partyhat } from '@/components/partyhat';

export function PartyHatHero() {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0, rotate: -8 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 12, delay: 0.1 }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Partyhat color="red" size={240} />
      </motion.div>
    </motion.div>
  );
}
