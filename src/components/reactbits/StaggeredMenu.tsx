'use client';

import React, { useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { FlowingMenu, FlowingMenuItem } from './FlowingMenu';
import { ProjectTrack } from '../../types';
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
  projects?: ProjectTrack[];
  onSelectProject?: (p: ProjectTrack) => void;
  activeView?: 'main' | 'courses';
  onViewChange?: (view: 'main' | 'courses') => void;
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
  projects = [],
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

  const [internalView, setInternalView] = useState<'main' | 'courses'>('main');
  const currentView = controlledActiveView || internalView;

  const setView = (v: 'main' | 'courses') => {
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

    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 20, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    gsap.set(panel, { pointerEvents: 'none' });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, i * 0.08);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.08 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.8;
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    const flowingItems = Array.from(panel.querySelectorAll('.flowing-menu__item'));
    if (flowingItems.length) {
      gsap.set(flowingItems, { y: 30, opacity: 0 });
      tl.to(
        flowingItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          clearProps: 'transform,opacity'
        },
        panelInsertTime + 0.15
      );
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.35;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
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
        if (flowingItems.length) gsap.set(flowingItems, { y: 30, opacity: 0 });
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });
        busyRef.current = false;
        setInternalView('main');
      }
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
          ease: 'power2.out'
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

  // Default clean FlowingMenu items for DevForge
  const defaultFlowingItems: FlowingMenuItem[] = [
    {
      text: 'Courses',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
      onClick: () => setView('courses'),
    },
    {
      text: 'The Forge',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
      link: '#meet-devforge',
      onClick: () => closeMenu(),
    },
    {
      text: 'Architecture',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
      onClick: () => {
        closeMenu();
        toast.info('Architecture — Coming Soon', {
          description: 'Interactive visual system topologies & distributed system maps dropping in Q1 2027.',
        });
      },
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
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#180e08', '#2a150b', '#5c2912'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>

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

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <AnimatePresence mode="wait">
            {currentView === 'main' ? (
              <motion.div
                key="main-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col h-full justify-between"
              >
                {/* FlowingMenu from React Bits */}
                <div className="flex-1 flex flex-col justify-center py-2">
                  <div style={{ height: '420px', position: 'relative' }} className="w-full">
                    <FlowingMenu
                      items={resolvedFlowingItems}
                      isOpen={open}
                      speed={60}
                      stretch={0.6}
                      magnet={0.25}
                      followCursor={0.4}
                      textColor="#ffffff"
                      bgColor="transparent"
                      marqueeBgColor="#ffffff"
                      marqueeTextColor="#120F17"
                      borderColor="transparent"
                      dividers={false}
                      showIndex={false}
                      showArrow={false}
                      intro={false}
                      align="center"
                      imageShape="pill"
                    />
                  </div>
                </div>

                {displaySocials && socialItems && socialItems.length > 0 && (
                  <div className="sm-socials" aria-label="Social links">
                    <h3 className="sm-socials-title">DevForge Ecosystem</h3>
                    <ul className="sm-socials-list" role="list">
                      {socialItems.map((s, i) => (
                        <li key={s.label + i} className="sm-socials-item">
                          <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Subview: Minimalist Coming Soon View */
              <motion.div
                key="courses-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col h-full justify-between py-2 select-none"
              >
                <div className="space-y-8">
                  {/* Back to main navigation */}
                  <button
                    type="button"
                    onClick={() => setView('main')}
                    className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-amber-400" />
                    <span>Back to Menu</span>
                  </button>

                  <div className="space-y-4 pt-6">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-medium">
                      Curriculum
                    </span>

                    <h3 className="font-rector text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                      Coming <span className="italic font-normal text-amber-200/90">soon.</span>
                    </h3>

                    <p className="text-sm sm:text-base text-neutral-300/80 leading-relaxed font-sans max-w-sm pt-1">
                      We are currently engineering production-grade tracks on distributed consensus, compiler architecture, and kernel internals from first principles.
                    </p>
                  </div>

                  <div className="pt-4">
                    <a
                      href="#meet-devforge"
                      onClick={closeMenu}
                      className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-colors group"
                    >
                      <span>Explore the Foundation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Subtle Minimalist Status Indicator */}
                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>DevForge Systems</span>
                  <span>In Development</span>
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
