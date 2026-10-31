'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { ProjectTrack } from '../types';
import { TooltipProvider } from './ui/tooltip';
import { DialedNavbar } from './dialedweb/DialedNavbar';
import WebThreads from './reactbits/WebThreads';
import { Scene02Impact } from './landing/Scene02Impact';
import { DevForgeFooter } from './landing/DevForgeFooter';

interface CatalogViewProps {
  projects: ProjectTrack[];
  completedMilestones: Record<string, number[]>;
  onSelectProject: (project: ProjectTrack) => void;
  onOpenCommandPalette?: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  projects,
  completedMilestones,
  onSelectProject,
  onOpenCommandPalette,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);

  // GSAP Choreographed Hero Reveal
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero-item', {
        opacity: 0,
        y: 40,
        stagger: 0.16,
        duration: 1.2,
        ease: 'power3.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const pythonProjects = projects.filter((p) => p.language === 'python');
  const totalCompleted = Object.values(completedMilestones).flat().length;

  // Refined Cinematic Scroll Parallax on Hero
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);
  const heroTranslateY = useTransform(scrollY, [0, 600], [0, -50]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative min-h-screen bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black">
        
        {/* ================= WEB THREADS HERO BACKGROUND ================= */}
        <div className="absolute top-0 inset-x-0 h-screen overflow-hidden z-0 pointer-events-auto">
          {/* Volumetric Aura Glows */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div 
              className="absolute -top-[12%] -left-[16%] w-[1050px] h-[1050px] rounded-full blur-[140px] opacity-65"
              style={{
                background: 'radial-gradient(circle, rgba(0, 245, 160, 0.45) 0%, rgba(0, 180, 136, 0.25) 40%, transparent 75%)',
              }}
            />
            <div 
              className="absolute -top-[14%] -right-[16%] w-[1100px] h-[1100px] rounded-full blur-[150px] opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(190, 40, 240, 0.45) 0%, rgba(120, 10, 255, 0.25) 40%, transparent 75%)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 85% 75% at 50% 45%, rgba(5, 6, 8, 0.08) 0%, rgba(5, 6, 8, 0.45) 65%, #050608 100%)',
              }}
            />
          </div>

          {/* WebThreads Interactive Strings */}
          <div className="absolute inset-0 z-[1] pointer-events-auto">
            <WebThreads
              colors={['#00f5a0', '#00d2ff', '#7000ff', '#be28f0', '#ff007f']}
              coreColor="#FFFFFF"
              threadCount={8}
              speed={0.22}
              frequency={4.2}
              spread={0.25}
              taper={1.10}
              position={0.50}
              pinch={0.5}
              nodes={1}
              glow={0.032}
              falloff={0.55}
              thickness={1.25}
              brightness={0.82}
              opacity={0.92}
              depth={0.22}
              mouseInteraction={true}
              mouseStrength={0.65}
              pulseOnClick={true}
              shimmer={true}
              fade={0.14}
            />
          </div>

          {/* Balanced Contrast Pocket */}
          <div 
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'radial-gradient(ellipse 72% 52% at 50% 50%, rgba(5, 6, 8, 0.48) 0%, rgba(5, 6, 8, 0.22) 50%, transparent 80%)',
            }}
          />

          {/* Film Grain Texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-[3] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Bottom Edge Fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050608] via-[#050608]/80 to-transparent z-[4]" />
        </div>

        {/* ================= 1. ADELOS MINIMALIST FLOATING NAVBAR ================= */}
        <DialedNavbar
          totalCompleted={totalCompleted}
          projects={projects}
          onSelectProject={onSelectProject}
          onSelectInitialProject={() => onSelectProject(pythonProjects[0] || projects[0])}
          onResetFilter={() => {}}
        />

        {/* ================= SCENE 01: FULL-SCREEN MONUMENTAL HERO ================= */}
        <section 
          ref={heroRef} 
          className="relative z-10 w-full h-screen min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 text-center select-none"
        >
          <motion.div 
            style={{ opacity: heroOpacity, y: heroTranslateY }}
            className="space-y-6 sm:space-y-8 will-change-transform flex flex-col items-center max-w-6xl w-full"
          >
            {/* Monumental Headline */}
            <h1 className="gsap-hero-item text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-sans font-bold tracking-[-0.035em] leading-[1.15] max-w-5xl w-full select-none">
              <span className="block text-white sm:whitespace-nowrap">
                Build from the{' '}
                <span className="inline-block font-serif italic font-normal tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-white pb-3 pt-1 -mb-3 pr-2">
                  ground up.
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="gsap-hero-item text-[16px] sm:text-[18px] lg:text-[20px] text-[#EDEDED] font-sans font-normal sm:font-medium tracking-normal leading-[1.65] max-w-xl select-none mt-4 sm:mt-6">
              Master the fundamentals. Engineer real systems.
              <br className="hidden sm:inline" />
              {' '}Understand how software truly works.
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-10 space-y-2.5">
            <span className="font-serif italic text-sm sm:text-[15px] text-neutral-300 tracking-wide select-none">
              Scroll to explore
            </span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-neutral-400 via-neutral-500/50 to-transparent" />
          </div>
        </section>

        {/* ================= SCENE 02: FROM LINES TO IMPACT ================= */}
        <Scene02Impact
          onSelectProject={() => onSelectProject(pythonProjects[0] || projects[0])}
        />

        {/* ================= FOOTER: 108 SUPPLY INSPIRED COPPER GLOW FOOTER ================= */}
        <DevForgeFooter
          projects={projects}
          onSelectProject={onSelectProject}
          onSelectInitialProject={() => onSelectProject(pythonProjects[0] || projects[0])}
        />

      </div>
    </TooltipProvider>
  );
};
