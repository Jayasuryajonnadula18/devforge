'use client';

import React, { useState, useEffect } from 'react';
import { useScroll } from 'motion/react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { LiquidGlass } from '../reactbits/LiquidGlass';

interface DialedNavbarProps {
  totalCompleted: number;
  onSelectInitialProject: () => void;
  onOpenCommandPalette?: () => void;
  onResetFilter?: () => void;
}

export const DialedNavbar: React.FC<DialedNavbarProps> = ({
  totalCompleted,
  onSelectInitialProject,
  onOpenCommandPalette,
  onResetFilter,
}) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 25);
    });
  }, [scrollY]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 sm:px-14 lg:px-20 py-7 pointer-events-none">
      {/* 1. Left: Pure Minimalist Standalone White Brand Symbol (Matching Reference Image) */}
      <div 
        onClick={onResetFilter}
        className="pointer-events-auto cursor-pointer select-none group flex items-center"
        title="DevForge"
      >
        <div className="text-white transition-transform duration-300 group-hover:scale-105">
          <ForgeSymbol size={28} className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* 2. Dead Center: Real Optical Liquid Glass Capsule with Lens Refraction */}
      <div className="pointer-events-auto">
        <LiquidGlass
          isScrolled={isScrolled}
          height={54}
          borderRadius={999}
          backgroundOpacity={0}
          displace={0}
          distortionScale={0}
          saturation={0.8}
        >
          <nav className="flex items-center gap-1 px-1.5">
            <button 
              type="button"
              onClick={() => {
                toast('Architecture Atlas — Coming Soon', {
                  description: 'Interactive visual system topologies & distributed system maps dropping in Q1 2027.',
                });
              }}
              className="text-white/60 hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Architecture</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider leading-none">
                Soon
              </span>
            </button>
            <button 
              type="button"
              onClick={() => {
                toast('Curriculum Tracks — Coming Soon', {
                  description: 'Advanced compiler, kernel & distributed consensus tracks launching in private preview.',
                });
              }}
              className="text-white/60 hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Courses</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 tracking-wider leading-none">
                Soon
              </span>
            </button>
            <a 
              href="#meet-devforge" 
              className="text-white/60 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold"
            >
              Philosophy
            </a>
            <button
              onClick={onSelectInitialProject}
              className="text-white/60 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold cursor-pointer"
            >
              Studio
            </button>
          </nav>
        </LiquidGlass>
      </div>

      {/* 3. Right: Clean and Empty on Hero; Appears only after scrolling down */}
      <div className="pointer-events-auto flex items-center space-x-3 w-7 justify-end">
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            aria-hidden={!isScrolled}
            tabIndex={isScrolled ? 0 : -1}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-neutral-300 hover:text-white text-xs font-sans transition-all duration-300 cursor-pointer hover:bg-white/[0.08] ${
              isScrolled
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'saturate(180%)',
              WebkitBackdropFilter: 'saturate(180%)',
              border: 'none',
              boxShadow: 'none',
            }}
            title="Command Menu (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-neutral-300" />
            <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.09] text-neutral-300">⌘K</kbd>
          </button>
        )}
      </div>
    </header>
  );
};
