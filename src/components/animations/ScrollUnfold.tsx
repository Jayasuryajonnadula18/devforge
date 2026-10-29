'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ScrollUnfoldProps {
  children: React.ReactNode;
  className?: string;
  initialRotateX?: number;
  unfoldOrigin?: 'top' | 'bottom';
  showCrease?: boolean;
}

export const ScrollUnfold: React.FC<ScrollUnfoldProps> = ({
  children,
  className = '',
  initialRotateX = 18,
  unfoldOrigin = 'top',
  showCrease = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generous offset window allowing spring physics to breathe
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 100%', 'start 68%'],
  });

  // Balanced critically-damped spring for buttery smooth uncreasing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.65,
  });

  // Dimensional 3D Space Transforms
  const rotateX = useTransform(
    smoothProgress,
    [0, 1],
    [unfoldOrigin === 'top' ? initialRotateX : -initialRotateX, 0]
  );
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0.25, 0.8, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.96, 1]);
  const y = useTransform(smoothProgress, [0, 1], [40, 0]);
  const creaseWidth = useTransform(smoothProgress, [0, 0.7, 1], ['0%', '75%', '100%']);
  
  // Ambient specular lighting wash that dissipates as surface faces the screen
  const ambientSheenOpacity = useTransform(smoothProgress, [0, 0.6, 1], [0.45, 0.15, 0]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: 1600 }}
    >
      <motion.div
        style={{
          rotateX,
          opacity,
          scale,
          y,
          transformOrigin: unfoldOrigin === 'top' ? 'top center' : 'bottom center',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
        className="relative"
      >
        {/* Unfolding Crease Horizon Line */}
        {showCrease && (
          <motion.div
            style={{ width: creaseWidth }}
            className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20"
          />
        )}

        {/* Ambient Specular Surface Wash (Dissolves as fold uncreases) */}
        <motion.div
          style={{ opacity: ambientSheenOpacity }}
          className="pointer-events-none absolute inset-0 z-10 rounded-inherit bg-gradient-to-b from-white/[0.06] via-transparent to-black/30 transition-opacity"
        />

        {children}
      </motion.div>
    </div>
  );
};
