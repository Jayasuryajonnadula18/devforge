'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LetterSwapProps {
  label: string;
  className?: string;
  stagger?: number;
  duration?: number;
  onClick?: () => void;
}

export const LetterSwap: React.FC<LetterSwapProps> = ({
  label,
  className = '',
  stagger = 0.025,
  duration = 0.35,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const letters = label.split('');

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex items-center cursor-pointer select-none overflow-hidden ${className}`}
      style={{ perspective: 800 }}
    >
      {letters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block w-1.5">&nbsp;</span>;
        }

        return (
          <span
            key={index}
            className="relative inline-block overflow-hidden h-[1.3em] leading-[1.3em]"
          >
            {/* Front Letter */}
            <motion.span
              animate={
                isHovered
                  ? { y: '-100%', rotateX: 90, opacity: 0 }
                  : { y: '0%', rotateX: 0, opacity: 1 }
              }
              transition={{
                duration,
                delay: index * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block origin-bottom"
            >
              {char}
            </motion.span>

            {/* Back Swapped Letter */}
            <motion.span
              animate={
                isHovered
                  ? { y: '0%', rotateX: 0, opacity: 1 }
                  : { y: '100%', rotateX: -90, opacity: 0 }
              }
              transition={{
                duration,
                delay: index * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 block origin-top font-semibold text-white"
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

export default LetterSwap;
