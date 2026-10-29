'use client';

import React from 'react';

export const HypothesisSection: React.FC = () => {
  return (
    <section 
      id="hypothesis" 
      aria-label="The Working Hypothesis"
      className="w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-white/[0.08] bg-[#07080a]"
    >
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Section Lead */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span>01 // The Working Hypothesis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-sans font-medium text-white tracking-tight leading-[1.2]">
            Tutorials teach syntax,<br className="hidden sm:inline" /> but not how it matters in the real world.
          </h2>
          <p className="text-lg sm:text-xl text-neutral-400 font-normal leading-relaxed max-w-2xl">
            You can write a query that works. Understanding how it behaves in a real application is a different skill.
          </p>
        </div>

        {/* Hypothesis Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/[0.08]">
          
          <div className="space-y-2.5">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
              Observation 01
            </span>
            <h3 className="text-base font-medium text-white">
              The Syntax Plateau
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Standard tutorials measure progress by correct syntax and passing toy tests. But knowing the keywords of a language rarely equips you to architect a system.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
              Observation 02
            </span>
            <h3 className="text-base font-medium text-white">
              The Production Disconnect
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Real software runs with network latency, concurrent writes, memory limits, and hardware failures. Tutorials isolate code from these realities, making real engineering feel foreign.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
              Observation 03
            </span>
            <h3 className="text-base font-medium text-white">
              The Research Question
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We are asking: does building small, functional replicas of real systems from scratch build lasting engineering intuition where syntax exercises fail?
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
