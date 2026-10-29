'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  GitBranch, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Binary, 
  ArrowRight, 
  Sparkles,
  Terminal,
  Clock,
  Zap,
  Code2
} from 'lucide-react';

export const SolutionBento: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const pipelineStages = [
    {
      step: 1,
      name: 'Raw Byte Ingest',
      code: 'b"blob 14\\x00Hello, DevForge"',
      description: 'Format canonical Git header: <type> <size>\\x00<data>',
      status: 'VERIFIED',
      metric: 'Header Compliant'
    },
    {
      step: 2,
      name: 'SHA-1 Hash Ring',
      code: 'hashlib.sha1(payload).hexdigest()',
      description: 'Deterministic 40-char content-addressable hash digest',
      status: 'VERIFIED',
      metric: 'Hash: 7a9f...e412'
    },
    {
      step: 3,
      name: 'Directed Graph',
      code: 'parent_ref = resolve_head()',
      description: 'Immutable commit parent linking for DAG revision history',
      status: 'VERIFIED',
      metric: 'No Cycle Detected'
    },
    {
      step: 4,
      name: 'Atomic Ref Write',
      code: 'write_atomic_ref("refs/heads/main")',
      description: 'Zero-race disk write ensuring tree state consistency',
      status: 'VERIFIED',
      metric: 'Lock Released (0.1ms)'
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Apple Pro Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= HERO TILE (COL-SPAN 8): ACTIVE SYSTEM RECONSTRUCTION ================= */}
        <div className="lg:col-span-8 rounded-3xl border border-white/[0.08] bg-[#07080c]/90 p-6 sm:p-8 flex flex-col justify-between space-y-8 backdrop-blur-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                  First Principles Engineering
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Active Synthesis
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Active System Reconstruction
            </h3>

            <p className="text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed max-w-2xl">
              You don&apos;t watch code get written. You dissect and reconstruct foundational software architectures: Git content-addressable object stores, Redis-style in-memory caches, and priority job queues.
            </p>
          </div>

          {/* Interactive Multi-Stage Architecture Pipeline Instrument */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#030406] p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/[0.05] pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-neutral-200">INTERACTIVE_PIPELINE // GIT_STORAGE_ENGINE</span>
              </div>
              <span className="text-neutral-500">CLICK STAGES TO INSPECT</span>
            </div>

            {/* Stepper Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {pipelineStages.map((stage) => (
                <button
                  key={stage.step}
                  onClick={() => setActiveStage(stage.step)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                    activeStage === stage.step
                      ? 'bg-white/[0.08] border-white/30 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="text-[10px] text-neutral-500">STAGE 0{stage.step}</div>
                  <div className="text-xs font-medium truncate mt-0.5">{stage.name}</div>
                </button>
              ))}
            </div>

            {/* Stage Detail Code Readout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="p-4 rounded-xl bg-black/60 border border-white/[0.06] space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300">
                    {pipelineStages[activeStage - 1].description}
                  </span>
                  <span className="text-neutral-400">
                    {pipelineStages[activeStage - 1].metric}
                  </span>
                </div>
                <div className="text-neutral-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.04] text-[11px] overflow-x-auto">
                  <span className="text-neutral-500">&gt; </span>
                  {pipelineStages[activeStage - 1].code}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.06] text-xs font-sans text-neutral-500">
            <span>Result: Unshakeable intuition for internal system mechanics.</span>
            <div className="flex items-center space-x-2 text-neutral-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Magic Abstractions</span>
            </div>
          </div>
        </div>

        {/* ================= STACKED COMPANION TILES (COL-SPAN 4) ================= */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          
          {/* Tile 1: Deterministic Invariant Suite */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#07080c]/90 p-6 sm:p-7 space-y-4 backdrop-blur-2xl flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                    Verification
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Deterministic
                </span>
              </div>

              <h4 className="text-lg font-sans font-semibold text-white">
                Deterministic Invariants
              </h4>

              <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
                Every line you write is mathematically verified against strict invariants, boundary conditions, and concurrency deadlocks.
              </p>
            </div>

            {/* Live Invariant Telemetry Checklist */}
            <div className="rounded-xl border border-white/[0.06] bg-[#030406] p-3 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>0x01: Thread Safety Guard</span>
                </span>
                <span className="text-neutral-500">PASS</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>0x02: Monotonic TTL Expiration</span>
                </span>
                <span className="text-neutral-500">PASS</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>0x03: Zero-Allocation Janitor</span>
                </span>
                <span className="text-neutral-500">PASS</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Pure Python Standard Library */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#07080c]/90 p-6 sm:p-7 space-y-4 backdrop-blur-2xl flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                    Standard Library
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Zero Bloat
                </span>
              </div>

              <h4 className="text-lg font-sans font-semibold text-white">
                Zero External Dependencies
              </h4>

              <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
                No third-party pip packages. No opaque frameworks. Pure Python 3.12 primitives, mastering what the runtime and OS actually do.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-neutral-400">
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">random</span>
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">hashlib</span>
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">threading</span>
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">asyncio</span>
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">zlib</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
