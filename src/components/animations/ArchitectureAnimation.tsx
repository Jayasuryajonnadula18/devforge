'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Terminal, 
  UserPlus, 
  Wifi, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface GuestPlayer {
  id: string;
  handle: string;
  seed: number;
  latency: string;
  theme: string;
}

export const ArchitectureAnimation: React.FC = () => {
  const [theme, setTheme] = useState<'cyberpunk' | 'ghost' | 'mythic'>('cyberpunk');
  const [isFiring, setIsFiring] = useState(false);
  const [guestList, setGuestList] = useState<GuestPlayer[]>([
    { id: '1', handle: 'vortex_runner_77', seed: 4091, latency: '0.08ms', theme: 'cyberpunk' },
    { id: '2', handle: 'shadow_drifter_42', seed: 8812, latency: '0.11ms', theme: 'ghost' },
  ]);

  const vocab = {
    cyberpunk: { prefixes: ['Neon', 'Matrix', 'Vortex', 'Cyber', 'Apex'], nouns: ['Runner', 'Cipher', 'Ghost', 'Vector', 'Echo'] },
    ghost: { prefixes: ['Shadow', 'Phantom', 'Wraith', 'Obsidian', 'Silent'], nouns: ['Blade', 'Drifter', 'Nomad', 'Reaper', 'Shade'] },
    mythic: { prefixes: ['Solar', 'Aether', 'Chronos', 'Titan', 'Astral'], nouns: ['Knight', 'Oracle', 'Warden', 'Forge', 'Sentry'] },
  };

  const handleSimulateJoin = () => {
    setIsFiring(true);
    setTimeout(() => {
      const active = vocab[theme];
      const p = active.prefixes[Math.floor(Math.random() * active.prefixes.length)];
      const n = active.nouns[Math.floor(Math.random() * active.nouns.length)];
      const num = Math.floor(Math.random() * 900 + 100);
      const handle = `${p}_${n}_${num}`.toLowerCase();
      const newPlayer: GuestPlayer = {
        id: `${Date.now()}`,
        handle,
        seed: Math.floor(Math.random() * 9999 + 1000),
        latency: `${(Math.random() * 0.08 + 0.05).toFixed(2)}ms`,
        theme,
      };

      setGuestList((prev) => [newPlayer, ...prev.slice(0, 3)]);
      setIsFiring(false);
    }, 220);
  };

  return (
    <div className="w-full space-y-8 select-none">
      {/* Top Telemetry Line */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            PRIMITIVE_HOST_DISPATCH // COMPONENT_ISOLATION
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>Host Harness Active</span>
        </div>
      </div>

      {/* Main Animated Machine Frame */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#06070a]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* Animated Split: What You Build (Left) vs Pre-wired Host (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ================= LEFT (7 COLS): THE SINGLE ISOLATED PRIMITIVE ================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 rounded-2xl bg-white/[0.015] border border-white/[0.06] p-6 sm:p-7">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                    The Only Code You Build
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  python.random
                </span>
              </div>

              {/* Code Chip */}
              <div className="p-4 rounded-xl bg-black/70 border border-white/[0.05] font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
                <div className="text-neutral-500 mb-1"># Pure algorithmic primitive — no UI, no sockets, no DB</div>
                <div><span className="text-blue-400">class</span> <span className="text-emerald-300">TagGenerator</span>:</div>
                <div className="pl-4">
                  <div><span className="text-blue-400">def</span> <span className="text-yellow-300">generate_handle</span>(self, theme):</div>
                  <div className="pl-4 text-emerald-300">
                    prefix = random.choice(VOCAB[theme][&apos;prefixes&apos;])
                  </div>
                  <div className="pl-4 text-emerald-300">
                    noun = random.choice(VOCAB[theme][&apos;nouns&apos;])
                  </div>
                  <div className="pl-4 text-purple-300">
                    <span className="text-blue-400">return</span> f<span className="text-amber-300">&quot;&#123;prefix&#125;_&#123;noun&#125;&quot;</span>.lower()
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Theme Dial */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-neutral-500 text-[11px]">ACTIVE DIAL:</span>
                {(['cyberpunk', 'ghost', 'mythic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                      theme === t
                        ? 'bg-white/10 text-white font-medium border border-white/20'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT (5 COLS): THE PRE-WIRED HOST LOBBY ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 rounded-2xl bg-[#030406] border border-cyan-500/20 p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.05)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                    Pre-Wired Multiplayer Host
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                  SLOT 409 // LIVE
                </span>
              </div>

              {/* Real-time Guest Roster */}
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {guestList.map((guest) => (
                    <motion.div
                      key={guest.id}
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between font-mono text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                          @
                        </div>
                        <div>
                          <div className="text-white font-medium">@{guest.handle}</div>
                          <div className="text-[10px] text-neutral-500">
                            Seed {guest.seed} · {guest.latency}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 uppercase">
                        {guest.theme}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Fire Button */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-sans text-neutral-500">
                Simulate anonymous player join:
              </span>

              <button
                onClick={handleSimulateJoin}
                disabled={isFiring}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-mono font-semibold hover:bg-neutral-200 transition-all cursor-pointer shadow-md active:scale-95 flex items-center space-x-2"
              >
                <UserPlus className={`w-3.5 h-3.5 ${isFiring ? 'animate-spin' : ''}`} />
                <span>Simulate Guest Join</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Stylized Takeaway Strip */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-neutral-500 block text-[10px] uppercase">You Engineer</span>
            <span className="text-white font-medium">Core Mathematical Primitive</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-neutral-500 block text-[10px] uppercase">Platform Provides</span>
            <span className="text-cyan-300 font-medium">Pre-Wired Production Harness</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-neutral-500 block text-[10px] uppercase">Zero Overhead</span>
            <span className="text-emerald-400 font-medium">No Boilerplate / No Glue Code</span>
          </div>
        </div>

      </div>
    </div>
  );
};
