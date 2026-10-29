'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Zap, 
  Flame, 
  RefreshCw,
  Bug,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ProblemDiagnostic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compare' | 'tutorial' | 'production'>('compare');
  const [isSimulatingCrash, setIsSimulatingCrash] = useState(false);
  const [trafficLoad, setTrafficLoad] = useState<'low' | 'high' | 'surge'>('low');

  const handleSimulateCrash = () => {
    setIsSimulatingCrash(true);
    setTrafficLoad('surge');
    setTimeout(() => {
      setIsSimulatingCrash(false);
    }, 2800);
  };

  return (
    <div className="w-full space-y-12">
      {/* Apple-grade Diagnostic Split Console */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#07080c]/90 overflow-hidden backdrop-blur-2xl shadow-2xl">
        {/* Top Hardware Frame Bezel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.015] gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
            <span className="text-xs font-mono tracking-wider text-neutral-400">
              DEVFORGE // ARCHITECTURAL_AUTOPSY // SYS_DIAGNOSTIC
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-neutral-500">EXPERIENCE COMPARISON:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-neutral-300 border border-white/[0.08]">
              Passive Video vs Production Systems
            </span>
          </div>
        </div>

        {/* Side-by-Side Dual Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {/* ================= LEFT: THE TUTORIAL MIRAGE ================= */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-gradient-to-b from-white/[0.01] to-transparent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                    The Tutorial Mirage
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">
                  42h 18m Course Watched
                </span>
              </div>

              <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
                Watching an instructor type creates an illusion of mastery. Code runs smoothly because every edge case was rehearsed and edited out.
              </p>

              {/* Mock Video Player Scrubber UI */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#030406] p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    <span className="text-neutral-200">Lecture 48: "Building a Production App"</span>
                  </div>
                  <span className="text-emerald-400 font-medium">100% Watched</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400/80 w-full" />
                </div>

                {/* Trivial Tutorial Code Snippet */}
                <div className="pt-2 text-neutral-400 text-[12px] leading-relaxed">
                  <div><span className="text-neutral-600"># Typical tutorial: copy-paste without friction</span></div>
                  <div><span className="text-blue-400">def</span> <span className="text-yellow-300">handle_request</span>(user_id):</div>
                  <div className="pl-4"><span className="text-purple-400">return</span> db.find(user_id) <span className="text-neutral-600"># No connection pool, no lock, no timeout</span></div>
                </div>
              </div>

              {/* Diagnostic Metrics Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.015] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Cognitive Friction
                  </div>
                  <div className="text-base font-mono font-semibold text-neutral-300">
                    0.0% <span className="text-xs font-normal text-neutral-500">(Passive)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.015] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Retained Mental Model
                  </div>
                  <div className="text-base font-mono font-semibold text-amber-400/90">
                    &lt; 5% <span className="text-xs font-normal text-neutral-500">(Fades in 48h)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-xs font-sans text-neutral-500 leading-relaxed">
              <span className="text-neutral-300 font-medium">The Result:</span> When given a blank editor with no video to pause, 92% of learners freeze.
            </div>
          </div>

          {/* ================= RIGHT: THE PRODUCTION REALITY ================= */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-gradient-to-b from-rose-500/[0.02] to-transparent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                    The Production Reality
                  </span>
                </div>
                <span className="text-[11px] font-mono text-rose-400/90 font-medium">
                  3:14 AM Incident
                </span>
              </div>

              <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
                Real software operates in hostile conditions: concurrency contention, memory spikes, and distributed race conditions.
              </p>

              {/* Simulated Live Incident Terminal */}
              <div className="rounded-2xl border border-rose-500/20 bg-[#060405] p-4 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400 text-[11px] pb-1 border-b border-white/[0.05]">
                  <div className="flex items-center space-x-2 text-rose-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>SYSTEM_ERROR // WORKER_STARVATION</span>
                  </div>
                  <span className="text-rose-400 font-medium">CRITICAL</span>
                </div>

                <div className="space-y-1 text-[11px] leading-relaxed text-neutral-300">
                  <div className="text-neutral-500">Traceback (most recent call last):</div>
                  <div className="text-rose-300/90 pl-2">
                    DeadlockDetected: 8 workers starved on unbuffered channel
                  </div>
                  <div className="text-neutral-400 pl-2">
                    InvariantViolation: Monotonic TTL clock drifted by +3400ms
                  </div>
                  <div className="text-amber-300/80 pl-2">
                    MemoryLeakWarning: 18,400 orphaned file descriptors lingering
                  </div>
                </div>
              </div>

              {/* Diagnostic Metrics Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    System State
                  </div>
                  <div className="text-base font-mono font-semibold text-rose-400">
                    DEGRADED
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.015] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Tutorial Preparedness
                  </div>
                  <div className="text-base font-mono font-semibold text-rose-300/80">
                    0% <span className="text-xs font-normal text-neutral-500">(Never taught)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Crash Simulation Trigger */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-sans text-neutral-400">
                Tutorials teach syntax. <span className="text-white font-medium">DevForge teaches systems.</span>
              </span>

              <button
                onClick={handleSimulateCrash}
                disabled={isSimulatingCrash}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.09] text-xs font-mono transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulatingCrash ? 'animate-spin text-rose-400' : ''}`} />
                <span>{isSimulatingCrash ? 'Diagnosing...' : 'Simulate Surge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apple-grade Monastic Editorial Takeaways (Full-Bleed Hairline Rows, No Boxy Cards) */}
      <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
          <div className="md:col-span-4 flex items-center space-x-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
              INSIGHT 01
            </span>
            <span className="text-neutral-600">/</span>
            <h3 className="text-lg font-sans font-semibold text-white">
              The Cognitive Illusion
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed">
              Passive video viewing stimulates cognitive recognition, which your brain falsely registers as understanding. Real architectural intuition is only forged when you must debug broken invariants, handle concurrency contention, and structure data models on your own.
            </p>
          </div>
        </div>

        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
          <div className="md:col-span-4 flex items-center space-x-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
              INSIGHT 02
            </span>
            <span className="text-neutral-600">/</span>
            <h3 className="text-lg font-sans font-semibold text-white">
              The Synthetic Toy App Trap
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed">
              Building generic To-Do lists or simple blog templates exercises repetitive boilerplate syntax, but leaves you completely unprepared for real-world engineering: atomic operations, disk I/O, cache invalidation, and asynchronous event loops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
