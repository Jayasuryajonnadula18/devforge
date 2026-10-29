'use client';

import React from 'react';

interface VisionVsRealitySectionProps {
  onOpenPrototype?: () => void;
}

export const VisionVsRealitySection: React.FC<VisionVsRealitySectionProps> = ({ onOpenPrototype }) => {
  return (
    <section 
      id="exploration" 
      aria-label="Vision and Current Stage"
      className="w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-white/[0.08] bg-[#07080a]"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span>02 // Direction &amp; Reality</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-sans font-medium text-white tracking-tight leading-snug">
            What we are exploring versus where things stand today.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl">
            To be completely transparent: DevForge is an idea with early design prototypes, not an established commercial school or finished SaaS platform.
          </p>
        </div>

        {/* Comparison Grid: Vision vs Current Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Column A: The Intended Vision */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-5">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              The Intended Direction
            </div>
            <h3 className="text-lg font-medium text-white">
              Learn systems by building real components.
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-neutral-500 font-mono text-xs mt-0.5">•</span>
                <span>
                  <strong>Build real primitives:</strong> Rather than solving isolated algorithmic puzzles, write small functional versions of databases, mini-git, or event queues.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-neutral-500 font-mono text-xs mt-0.5">•</span>
                <span>
                  <strong>Observe failure modes:</strong> See how code actually behaves under network packet loss, race conditions, and disk serialization.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-neutral-500 font-mono text-xs mt-0.5">•</span>
                <span>
                  <strong>Systems intuition first:</strong> Prioritize deep understanding of memory, concurrency, and architecture over superficial framework syntax.
                </span>
              </li>
            </ul>
          </div>

          {/* Column B: Current Reality */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-5">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Current Project Stage
            </div>
            <h3 className="text-lg font-medium text-white">
              Early concept and validation phase.
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-neutral-500 font-mono text-xs mt-0.5">•</span>
                <span>
                  <strong>Not a finished platform:</strong> We do not have courses for sale, commercial tiers, subscriptions, or enterprise offerings.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-neutral-500 font-mono text-xs mt-0.5">•</span>
                <span>
                  <strong>Early workstation prototype:</strong> We have built an initial prototype studio interface to experiment with multi-file code editing and test harnesses.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-neutral-500 font-mono text-xs mt-0.5">•</span>
                <span>
                  <strong>Active research:</strong> We are listening to developers and educators to determine whether this learning philosophy truly solves an educational gap.
                </span>
              </li>
            </ul>

            {onOpenPrototype && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenPrototype}
                  className="inline-flex items-center gap-2 text-xs font-mono text-white hover:text-neutral-300 underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Inspect the early workstation prototype →
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
