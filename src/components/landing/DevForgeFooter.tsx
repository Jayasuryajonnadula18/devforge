'use client';

import React, { useState, useEffect } from 'react';
import { ProjectTrack } from '../../types';
import { toast } from 'sonner';
import { ArrowUpRight, Check, Hammer } from 'lucide-react';

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success('Joined the builder list', {
      description: 'You will receive updates when new system tracks drop.',
    });
  };

  return (
    <footer className="relative w-full bg-[#050608] px-4 sm:px-8 lg:px-12 pb-12 pt-8 select-none">
      {/* Framed Footer Card matching 108 Supply */}
      <div 
        className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        style={{
          background: 'linear-gradient(180deg, #090a0d 0%, #150f0c 25%, #381d11 60%, #6d3319 90%, #8b4320 100%)',
        }}
      >
        {/* Subtle Noise / Film Grain Overlay */}
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
            background: 'radial-gradient(ellipse 85% 60% at 50% 0%, rgba(5, 6, 8, 0.75) 0%, transparent 80%)',
          }}
        />

        {/* Main Content Area */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-[#f5f4f0]">
          
          {/* Top Logo / Forge Icon Badge */}
          <div className="mb-12 sm:mb-16">
            <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Hammer className="w-4 h-4 text-neutral-200" />
            </div>
          </div>

          {/* Middle Grid: Left Newsletter / Right Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Heading & Newsletter */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-[-0.03em] leading-[1.12] text-white">
                Follow what<br />
                we’re <span className="font-rector italic font-normal text-amber-200/90">building</span>
              </h3>

              <p className="text-sm sm:text-base text-neutral-300/80 font-normal max-w-sm leading-relaxed">
                Get early access when new production-grade architecture tracks drop.
              </p>

              {/* Newsletter / Action Button Form */}
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-2 max-w-md">
                {!isSubscribed ? (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/30 backdrop-blur-md flex-1 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                    >
                      Join the list
                    </button>
                  </>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                    <Check className="w-4 h-4" />
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
                        onClick={() => onSelectProject && onSelectProject(proj)}
                        className="hover:text-white transition-colors cursor-pointer text-left flex items-center group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {proj.title.split('(')[0].trim()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Engineering */}
              <div className="space-y-3.5">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Architecture
                </span>
                <ul className="space-y-2.5 text-neutral-200">
                  <li>
                    <span className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                      <span>In-Memory Storage</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                        Go
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                      <span>DAG Git Internals</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                        Py
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                      <span>Message Queues</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                        TS
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                      <span>Zero-Copy Parsers</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                        Rust
                      </span>
                    </span>
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
                    <a href="#meet-devforge" className="hover:text-white transition-colors">
                      The Forge
                    </a>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      First Principles
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      System Invariants
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Privacy & Terms
                    </span>
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

        </div>
      </div>
    </footer>
  );
};
