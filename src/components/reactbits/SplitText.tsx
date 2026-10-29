'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  by?: 'chars' | 'words';
  ease?: string;
  direction?: 'slide-left' | 'slide-up';
  autoPlay?: boolean;
  onComplete?: () => void;
  timeline?: gsap.core.Timeline | null;
  timelinePosition?: number | string;
}

/**
 * React Bits SplitText component:
 * High-performance, accessible text split animation.
 * Splits text into individual character spans while keeping full semantic accessibility
 * (screen readers read the clean unfragmented string via aria-label).
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.55,
  stagger = 0.03,
  by = 'chars',
  ease = 'power3.out',
  direction = 'slide-left',
  autoPlay = true,
  onComplete,
  timeline = null,
  timelinePosition = '+=0',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const elementsRef = useRef<HTMLSpanElement[]>([]);

  // Split lines if text contains newline characters
  const lines = text.split('\n');

  useEffect(() => {
    const chars = elementsRef.current.filter(Boolean);
    if (!chars.length) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(chars, { opacity: 1, x: 0, y: 0 });
      if (onComplete) onComplete();
      return;
    }

    // Initial state based on direction
    const initialProps =
      direction === 'slide-left'
        ? { opacity: 0, x: -32, y: 0 }
        : { opacity: 0, x: 0, y: 28 };

    gsap.set(chars, initialProps);

    const targetProps = {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      stagger,
      ease,
      onComplete,
    };

    if (timeline) {
      timeline.to(chars, targetProps, timelinePosition);
    } else if (autoPlay) {
      gsap.to(chars, {
        ...targetProps,
        delay,
      });
    }
  }, [duration, stagger, ease, delay, direction, autoPlay, onComplete, timeline, timelinePosition]);

  return (
    <span
      ref={containerRef}
      className={`inline-block select-text ${className}`}
      aria-label={text.replace(/\n/g, ' ')}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-visible py-0.5">
          {by === 'words' ? (
            line.split(' ').map((word, wordIdx) => (
              <span
                key={wordIdx}
                ref={(el) => {
                  if (el) elementsRef.current.push(el);
                }}
                className="inline-block mr-[0.25em] will-change-transform"
                aria-hidden="true"
              >
                {word}
              </span>
            ))
          ) : (
            line.split(' ').map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.22em]">
                {word.split('').map((char, charIdx) => (
                  <span
                    key={charIdx}
                    ref={(el) => {
                      if (el) elementsRef.current.push(el);
                    }}
                    className="inline-block will-change-transform"
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))
          )}
        </span>
      ))}
    </span>
  );
};
