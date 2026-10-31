'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useScroll } from 'motion/react';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { LiquidGlass } from '../reactbits/LiquidGlass';
import { StaggeredMenu } from '../reactbits/StaggeredMenu';
import { FlowingMenuItem } from '../reactbits/FlowingMenu';
import { triggerComingSoonToast } from '../../lib/navigationConfig';
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
  const [activeSection, setActiveSection] = useState<'hero' | 'about'>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'courses'>('main');

  // Track scroll state and active section
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 25);

      const aboutEl = document.getElementById('meet-devforge');
      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 150) {
          setActiveSection('about');
          return;
        }
      }
      setActiveSection('hero');
    });
  }, [scrollY]);

  // Open menu specifically to Courses view
  const handleOpenCoursesInMenu = useCallback(() => {
    setMenuView('courses');
    setIsMenuOpen(true);
  }, []);

  // Listen for global custom event (e.g. from Footer or page links)
  useEffect(() => {
    const handleEvent = () => handleOpenCoursesInMenu();
    window.addEventListener('devforge:open-courses', handleEvent);
    return () => window.removeEventListener('devforge:open-courses', handleEvent);
  }, [handleOpenCoursesInMenu]);

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

  const handleScrollHome = () => {
    if (onResetFilter) onResetFilter();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenStudio = () => {
    setIsMenuOpen(false);
    onSelectInitialProject();
  };

  // Flowing menu items: Learn, Explore, About DevForge, Philosophy
  const flowingMenuItems: FlowingMenuItem[] = [
    {
      text: 'Learn',
      image: '/images/menu/courses-documentation.jpg',
      onClick: () => {
        setMenuView('courses');
      },
    },
    {
      text: 'Explore',
      image: '/images/menu/the-forge-hardware.jpg',
      onClick: handleOpenStudio,
    },
    {
      text: 'About DevForge',
      image: '/images/menu/architecture-systems.jpg',
      link: '#meet-devforge',
      onClick: () => {
        setIsMenuOpen(false);
      },
    },
    {
      text: 'Philosophy',
      image: '/images/menu/philosophy-first-principles.jpg',
      link: '#meet-devforge',
      onClick: () => {
        setIsMenuOpen(false);
      },
    },
  ];

  return (
    <>
      {/* 1. Main Floating Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 sm:py-6 pointer-events-none select-none">
        {/* Left: DevForge Brand Mark & Wordmark */}
        <div
          onClick={handleScrollHome}
          className="pointer-events-auto cursor-pointer group flex items-center space-x-2.5 z-20"
          title="DevForge"
        >
          <div className="text-white transition-transform duration-300 group-hover:scale-105">
            <ForgeSymbol size={26} className="w-6 h-6 text-white" />
          </div>
          <span className="font-sans font-bold text-base tracking-tight text-white hidden sm:inline-block">
            DevForge
          </span>
        </div>

        {/* Center: Primary Navigation Links in Optical LiquidGlass Capsule: Paths, Contact, About, Home */}
        <div className="pointer-events-auto z-20 hidden md:block">
          <LiquidGlass
            isScrolled={isScrolled}
            height={48}
            borderRadius={999}
            backgroundOpacity={0}
            displace={0}
            distortionScale={0}
            saturation={0.8}
          >
            <nav className="flex items-center gap-1 px-1.5" aria-label="Primary destinations">
              {/* Paths */}
              <button
                type="button"
                onClick={handleOpenCoursesInMenu}
                className="text-white/70 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
              >
                Paths
              </button>

              {/* Contact */}
              <button
                type="button"
                onClick={() => {
                  triggerComingSoonToast(
                    'Contact',
                    'Direct engineering contact and partnership channel is opening soon.'
                  );
                }}
                className="text-white/70 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
              >
                Contact
              </button>

              {/* About */}
              <a
                href="#meet-devforge"
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                  activeSection === 'about'
                    ? 'text-white bg-white/[0.12] font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                About
              </a>

              {/* Home */}
              <button
                type="button"
                onClick={handleScrollHome}
                className="text-white/70 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 text-[12.8px] font-sans font-medium hover:font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
              >
                Home
              </button>
            </nav>
          </LiquidGlass>
        </div>

        {/* Right: Menu Trigger Button */}
        <div className="pointer-events-auto z-20 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              if (isMenuOpen) {
                setIsMenuOpen(false);
              } else {
                setMenuView('main');
                setIsMenuOpen(true);
              }
            }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="text-white/80 hover:text-white transition-all duration-200 text-[13.5px] font-sans font-medium px-4 py-2 rounded-full hover:bg-white/[0.08] border border-transparent hover:border-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer flex items-center space-x-1.5"
          >
            <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      {/* 2. Structured Expanded Menu Drawer (Flowing Menu + Staggering Menu style) */}
      <StaggeredMenu
        position="right"
        isFixed={true}
        isOpenControlled={true}
        isOpen={isMenuOpen}
        hideToggle={true}
        activeView={menuView}
        onViewChange={(v) => setMenuView(v)}
        onMenuOpen={() => {
          setMenuView('main');
          setIsMenuOpen(true);
        }}
        onMenuClose={() => setIsMenuOpen(false)}
        projects={projects}
        flowingItems={flowingMenuItems}
        onSelectStudio={handleOpenStudio}
        onSelectProject={(project) => {
          setIsMenuOpen(false);
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
      />
    </>
  );
};

export default DialedNavbar;
