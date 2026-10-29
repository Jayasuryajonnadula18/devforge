'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from '../reactbits/SplitText';

interface Scene01HeroProps {
  onSelectProject?: () => void;
  onOpenCommandPalette?: () => void;
}

/**
 * DEVFORGE — SCENE 01: "MEET DEVFORGE."
 *
 * Creative Direction:
 * - Brand reveals itself while something is being built.
 * - Dual simultaneous event:
 *   1. Custom architectural hammer-and-anvil symbol constructed progressively on the right.
 *   2. Monumental headline "Meet DevForge." reveals on the left via React Bits SplitText.
 * - One deliberate hammer strike with restrained kinetic impact response.
 * - Scroll-driven transition: Anvil separates into coordinated geometric building fragments.
 * - Strict monochromatic palette: #080808 background, #F5F5F5 primary text, #929292 secondary.
 * - Full reduced-motion support.
 */
export const Scene01Hero: React.FC<Scene01HeroProps> = ({
  onSelectProject,
  onOpenCommandPalette,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineBoxRef = useRef<HTMLDivElement>(null);
  const anvilGroupRef = useRef<SVGGElement>(null);
  const hammerGroupRef = useRef<SVGGElement>(null);
  const impactPulseRef = useRef<SVGCircleElement>(null);
  const impactGleamRef = useRef<SVGLineElement>(null);

  // Anvil geometric fragments for scroll decoupling
  const fragHornRef = useRef<SVGPathElement>(null);
  const fragFaceRef = useRef<SVGPathElement>(null);
  const fragStepRef = useRef<SVGPathElement>(null);
  const fragWaistRef = useRef<SVGPathElement>(null);
  const fragBaseRef = useRef<SVGPathElement>(null);

  // SVG Stroke paths for progressive line construction
  const anvilOutlineRef = useRef<SVGPathElement>(null);
  const hammerHandleRef = useRef<SVGPathElement>(null);
  const hammerHeadRef = useRef<SVGPathElement>(null);

  const sublineRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isAnimationSettled, setIsAnimationSettled] = useState(false);

  // Coordinated Timeline Assembly
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // References
    const anvilOutline = anvilOutlineRef.current;
    const hammerHandle = hammerHandleRef.current;
    const hammerHead = hammerHeadRef.current;
    const anvilGroup = anvilGroupRef.current;
    const hammerGroup = hammerGroupRef.current;
    const subline = sublineRef.current;
    const scrollCue = scrollCueRef.current;
    const header = headerRef.current;
    const impactPulse = impactPulseRef.current;
    const impactGleam = impactGleamRef.current;

    const fragments = [
      fragHornRef.current,
      fragFaceRef.current,
      fragStepRef.current,
      fragWaistRef.current,
      fragBaseRef.current,
    ].filter(Boolean);

    if (prefersReducedMotion) {
      // Instant settle for reduced motion users
      if (anvilOutline) gsap.set(anvilOutline, { strokeDashoffset: 0, opacity: 0 });
      if (fragments.length) gsap.set(fragments, { opacity: 1 });
      if (hammerGroup) gsap.set(hammerGroup, { opacity: 1, rotation: 0, x: 0, y: 0 });
      if (subline) gsap.set(subline, { opacity: 1, y: 0 });
      if (scrollCue) gsap.set(scrollCue, { opacity: 1 });
      if (header) gsap.set(header, { opacity: 1 });
      setIsAnimationSettled(true);
      return;
    }

    // Set initial dash geometry for SVG draw-on
    const pathsToPrepare = [anvilOutline, hammerHandle, hammerHead].filter(Boolean) as SVGPathElement[];
    pathsToPrepare.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
        opacity: 1,
      });
    });

    // Prepare fills and initial positions
    gsap.set(fragments, { opacity: 0 });
    gsap.set(hammerGroup, {
      opacity: 0,
      transformOrigin: '120px 340px', // Pivot at bottom of handle
      rotation: 36,
      x: 18,
      y: -60,
    });
    gsap.set(subline, { opacity: 0, y: 16 });
    gsap.set(scrollCue, { opacity: 0 });
    gsap.set(header, { opacity: 0 });
    if (impactPulse) gsap.set(impactPulse, { opacity: 0, scale: 0.2, transformOrigin: 'center' });
    if (impactGleam) gsap.set(impactGleam, { opacity: 0, strokeDasharray: 400, strokeDashoffset: 400 });

    // Master Timeline
    const tl = gsap.timeline({
      paused: false,
      onComplete: () => {
        setIsAnimationSettled(true);
      },
    });
    timelineRef.current = tl;

    // =========================================================================
    // PHASE B: Construct the Anvil (0.2s - 1.6s)
    // Progressively draw anvil outline from foundational base to horn
    // =========================================================================
    if (anvilOutline) {
      tl.to(
        anvilOutline,
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'power2.inOut',
        },
        0.2
      );
    }

    // Fade in graphite structural fills as line work completes
    tl.to(
      fragments,
      {
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power1.out',
      },
      1.1
    );

    // Fade down line overlay once fills are active
    if (anvilOutline) {
      tl.to(
        anvilOutline,
        {
          opacity: 0.4,
          duration: 0.5,
        },
        1.6
      );
    }

    // =========================================================================
    // PHASE D: Construct the Hammer (1.1s - 2.1s)
    // Draw handle and head; establish mechanical presence poised above anvil
    // =========================================================================
    tl.to(
      hammerGroup,
      {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      },
      1.1
    );

    if (hammerHandle && hammerHead) {
      tl.to(
        [hammerHandle, hammerHead],
        {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'power2.out',
        },
        1.2
      );
    }

    // Anticipation: hammer tilts slightly back before the strike (2.2s - 2.4s)
    tl.to(
      hammerGroup,
      {
        rotation: 44,
        y: -75,
        duration: 0.25,
        ease: 'power1.out',
      },
      2.15
    );

    // =========================================================================
    // PHASE E: The Strike! (2.45s - 2.65s)
    // One deliberate, controlled impact on the anvil working face
    // =========================================================================
    tl.to(
      hammerGroup,
      {
        rotation: -4,
        x: -4,
        y: 6,
        duration: 0.16,
        ease: 'power4.in',
      },
      2.42
    );

    // Impact Response: Kinetic compression pulse through the anvil
    if (anvilGroup) {
      tl.to(
        anvilGroup,
        {
          y: 4,
          duration: 0.08,
          ease: 'power4.in',
          yoyo: true,
          repeat: 1,
        },
        2.58
      );
    }

    // Subtle edge gleam along the anvil face on strike
    if (impactGleam) {
      tl.fromTo(
        impactGleam,
        { opacity: 1, strokeDashoffset: 400 },
        { strokeDashoffset: 0, opacity: 0, duration: 0.35, ease: 'power2.out' },
        2.58
      );
    }

    // Subtle restrained shockwave ring
    if (impactPulse) {
      tl.fromTo(
        impactPulse,
        { opacity: 0.7, scale: 0.3 },
        { opacity: 0, scale: 1.5, duration: 0.45, ease: 'power2.out' },
        2.58
      );
    }

    // =========================================================================
    // PHASE F: Settle into Final Resting Hero (2.65s - 3.4s)
    // Hammer smoothly returns to poise hovering gracefully above the anvil
    // =========================================================================
    tl.to(
      hammerGroup,
      {
        rotation: 16,
        x: 0,
        y: -30,
        duration: 0.65,
        ease: 'power3.out',
      },
      2.68
    );

    // Reveal supporting subline & navigation header
    tl.to(
      subline,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      2.4
    );

    tl.to(
      [header, scrollCue],
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      2.8
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Scroll-Driven Handoff: Decouple anvil fragments as visitor scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / 450, 0), 1);

      // Decouple geometric fragments into distinct modular building blocks
      if (fragHornRef.current) {
        gsap.set(fragHornRef.current, {
          x: progress * 65,
          y: progress * -30,
          rotation: progress * 12,
          opacity: 1 - progress * 0.4,
        });
      }
      if (fragFaceRef.current) {
        gsap.set(fragFaceRef.current, {
          y: progress * -55,
          opacity: 1 - progress * 0.3,
        });
      }
      if (fragStepRef.current) {
        gsap.set(fragStepRef.current, {
          x: progress * -60,
          y: progress * -20,
          rotation: progress * -10,
          opacity: 1 - progress * 0.4,
        });
      }
      if (fragWaistRef.current) {
        gsap.set(fragWaistRef.current, {
          scale: 1 - progress * 0.15,
          opacity: 1 - progress * 0.3,
        });
      }
      if (fragBaseRef.current) {
        gsap.set(fragBaseRef.current, {
          y: progress * 40,
          opacity: 1 - progress * 0.5,
        });
      }
      if (hammerGroupRef.current) {
        gsap.set(hammerGroupRef.current, {
          y: -30 - progress * 80,
          rotation: 16 + progress * 24,
          opacity: 1 - progress * 0.8,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#080808] text-[#F5F5F5] font-sans overflow-hidden flex flex-col justify-between select-none"
    >
      {/* ================= RESTRAINED HEADER ================= */}
      <header
        ref={headerRef}
        className="w-full z-40 px-6 sm:px-12 lg:px-20 py-6 flex items-center justify-between border-b border-[#1c1c1c]/60 bg-[#080808]/90 backdrop-blur-sm"
      >
        {/* Brand Wordmark & Subtle Glyph */}
        <div className="flex items-center space-x-3 cursor-default">
          <div className="w-5 h-5 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-white" strokeWidth="2">
              <path d="M14.5 4h-5L7 7v4h10V7l-2.5-3z" fill="#242424" stroke="currentColor" />
              <path d="M4 11h16v3l-3 6H7l-3-6v-3z" fill="#181818" stroke="currentColor" />
            </svg>
          </div>
          <span className="font-semibold text-base sm:text-lg tracking-[-0.02em] text-[#F5F5F5]">
            DevForge
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#929292] bg-[#151515] rounded border border-[#242424]">
            Systems Engineering
          </span>
        </div>

        {/* Functional Navigation Controls */}
        <nav className="flex items-center space-x-6 text-xs sm:text-[13px] text-[#929292] font-mono">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:inline-flex items-center gap-2 hover:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#151515] border border-[#242424]">⌘K</span>
              <span>Palette</span>
            </button>
          )}

          {onSelectProject && (
            <button
              onClick={onSelectProject}
              className="px-3.5 py-1.5 rounded text-xs font-mono font-medium text-[#F5F5F5] bg-[#151515] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#444444] transition-all cursor-pointer"
            >
              Open Studio →
            </button>
          )}
        </nav>
      </header>

      {/* ================= MAIN TWO-COLUMN VIEWPORT COMPOSITION ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8 lg:py-0">
        
        {/* ================= LEFT SIDE: MONUMENTAL TYPOGRAPHY ================= */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div
            ref={headlineBoxRef}
            className="w-full max-w-[840px] flex flex-col justify-center py-4"
          >
            {/* Monumental Headline: "Meet DevForge." */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[120px] 2xl:text-[134px] font-sans font-bold tracking-[-0.04em] leading-[0.98] text-[#F5F5F5]">
              <SplitText
                text={"Meet\nDevForge."}
                by="chars"
                stagger={0.038}
                duration={0.65}
                delay={0.75}
                ease="power3.out"
              />
            </h1>

            {/* Supporting Prose */}
            <p
              ref={sublineRef}
              className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#929292] font-normal leading-relaxed max-w-xl font-sans"
            >
              A new perspective on learning to build software. Master the architecture of real-world computing systems from the ground up.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: ARCHITECTURAL HAMMER & ANVIL ================= */}
        <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[360px] sm:h-[440px] lg:h-[540px]">
          <svg
            viewBox="0 0 900 800"
            className="w-full h-full max-w-[480px] lg:max-w-none overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic Gradients for Architectural Surface */}
              <linearGradient id="faceGrad" x1="340" y1="350" x2="720" y2="350" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2e2e2e" />
                <stop offset="50%" stopColor="#444444" />
                <stop offset="100%" stopColor="#252525" />
              </linearGradient>

              <linearGradient id="waistGrad" x1="420" y1="520" x2="620" y2="520" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="50%" stopColor="#262626" />
                <stop offset="100%" stopColor="#161616" />
              </linearGradient>

              <linearGradient id="hammerHeadGrad" x1="350" y1="100" x2="480" y2="320" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3c3c3c" />
                <stop offset="50%" stopColor="#4e4e4e" />
                <stop offset="100%" stopColor="#2a2a2a" />
              </linearGradient>

              <linearGradient id="handleGrad" x1="60" y1="360" x2="350" y2="220" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1f1f1f" />
                <stop offset="100%" stopColor="#303030" />
              </linearGradient>
            </defs>

            {/* Impact Wave Pulse */}
            <circle
              ref={impactPulseRef}
              cx="440"
              cy="352"
              r="70"
              stroke="#F5F5F5"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Impact Gleam Line across Anvil Table */}
            <line
              ref={impactGleamRef}
              x1="340"
              y1="352"
              x2="713"
              y2="352"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />

            {/* ================= ANVIL COMPLEX GROUP ================= */}
            <g ref={anvilGroupRef} id="anvil-assembly">
              {/* Fragment 1: Working Face (Top Flat Table) */}
              <path
                ref={fragFaceRef}
                d="M 340 352 L 713 352 L 713 410 L 340 410 Z"
                fill="url(#faceGrad)"
                stroke="#555555"
                strokeWidth="1.5"
              />

              {/* Fragment 2: Horn (Right Tapered Conical Horn) */}
              <path
                ref={fragHornRef}
                d="M 713 352 L 763 416 L 807 447 L 776 473 L 747 490 L 713 505 Z"
                fill="#1f1f1f"
                stroke="#505050"
                strokeWidth="1.5"
              />

              {/* Fragment 3: Heel & Step (Left Lower Shelf) */}
              <path
                ref={fragStepRef}
                d="M 340 383 L 198 383 L 218 420 L 250 454 L 276 473 L 303 487 L 340 499 Z"
                fill="#1c1c1c"
                stroke="#484848"
                strokeWidth="1.5"
              />

              {/* Fragment 4: Waist / Arch (Central Structural Column) */}
              <path
                ref={fragWaistRef}
                d="M 340 499 L 713 505 L 713 550 L 611 551 L 634 597 L 662 632 L 401 610 L 421 580 L 433 551 L 340 550 Z"
                fill="url(#waistGrad)"
                stroke="#3e3e3e"
                strokeWidth="1.5"
              />

              {/* Fragment 5: Plinth / Base Pedestal */}
              <path
                ref={fragBaseRef}
                d="M 300 701 L 753 701 L 753 674 L 710 674 L 662 632 L 379 637 L 344 671 L 340 674 L 300 674 Z"
                fill="#141414"
                stroke="#333333"
                strokeWidth="1.5"
              />

              {/* Single Monolithic Draw-on Outline for Anvil (Progressive stroke construction) */}
              <path
                ref={anvilOutlineRef}
                d="M 300.0 701.0 L 753.0 701.0 L 753.0 674.0 L 710.0 674.0 L 662.0 632.0 L 634.0 597.0 L 611.0 551.0 L 713.0 550.0 L 713.0 505.0 L 747.0 490.0 L 776.0 473.0 L 807.0 447.0 L 763.0 416.0 L 713.0 398.0 L 713.0 352.0 L 340.0 352.0 L 340.0 383.0 L 198.0 383.0 L 218.0 420.0 L 250.0 454.0 L 276.0 473.0 L 303.0 487.0 L 340.0 499.0 L 340.0 550.0 L 433.0 551.0 L 421.0 580.0 L 401.0 610.0 L 379.0 637.0 L 344.0 671.0 L 340.0 674.0 L 300.0 674.0 Z"
                fill="none"
                stroke="#999999"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* ================= HAMMER COMPLEX GROUP ================= */}
            <g ref={hammerGroupRef} id="hammer-assembly">
              {/* Handle */}
              <path
                ref={hammerHandleRef}
                d="M 51 328 L 69 369 L 113 352 L 353 245 L 357 246 L 363 255 L 404 322 L 334 204 Z"
                fill="url(#handleGrad)"
                stroke="#666666"
                strokeWidth="1.8"
              />

              {/* Symmetrical / Heavy Steel Head */}
              <path
                ref={hammerHeadRef}
                d="M 356 94 L 365 98 L 447 177 L 482 288 L 404 322 L 363 255 L 336 200 L 310 114 L 355 95 Z"
                fill="url(#hammerHeadGrad)"
                stroke="#888888"
                strokeWidth="2"
              />

              {/* Hardened Strike Face Tip */}
              <polygon
                points="404,322 482,288 474,310 416,334"
                fill="#666666"
                stroke="#aaaaaa"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>

      </main>

      {/* ================= MINIMAL SCROLL CUE ================= */}
      <footer
        ref={scrollCueRef}
        className="w-full px-6 sm:px-12 lg:px-20 py-6 flex items-center justify-between text-xs font-mono text-[#929292] z-40 pointer-events-none"
      >
        <span className="hidden sm:inline-block">SCENE 01 // ORIGIN</span>
        <div className="flex items-center space-x-2.5 mx-auto sm:mx-0">
          <span className="tracking-widest uppercase text-[11px]">SCROLL TO EXPLORE</span>
          <svg className="w-3.5 h-3.5 stroke-current animate-bounce" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </footer>
    </div>
  );
};
