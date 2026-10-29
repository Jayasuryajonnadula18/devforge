'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Binary, 
  GitBranch, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  RefreshCw,
  Play,
  Zap,
  ArrowRight
} from 'lucide-react';

export const SolutionAnimation: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = [
    {
      id: '01',
      title: 'Raw Byte Ingest',
      subtitle: 'Canonical Git Object Framing',
      code: 'b"blob 14\\x00Hello, DevForge"',
      visual: 'packets',
      invariant: 'Header matches <type> <len>\\x00<data>',
      metric: '0.04ms'
    },
    {
      id: '02',
      title: 'Cryptographic Hashing',
      subtitle: 'Deterministic Content-Addressing',
      code: 'hashlib.sha1(payload).hexdigest()',
      visual: 'hash',
      invariant: 'Unique 40-char SHA-1 hash generated',
      metric: '7a9f...e412'
    },
    {
      id: '03',
      title: 'Directed Graph Link',
      subtitle: 'DAG Parent Tree Serialization',
      code: 'commit.parent = resolve_head()',
      visual: 'graph',
      invariant: 'No cycles, valid monotonic ancestry',
      metric: 'Tree Verified'
    },
    {
      id: '04',
      title: 'Atomic Invariant Lock',
      subtitle: 'Zero-Allocation State Verification',
      code: 'assert_invariants(state)',
      visual: 'lock',
      invariant: '14/14 boundary conditions passed',
      metric: '100% INVARIANT PASS'
    }
  ];

  // Auto-advance through the stages
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, stages.length]);

  return (
    <div className="w-full space-y-8 select-none">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            SYSTEM_RECONSTRUCTION_ENGINE // LIVE_ASSEMBLY
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isPlaying ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isPlaying ? 'Auto-Cycle Active' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Assembly Engine Display */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-[#06070a]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
        
        {/* Stage Progress Stepper (Interactive) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-white/[0.08] pb-6">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(idx);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-white/[0.08] border-white/40 text-white shadow-lg'
                    : 'bg-white/[0.015] border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent pointer-events-none"
                  />
                )}
                <div className="text-[10px] font-mono text-emerald-400 mb-1">
                  STAGE {stage.id}
                </div>
                <div className="text-sm font-sans font-bold text-white truncate">
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Animated Machine: Dynamic Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          {/* Left: Animated Kinetic Schematic */}
          <div className="lg:col-span-7 h-[220px] rounded-2xl bg-[#030406] border border-white/[0.06] p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background coordinate grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeStage === 0 && (
                /* Stage 01: Byte Ingestion Flow */
                <motion.div
                  key="stage0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-4 text-center z-10 w-full"
                >
                  <div className="flex items-center justify-center space-x-2 font-mono text-xs text-emerald-400">
                    <Binary className="w-4 h-4 animate-bounce" />
                    <span>RAW_BYTE_INGEST // ZERO_COPY</span>
                  </div>
                  {/* Streaming Byte Packets */}
                  <div className="flex items-center justify-center space-x-2 font-mono text-xs">
                    {['62', '6c', '6f', '62', '20', '31', '34', '00'].map((b, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.12 }}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      >
                        0x{b}
                      </motion.span>
                    ))}
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Memory layout parsed directly from OS buffer without overhead
                  </div>
                </motion.div>
              )}

              {activeStage === 1 && (
                /* Stage 02: Cryptographic Rotor */
                <motion.div
                  key="stage1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-4 text-center z-10 w-full"
                >
                  <div className="flex items-center justify-center space-x-2 font-mono text-xs text-cyan-400">
                    <Cpu className="w-4 h-4" />
                    <span>SHA-1 CONTENT-ADDRESSABLE HASH</span>
                  </div>
                  {/* Rotating Hash Cylinder */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-cyan-400/50 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-mono text-cyan-300">
                      SHA
                    </div>
                  </motion.div>
                  <div className="text-xs font-mono text-cyan-300 tracking-wider">
                    7a9f82d1c6e4b3a19e048f7291a27e419b30c9a1
                  </div>
                </motion.div>
              )}

              {activeStage === 2 && (
                /* Stage 03: Directed Graph Spanning */
                <motion.div
                  key="stage2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-4 text-center z-10 w-full"
                >
                  <div className="flex items-center justify-center space-x-2 font-mono text-xs text-purple-400">
                    <GitBranch className="w-4 h-4" />
                    <span>DIRECTED ACYCLIC COMMIT GRAPH (DAG)</span>
                  </div>
                  {/* Linked DAG Nodes */}
                  <div className="flex items-center justify-center space-x-4 font-mono text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-neutral-300">
                      Commit C1
                    </div>
                    <span className="text-purple-400 font-bold">←</span>
                    <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200">
                      Commit C2 (HEAD)
                    </div>
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Parent pointer invariant satisfied. Monotonic history preserved.
                  </div>
                </motion.div>
              )}

              {activeStage === 3 && (
                /* Stage 04: Invariant Lock */
                <motion.div
                  key="stage3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-4 text-center z-10 w-full"
                >
                  <div className="flex items-center justify-center space-x-2 font-mono text-xs text-emerald-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>DETERMINISTIC INVARIANT CERTIFICATE</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white tracking-wider">
                    ALL 14 CHECKS PASSED
                  </div>
                  <div className="text-xs font-mono text-emerald-400/90">
                    ✓ Thread Safety · ✓ Memory Bounds · ✓ Zero Leaks
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Code Readout & Invariant Telemetry */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                Active Code Primitive
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.04] text-neutral-300">
                <span className="text-neutral-500">&gt; </span>
                <span className="text-emerald-300">{stages[activeStage].code}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-400">Latency:</span>
                <span className="text-white font-semibold">{stages[activeStage].metric}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{stages[activeStage].invariant}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-neutral-500">
          <span>DISSECT // REBUILD // UNDERSTAND</span>
          <span className="text-neutral-300">Pure Python 3.12 Standard Library</span>
        </div>
      </div>
    </div>
  );
};
