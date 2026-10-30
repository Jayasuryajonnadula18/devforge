'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Terminal, Cpu, GitBranch, Layers } from 'lucide-react';
import { ProjectTrack } from '../../types';

interface PortalFinaleSectionProps {
  projects: ProjectTrack[];
  onSelectProject: (project: ProjectTrack) => void;
}

export const PortalFinaleSection: React.FC<PortalFinaleSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isWarping, setIsWarping] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  // Mouse Parallax Tilt for the Portal
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Launch into studio with warp animation
  const handleEnterEra = (targetProject?: ProjectTrack) => {
    if (isWarping) return;
    setIsWarping(true);
    const chosen = targetProject || projects[0];
    setTimeout(() => {
      onSelectProject(chosen);
    }, 450);
  };

  return (
    <section
      ref={containerRef}
      id="portal-finale"
      aria-label="Join the Era Portal"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen py-24 sm:py-32 lg:py-40 flex flex-col items-center justify-center bg-[#050608] text-white overflow-hidden px-6 sm:px-12 select-none"
    >
      {/* ================= WARP SCREEN FLASH OVERLAY ================= */}
      <motion.div
        initial={false}
        animate={isWarping ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 pointer-events-none bg-white"
        style={{ display: isWarping ? 'block' : 'none' }}
      />

      {/* ================= DEEP SPACE BACKGROUND PARTICLES & GLOW ================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Radial Foundry Atmosphere */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full blur-[160px] opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(140, 190, 240, 0.22) 0%, rgba(120, 10, 255, 0.15) 35%, rgba(217, 119, 6, 0.12) 65%, transparent 80%)',
          }}
        />

        {/* Ambient Grid Floor */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 75%)',
          }}
        />
      </div>

      {/* ================= 3D INTERACTIVE PORTAL RIG ================= */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-5xl flex flex-col items-center justify-center will-change-transform"
      >
        {/* Outer Rotating Conic Accretion Ring */}
        <div className="absolute -inset-10 sm:-inset-16 md:-inset-24 rounded-full pointer-events-none flex items-center justify-center opacity-70">
          <div 
            className="w-[580px] h-[580px] sm:w-[780px] sm:h-[780px] md:w-[920px] md:h-[920px] rounded-full animate-[spin_24s_linear_infinite] blur-xl opacity-80"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(255, 255, 255, 0) 0%, rgba(0, 245, 160, 0.35) 25%, rgba(120, 10, 255, 0.45) 50%, rgba(217, 119, 6, 0.45) 75%, rgba(255, 255, 255, 0.8) 95%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
        </div>

        {/* Counter-Rotating Secondary Accretion Ring */}
        <div className="absolute -inset-6 sm:-inset-12 rounded-full pointer-events-none flex items-center justify-center opacity-60">
          <div 
            className="w-[460px] h-[460px] sm:w-[640px] sm:h-[640px] md:w-[760px] md:h-[760px] rounded-full animate-[spin_18s_linear_infinite_reverse] blur-md opacity-70"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 210, 255, 0.4) 30%, rgba(255, 255, 255, 0.7) 60%, rgba(190, 40, 240, 0.3) 85%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
        </div>

        {/* Event Horizon Core (The Dimensional Sink) */}
        <div
          className="relative w-full max-w-4xl rounded-[40px] sm:rounded-[48px] border border-white/[0.14] bg-[#07090e]/85 backdrop-blur-3xl px-8 py-16 sm:px-16 sm:py-20 md:py-24 flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(255,255,255,0.03)] overflow-hidden"
        >
          {/* Internal Volumetric Core Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-25 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(0, 210, 255, 0.2) 40%, transparent 70%)',
            }}
          />

          {/* Eyebrow Milestone Tag */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-300 font-medium">
              System Gateway // 04
            </span>
          </div>

          {/* Monumental Headline inside Portal */}
          <h2 className="font-rector text-4xl sm:text-6xl md:text-7xl lg:text-[78px] xl:text-[84px] font-bold tracking-[-0.03em] leading-[1.02] text-white max-w-3xl">
            <span className="block">Join the era of</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 pb-2 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
              modern developers.
            </span>
          </h2>

          {/* Supporting Credo */}
          <p className="font-acma text-[16px] sm:text-[18px] lg:text-[20px] text-[#D8DADC] font-normal leading-[1.68] max-w-xl mx-auto mt-6 px-4">
            Stop copying code you don't understand. Master the architecture of
            real-world computing systems from first principles.
          </p>

          {/* ================= THE HERO PORTAL BUTTON ================= */}
          <div className="relative mt-10 sm:mt-12">
            {/* Luminous Pulsing Button Halo */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-200 to-indigo-400 opacity-60 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

            <button
              onClick={() => handleEnterEra()}
              className="group relative inline-flex items-center justify-center px-10 py-5 sm:px-12 sm:py-5 rounded-full font-sans font-semibold text-[16px] sm:text-[18px] text-black bg-white hover:bg-neutral-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_70px_rgba(255,255,255,0.7)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <span className="flex items-center space-x-3">
                <span className="tracking-tight">Enter the Era</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </button>
          </div>

          {/* ================= FAST-TRACK SYSTEM MODULE SELECTOR ================= */}
          <div className="w-full max-w-2xl mt-14 sm:mt-16 pt-8 border-t border-white/[0.08] flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">
              Or pick an architecture track to engineer:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
              {projects.slice(0, 4).map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => handleEnterEra(proj)}
                  onMouseEnter={() => setHoveredTrack(proj.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  className="flex flex-col items-start p-3 sm:p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 text-left cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 font-semibold uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{proj.languageBadge}</span>
                  </div>
                  <span className="text-[13px] font-medium text-neutral-200 group-hover:text-white line-clamp-1">
                    {proj.title.split('(')[0].trim()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= FOOTER AT BOTTOM OF PORTAL ================= */}
      <footer className="w-full max-w-5xl mt-20 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono tracking-wider space-y-4 sm:space-y-0">
        <div>
          <span>DEVFORGE © 2026 · BUILT FROM FIRST PRINCIPLES</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="hover:text-neutral-400 transition-colors">SYSTEMS</span>
          <span className="hover:text-neutral-400 transition-colors">COMPILERS</span>
          <span className="hover:text-neutral-400 transition-colors">CONCURRENCY</span>
          <span className="hover:text-neutral-400 transition-colors">NETWORKING</span>
        </div>
      </footer>
    </section>
  );
};
