'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SpeedingTextProps {
  text: string;
  className?: string;
  speed?: number; // visual velocity tilt
  glow?: boolean;
}

/**
 * SpeedingText / RibbonType
 * Kinetic velocity typographic component featuring dynamic directional motion blur,
 * italicized velocity skew, and trailing photonic ghosting on hover or scroll.
 */
export const SpeedingText: React.FC<SpeedingTextProps> = ({
  text,
  className = '',
  speed = 1,
  glow = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center group cursor-pointer select-none overflow-visible ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ghosting chromatic velocity trail 1 (Leftward trail) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 select-none transition-all duration-300 ease-out text-cyan-400/30 ${
          isHovered
            ? '-translate-x-3 -skew-x-12 blur-[2px] opacity-70'
            : '-translate-x-1 -skew-x-6 blur-[1px] opacity-20'
        }`}
      >
        {text}
      </span>

      {/* Ghosting chromatic velocity trail 2 (Rightward chromatic aberration) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 select-none transition-all duration-300 ease-out text-purple-400/25 ${
          isHovered
            ? 'translate-x-2 -skew-x-12 blur-[3px] opacity-60'
            : 'translate-x-0.5 -skew-x-6 blur-[1px] opacity-15'
        }`}
      >
        {text}
      </span>

      {/* Primary Crisp Kinetic Text with spring physics */}
      <motion.span
        animate={{
          skewX: isHovered ? -14 : -6,
          scale: isHovered ? 1.04 : 1,
          letterSpacing: isHovered ? '0.04em' : '0.01em',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative z-10 inline-block font-mono tracking-tight font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]`}
      >
        {text}
      </motion.span>

      {/* Speed lines / Kinetic velocity sparks */}
      <span
        className={`pointer-events-none absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-x-110 blur-[0.5px]' : 'opacity-30 scale-x-75'
        }`}
      />
    </span>
  );
};
