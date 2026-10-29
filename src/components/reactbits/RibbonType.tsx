'use client';

import React from 'react';
import { motion } from 'motion/react';

interface RibbonTypeProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

/**
 * RibbonType
 * Continuous 3D perspective kinetic ribbon stream of architectural tokens.
 */
export const RibbonType: React.FC<RibbonTypeProps> = ({
  items,
  direction = 'left',
  speed = 28,
  className = '',
}) => {
  const content = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden py-3 select-none pointer-events-none ${className}`}>
      {/* Edge gradient masks */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0c0d10] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0c0d10] to-transparent z-10 pointer-events-none" />

      {/* Kinetic Infinite Ribbon Track */}
      <motion.div
        className="flex gap-8 whitespace-nowrap will-change-transform"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {content.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-6 text-xs uppercase tracking-[0.25em] font-mono text-neutral-400 font-medium"
          >
            <span className="hover:text-white transition-colors duration-200">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
