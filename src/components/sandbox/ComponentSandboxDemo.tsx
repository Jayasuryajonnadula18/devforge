'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Layers,
  UserPlus,
  ArrowRight,
  Wifi
} from 'lucide-react';

interface LobbyPlayer {
  id: string;
  tag: string;
  theme: string;
  role: 'auto-generated' | 'custom';
  latency: string;
  time: string;
}

export const ComponentSandboxDemo: React.FC = () => {
  const [theme, setTheme] = useState<'cyberpunk' | 'ghost' | 'mythic'>('cyberpunk');
  const [withDigits, setWithDigits] = useState(true);
  const [currentTag, setCurrentTag] = useState('vortex_runner_77');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([
    { id: 'p1', tag: 'shadow_drifter_42', theme: 'ghost', role: 'auto-generated', latency: '0.14ms', time: 'Just now' },
    { id: 'p2', tag: 'cyber_falcon_99', theme: 'cyberpunk', role: 'auto-generated', latency: '0.12ms', time: '1m ago' },
  ]);

  const themes = {
    cyberpunk: {
      prefixes: ['Vortex', 'Cyber', 'Neon', 'Matrix', 'Glitch', 'Apex'],
      nouns: ['Runner', 'Cipher', 'Ghost', 'Spectre', 'Vector', 'Echo'],
      accent: 'text-emerald-400',
      badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
    ghost: {
      prefixes: ['Shadow', 'Phantom', 'Wraith', 'Obsidian', 'Silent', 'Void'],
      nouns: ['Drifter', 'Blade', 'Nomad', 'Stalker', 'Reaper', 'Shade'],
      accent: 'text-purple-400',
      badge: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    },
    mythic: {
      prefixes: ['Solar', 'Aether', 'Chronos', 'Titan', 'Valkyrie', 'Astral'],
      nouns: ['Knight', 'Oracle', 'Warden', 'Forge', 'Sentry', 'Sentinel'],
      accent: 'text-amber-400',
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    },
  };

  const handleSimulateGuestJoin = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const active = themes[theme];
      const p = active.prefixes[Math.floor(Math.random() * active.prefixes.length)];
      const n = active.nouns[Math.floor(Math.random() * active.nouns.length)];
      const num = withDigits ? `_${Math.floor(Math.random() * 900 + 100)}` : '';
      const tag = `${p}${n}${num}`.toLowerCase();
      
      setCurrentTag(tag);
      const newPlayer: LobbyPlayer = {
        id: `p-${Date.now()}`,
        tag,
        theme,
        role: 'auto-generated',
        latency: `${(Math.random() * 0.15 + 0.08).toFixed(2)}ms`,
        time: 'Just now'
      };
      
      setLobbyPlayers((prev) => [newPlayer, ...prev.slice(0, 3)]);
      setIsGenerating(false);
    }, 180);
  };

  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-[#07080c]/90 overflow-hidden backdrop-blur-2xl shadow-2xl">
      {/* Top Hardware Frame Bezel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.015] gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
          </div>
          <span className="text-xs font-mono text-neutral-400 tracking-wider">
            DEVFORGE // ISOLATED_PRIMITIVE_HOST // python.random
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>Surrounding Platform Pre-Wired</span>
        </div>
      </div>

      {/* Main Grid: Code Isolation vs Live Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
        {/* ================= LEFT (7 COLS): THE ISOLATED PRIMITIVE YOU BUILD ================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase tracking-wider font-mono text-neutral-300 font-semibold">
                  1. The Primitive You Write (Python 3.12)
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                Zero UI or Glue Code
              </span>
            </div>

            <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
              When learning Python&apos;s <code className="text-neutral-200 font-mono text-xs px-1.5 py-0.5 rounded bg-white/[0.06]">random</code> module, you only engineer the deterministic handle generator. You don&apos;t build auth, databases, or socket dispatchers.
            </p>

            {/* Code Box */}
            <div className="relative rounded-2xl border border-white/[0.06] bg-[#030406] p-5 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
              <div className="text-neutral-500 mb-2"># Topic: PRNG &amp; Deterministic Entropy</div>
              <div>
                <span className="text-purple-400">import</span> random
              </div>
              <div className="mt-2">
                <span className="text-blue-400">class</span>{' '}
                <span className="text-emerald-300">TagGenerator</span>:
              </div>
              <div className="pl-4 text-neutral-400">
                <div className="text-neutral-600">
                  # You only write the pure algorithmic primitive:
                </div>
                <div>
                  <span className="text-blue-400">def</span>{' '}
                  <span className="text-yellow-300">__init__</span>(self, seed=None):
                </div>
                <div className="pl-4 text-neutral-300">
                  self.rng = random.Random(seed)
                </div>
                <div className="mt-2">
                  <span className="text-blue-400">def</span>{' '}
                  <span className="text-yellow-300">generate_handle</span>(self, theme, with_digits):
                </div>
                <div className="pl-4 text-emerald-300">
                  prefix = self.rng.choice(VOCAB[theme][<span className="text-amber-300">&quot;prefixes&quot;</span>])
                </div>
                <div className="pl-4 text-emerald-300">
                  noun = self.rng.choice(VOCAB[theme][<span className="text-amber-300">&quot;nouns&quot;</span>])
                </div>
                <div className="pl-4 text-purple-300">
                  <span className="text-blue-400">return</span> f<span className="text-amber-300">&quot;&#123;prefix&#125;_&#123;noun&#125;&quot;</span>.lower()
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Theme:</span>
              <div className="flex items-center space-x-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
                {(['cyberpunk', 'ghost', 'mythic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all capitalize font-sans ${
                      theme === t ? 'bg-white/10 text-white font-medium' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setWithDigits(!withDigits)}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-all font-sans ${
                withDigits
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/[0.02] text-neutral-400 border-white/[0.08]'
              }`}
            >
              Digits: {withDigits ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* ================= RIGHT (5 COLS): WHERE IT PLUGS IN (PRE-WIRED HOST) ================= */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white/[0.015] to-transparent">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs uppercase tracking-wider font-mono text-neutral-300 font-semibold">
                  2. Live Host System Harness
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Multiplayer Lobby
              </span>
            </div>

            <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
              When a guest connects to the multiplayer lobby and skips entering a custom username, the host system calls your <code className="text-white font-mono text-xs">TagGenerator</code> to dynamically forge an identity.
            </p>

            {/* Live Lobby Simulation Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#030406] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono pb-2 border-b border-white/[0.05]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE_LOBBY // ROOM #409</span>
                </div>
                <span className="text-neutral-500">{lobbyPlayers.length} / 8 SLOTS</span>
              </div>

              {/* Real-time Players Stream */}
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {lobbyPlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] flex items-center justify-between font-mono text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-neutral-300 font-bold text-[11px]">
                          @
                        </div>
                        <div>
                          <div className="text-white font-medium">@{player.tag}</div>
                          <div className="text-[10px] text-neutral-500">
                            Generator call · {player.latency}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 border border-white/[0.06] uppercase">
                        {player.theme}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Invariant Health Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500">ENTROPY</div>
                  <div className="text-emerald-400 font-medium">99.8%</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500">COLLISIONS</div>
                  <div className="text-neutral-300 font-medium">0 / 10K</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500">LATENCY</div>
                  <div className="text-cyan-400 font-medium">&lt; 0.15ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action to Trigger Guest Join */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs font-sans text-neutral-500">
              Test your generator in the live host:
            </span>

            <button
              onClick={handleSimulateGuestJoin}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-sans font-medium hover:bg-neutral-200 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center space-x-2"
            >
              <UserPlus className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Simulate Guest Join</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
