'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useScroll } from 'motion/react';
import { toast } from 'sonner';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { LiquidGlass } from '../reactbits/LiquidGlass';
import { StaggeredMenu, StaggeredMenuSocialItem } from '../reactbits/StaggeredMenu';
import { FlowingMenuItem } from '../reactbits/FlowingMenu';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'courses'>('main');

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 25);
    });
  }, [scrollY]);

  // Open menu specifically to Courses view
  const handleOpenCoursesInMenu = useCallback(() => {
    setMenuView('courses');
    setIsMenuOpen(true);
  }, []);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const flowingMenuItems: FlowingMenuItem[] = [
    {
      text: 'Courses',
      marquee: 'Courses · Systems Curriculum · Coming Soon · In Private Verification ·',
      onClick: () => {
        setMenuView('courses');
      },
    },
    {
      text: 'The Forge',
      marquee: 'The Forge · First Principles Foundation & Monolith · Architecture · Philosophy ·',
      link: '#meet-devforge',
      onClick: () => {
        setIsMenuOpen(false);
      },
    },
    {
      text: 'Architecture',
      marquee: 'Architecture · Coming Soon · Distributed Topologies & Visual Models ·',
      onClick: () => {
        setIsMenuOpen(false);
        toast.info('Architecture — Coming Soon', {
          description: 'Interactive visual system topologies & distributed system maps dropping in Q1 2027.',
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
                className="text-white/60 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold cursor-pointer"
              >
                Architecture
              </button>

              {/* Courses Button: Opens the Menu directly into the Courses View */}
              <button 
                type="button"
                onClick={handleOpenCoursesInMenu}
                className="text-white/70 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Courses</span>
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

        {/* Right Spacing to balance logo on the left */}
        <div className="w-20 hidden sm:block" />
      </header>

      {/* 2. Unified StaggeredMenu Drawer Hosting Both Navigation & Flowing Courses */}
      <StaggeredMenu
        position="right"
        isFixed={true}
        isOpenControlled={true}
        isOpen={isMenuOpen}
        activeView={menuView}
        onViewChange={(v) => setMenuView(v)}
        onMenuOpen={() => {
          setMenuView('main');
          setIsMenuOpen(true);
        }}
        onMenuClose={() => setIsMenuOpen(false)}
        projects={projects}
        onSelectProject={(project) => {
          if (onSelectProject) {
            onSelectProject(project);
          } else {
            onSelectInitialProject();
          }
        }}
        colors={['#180e08', '#2a150b', '#5c2912', '#7e3a19']}
        accentColor="#f59e0b"
        menuButtonColor="#f5f4f0"
        openMenuButtonColor="#f5f4f0"
        flowingItems={flowingMenuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
      />
    </>
  );
};
