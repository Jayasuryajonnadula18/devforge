'use client';

import React from 'react';
import { motion } from 'motion/react';

interface TypographicWallProps {
  words?: string[];
  className?: string;
  speed?: number;
}

export const TypographicWall: React.FC<TypographicWallProps> = ({
  words = [
    'LOCK-FREE QUEUES',
    'MERKLE COMMIT DAG',
    'MEMORY RUNTIME',
    'CONCURRENCY HARNESS',
    'DETERMINISTIC INVARIANTS',
    'AST PARSER',
    'ZERO ESCAPE ALLOCATIONS',
  ],
  className = '',
  speed = 45,
}) => {
  return (
    <div className={`overflow-hidden select-none pointer-events-none opacity-15 ${className}`}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
        className="flex whitespace-nowrap text-[13vw] font-display font-bold tracking-tight text-white/40 leading-none"
      >
        <span>{words.join(' · ')} · </span>
        <span>{words.join(' · ')} · </span>
      </motion.div>
    </div>
  );
};

export default TypographicWall;
