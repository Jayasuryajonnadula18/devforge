'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Compass, Radio, Terminal, Sparkles, Wifi } from 'lucide-react';

interface ScrollAnimeCanvasProps {
  onEnterStudio: () => void;
}

const TOTAL_FRAMES = 72;

export const ScrollAnimeCanvas: React.FC<ScrollAnimeCanvasProps> = ({ onEnterStudio }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Track scroll progress across container (450vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Preload all 72 frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/anime-frames/frame_${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      imgs.push(img);
    }

    imagesRef.current = imgs;
  }, []);

  // Canvas render loop bound to scroll progress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const progress = scrollYProgress.get();
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progress * TOTAL_FRAMES))
      );

      const img = imagesRef.current[frameIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        // High-DPI crisp scaling maintaining 16:9 aspect ratio cover
        const canvasW = canvas.width;
        const canvasH = canvas.height;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvasW / canvasH;

        let renderW = canvasW;
        let renderH = canvasH;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          renderH = canvasW / imgRatio;
          offsetY = (canvasH - renderH) / 2;
        } else {
          renderW = canvasH * imgRatio;
          offsetX = (canvasW - renderW) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

        // Subtle dark cinematic vignette
        const grad = ctx.createRadialGradient(
          canvasW / 2,
          canvasH / 2,
          canvasW * 0.25,
          canvasW / 2,
          canvasH / 2,
          canvasW * 0.75
        );
        grad.addColorStop(0, 'rgba(5, 6, 8, 0)');
        grad.addColorStop(1, 'rgba(5, 6, 8, 0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Resize observer for canvas resolution
    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      if (ctx) ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [imagesLoaded, scrollYProgress]);

  // Derived state for the 4 narrative milestones
  const [currentMilestone, setCurrentMilestone] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (v < 0.25) setCurrentMilestone(0);
      else if (v < 0.50) setCurrentMilestone(1);
      else if (v < 0.75) setCurrentMilestone(2);
      else setCurrentMilestone(3);
    });
  }, [scrollYProgress]);

  const milestones = [
    {
      act: 'ACT 01',
      kanji: '迷宮の罠',
      subtitle: 'The Passivity Illusion',
      title: 'Watching tutorials isn’t',
      italic: 'real learning.',
      desc: 'Passive video consumption creates an illusion of competence that instantly evaporates when you face a blank terminal alone.',
    },
    {
      act: 'ACT 02',
      kanji: '原理の鍛造',
      subtitle: 'The Forge of First Principles',
      title: 'Learn by rebuilding',
      italic: 'real software.',
      desc: 'True engineering competence comes from active synthesis. You don’t copy code—you forge battle-tested systems from the ground up.',
    },
    {
      act: 'ACT 03',
      kanji: '孤立の機構',
      subtitle: 'The Isolated Core',
      title: 'One focused primitive.',
      italic: 'Zero boilerplate.',
      desc: 'When learning entropy, you only build the TagGenerator. Our pre-wired multiplayer host harness seamlessly powers the rest.',
    },
    {
      act: 'ACT 04',
      kanji: '新時代へ',
      subtitle: 'The Dawn of Architecture',
      title: 'Join the era of',
      italic: 'modern developers.',
      desc: 'Stop copying syntax. Start engineering systems. The forge is ready.',
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-[450vh] bg-[#050608] select-none">
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Preloader if still loading frames */}
        {!imagesLoaded && (
          <div className="absolute inset-0 z-40 bg-[#050608] flex flex-col items-center justify-center space-y-4">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              BUFFERING ANIME SEQUENCE // {loadProgress}%
            </div>
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* HTML5 Canvas Rendering Scrubbed Frames */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Top Floating Telemetry Rail */}
        <div className="absolute top-24 inset-x-6 sm:inset-x-12 lg:inset-x-20 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">SCROLL_PLAYBACK // 72_FRAMES</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono text-neutral-400">
            <span>SCROLL PROGRESS:</span>
            <span className="text-white font-bold">
              {Math.min(100, Math.round(scrollYProgress.get() * 100))}%
            </span>
          </div>
        </div>

        {/* Floating Apple-Grade Editorial Story Cards (Synced with Current Milestone) */}
        <div className="absolute bottom-14 sm:bottom-16 inset-x-6 sm:inset-x-12 lg:inset-x-20 z-20 flex flex-col items-start pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMilestone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-2xl bg-black/75 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl pointer-events-auto space-y-4"
            >
              {/* Kanji & Act Header */}
              <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-neutral-400">
                <span className="text-emerald-400 font-bold">
                  {milestones[currentMilestone].act}
                </span>
                <span className="text-neutral-600">//</span>
                <span className="font-serif text-neutral-200">
                  {milestones[currentMilestone].kanji}
                </span>
                <span className="text-neutral-600">//</span>
                <span className="uppercase text-[11px] text-neutral-400">
                  {milestones[currentMilestone].subtitle}
                </span>
              </div>

              {/* High-Impact Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-[-0.035em] text-white leading-tight">
                {milestones[currentMilestone].title}{' '}
                <span className="font-serif italic font-normal tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-white">
                  {milestones[currentMilestone].italic}
                </span>
              </h2>

              {/* Supporting Editorial Paragraph */}
              <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-sans font-light leading-relaxed">
                {milestones[currentMilestone].desc}
              </p>

              {/* Milestone 4 CTA Button */}
              {currentMilestone === 3 && (
                <div className="pt-2">
                  <button
                    onClick={onEnterStudio}
                    className="px-6 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs sm:text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-lg active:scale-95 flex items-center space-x-2"
                  >
                    <span>Enter Python Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll Scrubber Indicator (Bottom Right) */}
        <div className="absolute bottom-8 right-6 sm:right-12 z-20 flex items-center space-x-2 text-[11px] font-mono text-neutral-500 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 pointer-events-none">
          <span>FRAME:</span>
          <span className="text-neutral-300 font-bold">
            {Math.min(TOTAL_FRAMES, Math.floor(scrollYProgress.get() * TOTAL_FRAMES) + 1)} / {TOTAL_FRAMES}
          </span>
        </div>

      </div>
    </div>
  );
};
