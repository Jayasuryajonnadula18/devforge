'use client';

import React, { useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { FlowingMenu, FlowingMenuItem } from './FlowingMenu';
import { ProjectTrack } from '../../types';
import { triggerComingSoonToast } from '../../lib/navigationConfig';
import './StaggeredMenu.css';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel?: string;
  link?: string;
  badge?: string;
  onClick?: () => void;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  flowingItems?: FlowingMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  isOpenControlled?: boolean;
  isOpen?: boolean;
  hideToggle?: boolean;
  projects?: ProjectTrack[];
  onSelectStudio?: () => void;
  onSelectProject?: (p: ProjectTrack) => void;
  activeView?: 'main' | 'courses' | 'explore';
  onViewChange?: (view: 'main' | 'courses' | 'explore') => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#180e08', '#2a150b', '#5c2912'],
  items = [],
  flowingItems: customFlowingItems,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false,
  className,
  logoUrl,
  menuButtonColor = '#f5f4f0',
  openMenuButtonColor = '#f5f4f0',
  accentColor = '#f59e0b',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  isOpenControlled = false,
  isOpen: controlledIsOpen = false,
  hideToggle = false,
  projects = [],
  onSelectStudio,
  onSelectProject,
  activeView: controlledActiveView,
  onViewChange,
  onMenuOpen,
  onMenuClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpenControlled ? controlledIsOpen : internalOpen;
  const openRef = useRef(open);
  openRef.current = open;

  const [internalView, setInternalView] = useState<'main' | 'courses' | 'explore'>('main');
  const currentView = controlledActiveView || internalView;

  const setView = (v: 'main' | 'courses' | 'explore') => {
    setInternalView(v);
    onViewChange?.(v);
  };

  const panelRef = useRef<HTMLDivElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Accessible Body Scroll-Lock while menu is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [open]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map((el) => ({ el, start: offscreen }));
    const panelStart = offscreen;

    const tl = gsap.timeline({ paused: true });
    gsap.set(panel, { pointerEvents: 'none' });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, i * 0.08);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.08 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.75;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    // Stagger animation for flowing menu items (fade only to prevent coordinate metric collisions)
    const flowingItems = Array.from(panel.querySelectorAll('.flowing-menu__item'));
    if (flowingItems.length) {
      gsap.set(flowingItems, { opacity: 0 });
      tl.to(
        flowingItems,
        {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.05,
          clearProps: 'opacity',
        },
        panelInsertTime + 0.08
      );
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const panel = panelRef.current;
    if (panel) gsap.set(panel, { pointerEvents: 'none' });

    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
        if (panel) gsap.set(panel, { pointerEvents: 'auto' });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('resize'));
        }
      });
      tl.play(0);
      setTimeout(() => {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('resize'));
      }, 150);
      setTimeout(() => {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('resize'));
      }, 400);
    } else {
      busyRef.current = false;
      if (panel) gsap.set(panel, { pointerEvents: 'auto' });
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.42,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        const flowingItems = Array.from(panel.querySelectorAll('.flowing-menu__item'));
        if (flowingItems.length) gsap.set(flowingItems, { opacity: 0 });
        busyRef.current = false;
        setInternalView('main');
      },
    });
  }, [position]);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  // Sync state if controlled
  useEffect(() => {
    if (isOpenControlled) {
      if (controlledIsOpen) {
        playOpen();
      } else {
        playClose();
      }
      animateColor(controlledIsOpen);
    }
  }, [controlledIsOpen, isOpenControlled, playOpen, playClose, animateColor]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    if (!isOpenControlled) {
      setInternalOpen(target);
      if (target) {
        playOpen();
      } else {
        playClose();
      }
      animateColor(target);
    }
    if (target) {
      onMenuOpen?.();
    } else {
      onMenuClose?.();
    }
  }, [isOpenControlled, playOpen, playClose, animateColor, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      if (!isOpenControlled) {
        setInternalOpen(false);
        playClose();
        animateColor(false);
      }
      onMenuClose?.();
    }
  }, [isOpenControlled, playClose, animateColor, onMenuClose]);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openRef.current) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu]);

  // Click outside to close
  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  const handleOpenStudio = () => {
    closeMenu();
    if (onSelectStudio) {
      onSelectStudio();
    } else if (projects.length > 0 && onSelectProject) {
      onSelectProject(projects[0]);
    }
  };

  // FlowingMenu items: Learn, Explore, About DevForge, Philosophy
  const defaultFlowingItems: FlowingMenuItem[] = [
    {
      text: 'Learn',
      image: '/images/menu/courses-documentation.jpg',
      onClick: () => setView('courses'),
    },
    {
      text: 'Explore',
      image: '/images/menu/the-forge-hardware.jpg',
      onClick: () => setView('explore'),
    },
    {
      text: 'About DevForge',
      image: '/images/menu/architecture-systems.jpg',
      link: '#meet-devforge',
      onClick: closeMenu,
    },
    {
      text: 'Philosophy',
      image: '/images/menu/philosophy-first-principles.jpg',
      link: '#meet-devforge',
      onClick: closeMenu,
    },
  ];

  const resolvedFlowingItems = customFlowingItems || defaultFlowingItems;

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? ({ ['--sm-accent']: accentColor } as React.CSSProperties) : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      {/* Pre-layers disabled for solid background */}

      {/* Standalone Toggle */}
      {!hideToggle && (
        <header className="staggered-menu-header" aria-label="Main navigation header">
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span className="sm-toggle-text">{open ? 'Close' : 'Menu'}</span>
          </button>
        </header>
      )}

      {/* Main Expanded Menu Drawer */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Expanded Navigation"
      >
        {/* Header Bar inside Menu */}
        <div className="flex items-center justify-between pb-6 sm:pb-8 border-b border-white/[0.08] select-none">
          <div
            onClick={() => {
              closeMenu();
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 cursor-pointer group"
            title="DevForge Home"
          >
            <div className="text-white group-hover:scale-105 transition-transform">
              <ForgeSymbol size={26} className="w-6 h-6 text-white" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white">DevForge</span>
          </div>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-medium hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Content Area with AnimatePresence */}
        <div className="sm-panel-inner py-4 flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {currentView === 'main' ? (
              <motion.div
                key="main-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col h-full justify-between gap-6 select-none"
              >
                {/* FlowingMenu from React Bits */}
                <div style={{ height: '460px', position: 'relative' }} className="w-full my-auto">
                  <FlowingMenu
                    items={resolvedFlowingItems}
                    speed={60}
                    stretch={0.6}
                    magnet={0.25}
                    followCursor={0.4}
                    textColor="#ffffff"
                    bgColor="#050608"
                    marqueeBgColor="#ffffff"
                    marqueeTextColor="#050608"
                    dividers={false}
                    intro={false}
                  />
                </div>

                {/* Ecosystem Links and Bottom Statement */}
                <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                  <div className="flex items-center space-x-5">
                    <a
                      href="https://github.com/Jayasuryajonnadula18/devforge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center space-x-1"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                    </a>
                    <a
                      href="#meet-devforge"
                      onClick={closeMenu}
                      className="hover:text-white transition-colors"
                    >
                      Philosophy
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('devforge:open-contact'));
                        }
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Contact
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerComingSoonToast('Terms', 'Official terms and licensing documentation are in preparation.')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Terms
                    </button>
                  </div>
                  <span>© {currentYear} DevForge · Architected from first principles.</span>
                </div>
              </motion.div>
            ) : currentView === 'courses' ? (
              /* Subview: Interactive Curriculum View */
              <motion.div
                key="courses-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col h-full justify-between py-2 select-none"
              >
                <div className="space-y-8">
                  <button
                    type="button"
                    onClick={() => setView('main')}
                    className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-amber-400" />
                    <span>Back to Menu</span>
                  </button>

                  <div className="space-y-4 pt-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-medium">
                      Curriculum
                    </span>

                    <h3 className="font-rector text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                      Coming <span className="italic font-normal text-white">soon.</span>
                    </h3>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-sm pt-1">
                      We are currently engineering production-grade tracks on distributed consensus, compiler architecture, and kernel internals from first principles.
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#meet-devforge"
                      onClick={closeMenu}
                      className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-colors group"
                    >
                      <span>Explore the Foundation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>DevForge Systems</span>
                  <span>In Development</span>
                </div>
              </motion.div>
            ) : (
              /* Subview: Systems Lab / Explore Coming Soon View */
              <motion.div
                key="explore-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col h-full justify-between py-2 select-none"
              >
                <div className="space-y-8">
                  <button
                    type="button"
                    onClick={() => setView('main')}
                    className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-neutral-400" />
                    <span>Back to Menu</span>
                  </button>

                  <div className="space-y-4 pt-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-medium">
                      Systems Lab
                    </span>

                    <h3 className="font-rector text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                      Coming <span className="italic font-normal text-white">soon.</span>
                    </h3>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-sm pt-1">
                      Zero-dependency execution environments, consensus visualizers, and compiler execution sandboxes are under active development.
                    </p>
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      type="button"
                      onClick={handleOpenStudio}
                      className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-white hover:text-neutral-300 transition-colors group cursor-pointer"
                    >
                      <span>Open Full Lab Preview</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>DevForge Studio</span>
                  <span>Under Construction</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
