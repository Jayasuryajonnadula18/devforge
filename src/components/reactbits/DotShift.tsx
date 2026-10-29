'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface DotShiftProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  glowColor?: string;
  waveSpeed?: number;
  waveAmplitude?: number;
  interactive?: boolean;
  mouseRadius?: number;
  opacity?: number;
  className?: string;
  fadeEdges?: boolean;
}

export const DotShift: React.FC<DotShiftProps> = ({
  dotSize = 1.8,
  gap = 28,
  baseColor = 'rgba(255, 255, 255, 0.16)',
  glowColor = 'rgba(56, 189, 248, 0.85)', // Sky cyan phosphor
  waveSpeed = 0.8,
  waveAmplitude = 6,
  interactive = true,
  mouseRadius = 150,
  opacity = 0.85,
  className = '',
  fadeEdges = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });

  // Window-level mouse tracking so dots react even when hovering over content
  useEffect(() => {
    if (!interactive) return;
    const onWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (e.clientY <= rect.bottom + 120 && e.clientY >= rect.top - 120) {
        mouseRef.current.targetX = e.clientX - rect.left;
        mouseRef.current.targetY = e.clientY - rect.top;
        mouseRef.current.active = true;
      } else {
        mouseRef.current.active = false;
      }
    };

    const onWindowMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onWindowMouseMove, { passive: true });
    document.addEventListener('mouseleave', onWindowMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      document.removeEventListener('mouseleave', onWindowMouseLeave);
    };
  }, [interactive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let time = 0;

    const render = () => {
      time += 0.016 * waveSpeed;

      // Smooth mouse interpolation
      if (interactive) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;
      }

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap) + 2;
      const rows = Math.ceil(height / gap) + 2;
      const startX = (width - (cols - 1) * gap) / 2;
      const startY = (height - (rows - 1) * gap) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = startX + c * gap;
          const originY = startY + r * gap;

          // Harmonic wave shifting offsets
          const waveX = Math.sin(c * 0.28 + time * 1.2) * Math.cos(r * 0.22 + time * 0.9) * waveAmplitude;
          const waveY = Math.cos(c * 0.24 - time * 0.8) * Math.sin(r * 0.3 + time * 1.1) * waveAmplitude;

          let posX = originX + waveX;
          let posY = originY + waveY;

          // Interactive cursor displacement & intensity
          let intensity = 0;
          if (interactive && mouseRef.current.active) {
            const dx = posX - mouseRef.current.x;
            const dy = posY - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius) {
              const factor = (1 - dist / mouseRadius);
              intensity = factor;
              // Magnetic displacement away from pointer
              const push = factor * 10;
              posX += (dx / (dist || 1)) * push;
              posY += (dy / (dist || 1)) * push;
            }
          }

          // Shifting brightness oscillation
          const pulse = (Math.sin(c * 0.4 + r * 0.4 + time * 2) + 1) * 0.5;
          const currentSize = dotSize + intensity * 1.8;

          ctx.beginPath();
          ctx.arc(posX, posY, Math.max(0.6, currentSize), 0, Math.PI * 2);

          if (intensity > 0.05) {
            // Luminous glowing dot near cursor
            ctx.fillStyle = glowColor;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 10 * intensity;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          } else {
            // Ambient resting shifting dot
            ctx.fillStyle = baseColor;
            ctx.globalAlpha = 0.25 + pulse * 0.45;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [dotSize, gap, baseColor, glowColor, waveSpeed, waveAmplitude, interactive, mouseRadius]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />

      {/* Edge Vignette Fades to blend into obsidian canvas */}
      {fadeEdges && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0c0d10] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0c0d10] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0c0d10] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0c0d10] to-transparent" />
        </>
      )}
    </div>
  );
};

export default DotShift;
