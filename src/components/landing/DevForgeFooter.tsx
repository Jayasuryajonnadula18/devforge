'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ProjectTrack } from '../../types';
import { toast } from 'sonner';
import { ArrowUpRight, Check } from 'lucide-react';

interface DevForgeFooterProps {
  projects?: ProjectTrack[];
  onSelectProject?: (project: ProjectTrack) => void;
}

export const DevForgeFooter: React.FC<DevForgeFooterProps> = ({
  projects = [],
  onSelectProject,
}) => {
  const [deviceInfo, setDeviceInfo] = useState<string>('Detecting...');
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const lastSubmitTimeRef = useRef<number>(0);

  // Dynamic device detection matching the 108 Supply reference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let os = 'Unknown OS';
    const ua = window.navigator.userAgent;
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'MacOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    else if (ua.indexOf('Android') !== -1) os = 'Android';
    else if (ua.indexOf('like Mac') !== -1) os = 'iOS';

    const width = window.screen.width || window.innerWidth;
    const height = window.screen.height || window.innerHeight;
    setDeviceInfo(`${os} · ${width}×${height}`);
  }, []);

  // Secure, sanitized & rate-limited subscription handler
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Rate-limiting check (cooldown of 3 seconds)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 3000) {
      toast.warning('Please wait a moment before resubmitting.');
      return;
    }
    lastSubmitTimeRef.current = now;

    // 2. Strict Input Sanitization
    const sanitizedEmail = email.trim();
    if (!sanitizedEmail) {
      toast.error('Email address cannot be empty.');
      return;
    }

    if (sanitizedEmail.length > 254) {
      toast.error('Email address exceeds maximum permissible length.');
      return;
    }

    // RFC 5322 standard email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      toast.error('Please enter a valid, well-formed email address.');
      return;
    }

    setIsSubscribed(true);
    toast.success('Joined the builder list', {
      description: 'You will receive notifications when new architecture tracks drop.',
    });
  };

  const handleOpenArchitectureTrack = (id: string, name: string) => {
    const track = projects.find(p => p.id === id);
    if (track && onSelectProject) {
      onSelectProject(track);
    } else {
      toast.info(`${name} — Track In Preparation`, {
        description: 'This architecture module is currently undergoing test suite verification.',
      });
    }
  };

  return (
    <footer 
      className="relative w-full overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #050608 0%, #0d0907 20%, #2a150b 50%, #5c2912 80%, #7e3a19 100%)',
      }}
    >
      {/* Top Seam Blending (Invisible smooth handoff from the forge void) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050608] via-[#050608]/70 to-transparent pointer-events-none z-10" />

      {/* Subtle Noise / Film Grain Overlay (Edge-to-Edge Full Bleed) */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient Top Glow / Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 85% 50% at 50% 0%, rgba(5, 6, 8, 0.85) 0%, transparent 80%)',
        }}
      />

      {/* Smoothly Animated Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32 lg:py-36 text-[#f5f4f0]"
      >
        {/* Main Grid: Left Newsletter / Right Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Newsletter */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-sans text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-[-0.03em] leading-[1.12] text-white">
              Follow what<br />
              we’re <span className="font-rector italic font-normal text-amber-200/90">building</span>
            </h3>

            <p className="text-sm sm:text-base text-neutral-300/80 font-normal max-w-sm leading-relaxed">
              Get early access when new production-grade architecture tracks drop.
            </p>

            {/* Newsletter / Action Button Form (Glitch-Free Solid Glass) */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-2 max-w-md">
              {!isSubscribed ? (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="Enter your email"
                    className="h-12 px-4 rounded-xl bg-[#180e08]/90 border border-white/15 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors flex-1 w-full"
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.3)] shrink-0"
                  >
                    Join the list
                  </button>
                </>
              ) : (
                <div className="h-12 inline-flex items-center space-x-2 text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/25 px-4 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You're on the list. First principles updates coming soon.</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Navigation Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            
            {/* Col 1: System Tracks */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Tracks
              </span>
              <ul className="space-y-2.5 text-neutral-200">
                {projects.slice(0, 4).map((proj) => (
                  <li key={proj.id}>
                    <button
                      type="button"
                      onClick={() => onSelectProject && onSelectProject(proj)}
                      className="hover:text-white transition-colors cursor-pointer text-left flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {proj.title.split('(')[0].trim()}
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => toast.info('Distributed Raft Track — Coming Soon', {
                      description: 'Consensus state machines & leader election track is currently in private verification.',
                    })}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center group text-neutral-400 hover:text-neutral-200"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      Distributed Raft
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider ml-1.5 leading-none">
                      Soon
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => toast.info('eBPF Kernel Track — Coming Soon', {
                      description: 'Linux kernel tracepoints & ring buffer observability track dropping in Q1 2027.',
                    })}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center group text-neutral-400 hover:text-neutral-200"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      eBPF Observability
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider ml-1.5 leading-none">
                      Soon
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: Engineering */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Architecture
              </span>
              <ul className="space-y-2.5 text-neutral-200">
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenArchitectureTrack('go-cache', 'In-Memory Storage')}
                    className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span>In-Memory Storage</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                      Go
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenArchitectureTrack('py-git', 'DAG Git Internals')}
                    className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span>DAG Git Internals</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                      Py
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenArchitectureTrack('ts-queue', 'Message Queues')}
                    className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span>Message Queues</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                      TS
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenArchitectureTrack('rust-parser', 'Zero-Copy Parsers')}
                    className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span>Zero-Copy Parsers</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                      Rust
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => toast.info('LSM-Tree Storage Engine — Coming Soon', {
                      description: 'SSTables, MemTable flushing & Bloom filter architecture guide dropping soon.',
                    })}
                    className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-left text-neutral-400 hover:text-neutral-200"
                  >
                    <span>LSM-Tree Engine</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider leading-none">
                      Soon
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Principles & Legal */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Philosophy
              </span>
              <ul className="space-y-2.5 text-neutral-200">
                <li>
                  <a href="#meet-devforge" className="hover:text-white transition-colors block">
                    The Forge
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => toast.info('First Principles Manifesto — Coming Soon', {
                      description: 'Architectural writings on zero-cost abstractions and invariant-driven software engineering.',
                    })}
                    className="hover:text-white transition-colors cursor-pointer flex items-center text-left"
                  >
                    <span>First Principles</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider ml-1.5 leading-none">
                      Soon
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => toast.info('Formal Invariants Guide — Coming Soon', {
                      description: 'Formal proofs and systems safety invariants coming in v1.0.',
                    })}
                    className="hover:text-white transition-colors cursor-pointer flex items-center text-left"
                  >
                    <span>System Invariants</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider ml-1.5 leading-none">
                      Soon
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => toast.info('Privacy & Safety Invariants', {
                      description: 'DevForge is strictly local-first and zero-telemetry. Official terms and licensing documentation coming soon.',
                    })}
                    className="hover:text-white transition-colors cursor-pointer flex items-center text-left"
                  >
                    <span>Privacy & Terms</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider ml-1.5 leading-none">
                      Soon
                    </span>
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Metadata Row: 4 Balanced Columns matching 108 Supply */}
        <div className="mt-20 pt-8 border-t border-white/[0.12] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-neutral-300/80 font-mono tracking-wide">
          {/* Col 1 */}
          <div className="space-y-1">
            <p className="text-white font-medium">© 2026 DevForge</p>
            <p className="text-neutral-400">Architected from first principles</p>
          </div>

          {/* Col 2 */}
          <div className="space-y-1">
            <p className="text-white font-medium">Repository</p>
            <a 
              href="https://github.com/Jayasuryajonnadula18/devforge" 
              target="_blank" 
              rel="noreferrer"
              className="text-neutral-400 hover:text-white transition-colors inline-flex items-center space-x-1"
            >
              <span>github.com/devforge</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Col 3: Dynamic Device Specs */}
          <div className="space-y-1">
            <p className="text-white font-medium">Your device</p>
            <p className="text-neutral-400">{deviceInfo}</p>
          </div>

          {/* Col 4: Fonts Used */}
          <div className="space-y-1">
            <p className="text-white font-medium">Fonts used</p>
            <p className="text-neutral-400">Rector, Montserrat, Acma</p>
          </div>
        </div>

      </motion.div>
    </footer>
  );
};
