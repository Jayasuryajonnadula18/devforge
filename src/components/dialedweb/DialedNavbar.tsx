'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useScroll } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { LiquidGlass } from '../reactbits/LiquidGlass';
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSocialItem } from '../reactbits/StaggeredMenu';
import { CoursesDropdown } from './CoursesDropdown';
import { ProjectTrack } from '../../types';

interface DialedNavbarProps {
  totalCompleted: number;
  projects?: ProjectTrack[];
  onSelectProject?: (project: ProjectTrack) => void;
  onSelectInitialProject: () => void;
  onResetFilter?: () => void;
}

export const DialedNavbar: React.FC<DialedNavbarProps> = ({
  totalCompleted,
  projects = [],
  onSelectProject,
  onSelectInitialProject,
  onResetFilter,
}) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isStaggeredOpen, setIsStaggeredOpen] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 25);
    });
  }, [scrollY]);

  // Coordinated Menu Handlers to ensure animations never collide
  const handleToggleCourses = useCallback(() => {
    if (isStaggeredOpen) {
      setIsStaggeredOpen(false);
    }
    setIsCoursesOpen(prev => !prev);
  }, [isStaggeredOpen]);

  const handleOpenStaggered = useCallback(() => {
    if (isCoursesOpen) {
      setIsCoursesOpen(false);
    }
    setIsStaggeredOpen(true);
  }, [isCoursesOpen]);

  const handleCloseStaggered = useCallback(() => {
    setIsStaggeredOpen(false);
  }, []);

  // Global Escape key listener to close active menu cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCoursesOpen(false);
        setIsStaggeredOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const staggeredMenuItems: StaggeredMenuItem[] = [
    {
      label: 'Studio IDE',
      ariaLabel: 'Open Studio IDE',
      onClick: () => {
        setIsStaggeredOpen(false);
        onSelectInitialProject();
      },
    },
    {
      label: 'Curriculum Tracks',
      ariaLabel: 'Browse Courses',
      onClick: () => {
        setIsStaggeredOpen(false);
        setTimeout(() => setIsCoursesOpen(true), 250);
      },
    },
    {
      label: 'The Forge',
      ariaLabel: 'Philosophy & Visual Foundation',
      link: '#meet-devforge',
      onClick: () => {
        setIsStaggeredOpen(false);
      },
    },
    {
      label: 'Architecture Atlas',
      ariaLabel: 'Architecture Topologies',
      onClick: () => {
        setIsStaggeredOpen(false);
        toast.info('Architecture Atlas — Coming Soon', {
          description: 'Interactive visual system topologies & distributed system maps dropping in Q1 2027.',
        });
      },
    },
    {
      label: 'System Invariants',
      ariaLabel: 'Formal System Invariants',
      onClick: () => {
        setIsStaggeredOpen(false);
        toast.info('Formal Invariants Guide — Coming Soon', {
          description: 'Formal proofs and systems safety invariants coming in v1.0.',
        });
      },
    },
  ];

  const socialItems: StaggeredMenuSocialItem[] = [
    { label: 'GitHub', link: 'https://github.com/Jayasuryajonnadula18/devforge' },
    { label: 'Philosophy', link: '#meet-devforge' },
    { label: 'Terms', link: '#' },
  ];

  return (
    <>
      {/* 1. Main Floating Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-20 py-6 pointer-events-none">
        
        {/* Left: DevForge Brand Mark */}
        <div 
          onClick={onResetFilter}
          className="pointer-events-auto cursor-pointer select-none group flex items-center z-20"
          title="DevForge"
        >
          <div className="text-white transition-transform duration-300 group-hover:scale-105">
            <ForgeSymbol size={28} className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Center: Real Optical Liquid Glass Capsule */}
        <div className="pointer-events-auto z-20">
          <LiquidGlass
            isScrolled={isScrolled}
            height={52}
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

              {/* Courses Dropdown Trigger Button */}
              <button 
                type="button"
                onClick={handleToggleCourses}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isCoursesOpen 
                    ? 'text-white bg-white/10 font-semibold' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>Courses</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCoursesOpen ? 'rotate-180 text-amber-300' : 'text-white/50'}`} />
              </button>

              <a 
                href="#meet-devforge" 
                className="text-white/60 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold"
              >
                Philosophy
              </a>

              <button
                type="button"
                onClick={onSelectInitialProject}
                className="text-white/60 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold cursor-pointer"
              >
                Studio
              </button>
            </nav>
          </LiquidGlass>
        </div>

        {/* Right: Reserved for Top-Right spacing & alignment */}
        <div className="w-20 hidden sm:block" />
      </header>

      {/* 2. Seamless StaggeredMenu Drawer (Mounted at Root level with Fixed Positioning) */}
      <StaggeredMenu
        position="right"
        isFixed={true}
        isOpenControlled={true}
        isOpen={isStaggeredOpen}
        onMenuOpen={handleOpenStaggered}
        onMenuClose={handleCloseStaggered}
        colors={['#180e08', '#2a150b', '#5c2912', '#7e3a19']}
        accentColor="#f59e0b"
        menuButtonColor="#f5f4f0"
        openMenuButtonColor="#f5f4f0"
        items={staggeredMenuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
      />

      {/* 3. Kinetic Courses Dropdown (Powered by FlowingMenu) */}
      <CoursesDropdown
        isOpen={isCoursesOpen}
        onClose={() => setIsCoursesOpen(false)}
        projects={projects}
        onSelectProject={(project) => {
          if (onSelectProject) {
            onSelectProject(project);
          } else {
            onSelectInitialProject();
          }
        }}
      />
    </>
  );
};
