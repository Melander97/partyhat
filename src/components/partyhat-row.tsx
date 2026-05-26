'use client';

import { motion } from 'framer-motion';
import { Partyhat } from '@/components/partyhat';

const COLORS = ['red', 'yellow', 'blue', 'green', 'white', 'purple'] as const;

export function PartyhatRow() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-6">
      {COLORS.map((color, index) => (
        <motion.div
          key={color}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.5 + index * 0.08,
            type: 'spring',
            stiffness: 100,
            damping: 14,
          }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <Partyhat color={color} size={40} className="sm:scale-[1.4]" />
        </motion.div>
      ))}
    </div>
  );
}
