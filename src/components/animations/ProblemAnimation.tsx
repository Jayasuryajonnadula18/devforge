'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, AlertOctagon, CheckCircle2, Zap, Flame, ShieldAlert, Cpu } from 'lucide-react';
import { DecryptedText } from '../reactbits/DecryptedText';

export const ProblemAnimation: React.FC = () => {
  const [mode, setMode] = useState<'tutorial' | 'production'>('tutorial');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isDeadlocked, setIsDeadlocked] = useState(false);

  // Auto-play the tutorial progress simulation
  useEffect(() => {
    if (mode === 'tutorial') {
      const interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Handle switching to production
  useEffect(() => {
    if (mode === 'production') {
      const timeout = setTimeout(() => {
        setIsDeadlocked(true);
      }, 800);
      return () => clearTimeout(timeout);
    } else {
      setIsDeadlocked(false);
    }
  }, [mode]);

  return (
    <div className="w-full space-y-8 select-none">
      {/* Top Mode Selector: Stylized Minimalist Toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            EXPERIENCE_COMPARATOR // v0.1
          </span>
        </div>

        {/* Apple-style Segmented Controller */}
        <div className="flex items-center p-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <button
            onClick={() => setMode('tutorial')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              mode === 'tutorial'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            01 / The Tutorial Mirage
          </button>
          <button
            onClick={() => setMode('production')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              mode === 'production'
                ? 'bg-rose-500 text-white font-semibold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            02 / The Production Crash
          </button>
        </div>
      </div>

      {/* Main Animated Theater Display */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-[#06070a]/90 backdrop-blur-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-6 sm:p-10 shadow-2xl">
        <AnimatePresence mode="wait">
          {mode === 'tutorial' ? (
            /* ================= STATE A: THE TUTORIAL MIRAGE (ANIMATION) ================= */
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 h-full flex flex-col justify-between"
            >
              {/* Header Telemetry */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-emerald-400 mb-1">
                    Passive Consumption Loop
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                    Watching someone else code.
                  </h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {videoProgress}%
                  </span>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">
                    Video Progress
                  </span>
                </div>
              </div>

              {/* Central Animated Visual: The Decay Curve vs Fake Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
                {/* Visual Scrubber Video Loop */}
                <div className="lg:col-span-7 space-y-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 font-mono text-xs">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                      <span className="text-neutral-200">Lecture 42: "Mastering Systems in 20 Mins"</span>
                    </div>
                    <span className="text-emerald-400">1080p · Auto-Play</span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  {/* Animated Simulated Keystrokes (Passive) */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.04] text-[11px] space-y-1 text-neutral-400">
                    <div className="text-neutral-600"># You watch, but your brain builds no synapses:</div>
                    <div className="text-neutral-300">
                      <span className="text-blue-400">def</span> <span className="text-yellow-300">get_user</span>(id):
                    </div>
                    <div className="pl-4 text-emerald-400">
                      return database.find(id) <span className="text-neutral-600"># No connection pooling, no locks</span>
                    </div>
                  </div>
                </div>

                {/* Animated Brainwave / Retention Metric Display */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">COGNITIVE FRICTION</span>
                      <span className="text-neutral-500 font-bold">0.0% (FLATLINE)</span>
                    </div>
                    {/* Flatlined Wave Animation */}
                    <div className="h-10 flex items-center justify-center overflow-hidden relative">
                      <motion.div
                        animate={{ x: [-200, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-[400px] h-[2px] bg-neutral-600 relative"
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neutral-400 shadow-[0_0_8px_white]" />
                      </motion.div>
                    </div>
                    <div className="text-[11px] text-neutral-500 font-sans leading-tight">
                      Zero friction means zero long-term retention. Information flows into eyes, not intuition.
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 text-xs font-mono text-neutral-400">
                    <span>BLANK CANVAS READINESS:</span>
                    <span className="text-amber-400 font-semibold">0% (INSTANT FREEZE)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Editorial Callout */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-neutral-400">
                  ILLUSION: <span className="text-neutral-200">"I understand this because I watched it."</span>
                </span>
                <button
                  onClick={() => setMode('production')}
                  className="text-rose-400 hover:text-rose-300 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>See what happens in production →</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ================= STATE B: THE PRODUCTION CRASH (ANIMATION) ================= */
            <motion.div
              key="production"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 h-full flex flex-col justify-between"
            >
              {/* Header Telemetry */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-rose-400 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Real-World Hostile Environment</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                    The terminal doesn&apos;t have a pause button.
                  </h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-3xl font-bold text-rose-500 tracking-tight">
                    DEADLOCK
                  </span>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">
                    Worker Thread Starvation
                  </span>
                </div>
              </div>

              {/* Central Animated Visual: The System Rupture */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
                {/* Live Terminal Crash Stream */}
                <div className="lg:col-span-7 space-y-3 rounded-2xl bg-[#090406] border border-rose-500/30 p-6 font-mono text-xs shadow-[0_0_40px_rgba(244,63,94,0.1)]">
                  <div className="flex items-center justify-between text-rose-400 text-[11px] pb-2 border-b border-rose-500/20">
                    <div className="flex items-center space-x-2">
                      <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                      <span>RUNTIME_EXCEPTION // 3:14:02 AM</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                      HIGH PRIORITY
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] leading-relaxed text-neutral-300">
                    <div className="text-neutral-500">&gt; worker_pool.dispatch(job_id=94182)</div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-rose-400 font-semibold"
                    >
                      FATAL: MutexDeadlock in Thread #3 (holding lock 0x7FFF9)
                    </motion.div>
                    <div className="text-neutral-400 pl-2">
                      Queue backlog: <span className="text-white">14,200 pending tasks</span> starving
                    </div>
                    <div className="text-amber-400 pl-2">
                      Warning: Invariant violation bypassed monotonic clock
                    </div>
                  </div>
                </div>

                {/* Animated Contention Graph / Thread Lock */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-rose-500/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">THREAD CONTENTION</span>
                      <span className="text-rose-400 font-bold">100% BLOCKED</span>
                    </div>

                    {/* Animated Pulsing Ring representing locked threads */}
                    <div className="h-16 flex items-center justify-center relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        className="w-14 h-14 rounded-full border-2 border-dashed border-rose-500/60 flex items-center justify-center"
                      >
                        <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
                      </motion.div>
                    </div>

                    <div className="text-[11px] text-neutral-400 font-sans leading-tight text-center">
                      Tutorials teach how to write code that works. DevForge teaches how systems fail.
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 text-xs font-mono text-neutral-400">
                    <span>TUTORIAL PREPARATION:</span>
                    <span className="text-rose-400 font-semibold">0% (HELPLESS)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Editorial Callout */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-neutral-400">
                  REALITY: <span className="text-neutral-200">"Only building from scratch develops architectural intuition."</span>
                </span>
                <button
                  onClick={() => setMode('tutorial')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>← Replay Tutorial Illusion</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stylized Minimal Takeaway Badges (No Boxy Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
            AXIOM 01
          </div>
          <div className="text-lg font-sans font-bold text-white">
            Passive recognition is not synthesis.
          </div>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Your brain only builds durable mental models when forced to decide memory layouts, debug deadlock conditions, and resolve invariant failures alone.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
            AXIOM 02
          </div>
          <div className="text-lg font-sans font-bold text-white">
            Synthetic toy apps teach nothing.
          </div>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Building another to-do list exercises language syntax, but leaves you blind to atomic operations, disk serialization, and thread scheduling.
          </p>
        </div>
      </div>
    </div>
  );
};
