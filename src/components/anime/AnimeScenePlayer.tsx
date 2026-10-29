'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Maximize2, Volume2, Compass, Radio, Terminal } from 'lucide-react';

interface AnimeScenePlayerProps {
  act: string;
  kanji: string;
  title: string;
  italicWord: string;
  tagline: string;
  description: string;
  imageSrc: string;
  effect: 'rain' | 'sparks' | 'circuits' | 'aurora';
  aspectRatio?: '16/9' | '21/9';
  actionButton?: React.ReactNode;
}

export const AnimeScenePlayer: React.FC<AnimeScenePlayerProps> = ({
  act,
  kanji,
  title,
  italicWord,
  tagline,
  description,
  imageSrc,
  effect,
  aspectRatio = '16/9',
  actionButton,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Parallax on Mouse Move
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });
  const scale = useSpring(isHovered ? 1.02 : 1, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    setIsHovered(false);
  };

  // Canvas Weather Simulation (Sparks, Rain, Energy Motes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system configuration based on effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life?: number;
    }> = [];

    const particleCount = effect === 'rain' ? 90 : effect === 'sparks' ? 70 : 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: effect === 'rain' ? -0.8 : (Math.random() - 0.5) * 1.5,
        vy: effect === 'rain' ? Math.random() * 8 + 8 : -Math.random() * 2 - 0.5,
        size: effect === 'rain' ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color:
          effect === 'rain'
            ? 'rgba(160, 220, 255, '
            : effect === 'sparks'
            ? 'rgba(255, 180, 80, '
            : effect === 'circuits'
            ? 'rgba(0, 245, 160, '
            : 'rgba(210, 160, 255, ',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (effect === 'rain') {
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.strokeStyle = `${p.color}${p.alpha})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
          ctx.stroke();
        } else {
          // Sparks or floating atmospheric motes
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color + '1)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);

  return (
    <div className="w-full space-y-6 select-none">
      {/* 1. Anime Act Title Card & Editorial Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-neutral-400">
            <span className="text-emerald-400 font-bold">{act}</span>
            <span className="text-neutral-600">//</span>
            <span className="font-serif tracking-wider text-neutral-300">{kanji}</span>
            <span className="text-neutral-600">//</span>
            <span className="uppercase text-[11px] text-neutral-400">{tagline}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-[-0.035em] text-white leading-tight">
            {title}{' '}
            <span className="font-serif italic font-normal tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-white">
              {italicWord}
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-400 font-sans font-light leading-relaxed">
            {description}
          </p>
        </div>

        {actionButton && <div className="self-start md:self-end">{actionButton}</div>}
      </div>

      {/* 2. Interactive 3D Anime Cinema Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
        className="relative w-full rounded-3xl overflow-hidden border border-white/[0.12] bg-[#030406] shadow-2xl group cursor-crosshair"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full aspect-[16/9] overflow-hidden"
        >
          {/* A. Cinematic Ken Burns Camera Drift Background Animation */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              x: [0, -12, 0],
              y: [0, -6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 16,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url("${imageSrc}")` }}
          />

          {/* B. Atmospheric Anime Color Grading & Volumetric Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,8,0.7)_100%)] pointer-events-none" />

          {/* C. Live Canvas Particle Weather Layer (Rain / Sparks / Conduits) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-screen"
          />

          {/* D. Anime HUD Framing & Metadata Watermark */}
          <div className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-[11px] font-mono tracking-wider text-white/70 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CINEMATIC_ANIME // 24FPS_DRIFT</span>
          </div>

          <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-3 text-[11px] font-mono text-white/70 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>STUDIO DEVFORGE // MAPPA AESTHETIC</span>
          </div>

          {/* E. Subtle Film Grain */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
