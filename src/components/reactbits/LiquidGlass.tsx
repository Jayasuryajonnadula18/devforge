'use client';

import React, { useState, useEffect, useRef, useId } from 'react';

export interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B' | 'A';
  yChannel?: 'R' | 'G' | 'B' | 'A';
  mixBlendMode?: 'difference' | 'screen' | 'multiply' | 'normal';
  chromaticAberration?: boolean;
  isScrolled?: boolean;
  style?: React.CSSProperties;
}

/**
 * LiquidGlass:
 * Authentic 1-to-1 reverse-engineered optical liquid glass surface.
 * Uses SVG dynamic feDisplacementMap refraction with ZERO frost and pure optical clarity.
 */
export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  width = 'max-content',
  height = 54,
  borderRadius = 999,
  borderWidth = 0.02,
  brightness = 50,
  opacity = 0.82,
  blur = 0,
  displace = 0, // 0 stdDeviation = ZERO FROST, 100% optical clarity
  backgroundOpacity = 0.0, // 0 frost
  saturation = 0.8, // Saturation strictly set to 0.8 as requested
  distortionScale = 0, // 0 distortion: completely removes the crescent/meniscus warping artifact
  redOffset = 0,
  greenOffset = 0,
  blueOffset = 0,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  chromaticAberration = false,
  isScrolled = false,
  style = {},
}) => {
  const rawId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${rawId}`;
  const redGradId = `red-grad-${rawId}`;
  const blueGradId = `blue-grad-${rawId}`;

  const [isSvgSupported, setIsSvgSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const neutralMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const redMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  const updateMap = () => {
    if (!feImageRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width || (typeof width === 'number' ? width : 306);
    const h = rect.height || (typeof height === 'number' ? height : 54);
    const inset = 0.5 * borderWidth * Math.min(w, h);

    const svgMarkup = `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="#808080"></rect>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGradId})" opacity="0.18" />
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGradId})" opacity="0.18" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${inset}" y="${inset}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `.trim();

    feImageRef.current.setAttribute(
      'href',
      `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`
    );
  };

  // Test SVG backdrop-filter support on mount
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isSafari =
      /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isSafari || isFirefox) {
      setIsSvgSupported(false);
      return;
    }
    const testDiv = document.createElement('div');
    testDiv.style.backdropFilter = `url(#${filterId})`;
    setIsSvgSupported(testDiv.style.backdropFilter !== '');
  }, [filterId]);

  // Synchronize displacement scales and channels
  useEffect(() => {
    updateMap();

    if (chromaticAberration) {
      [
        { ref: redMapRef, offset: redOffset },
        { ref: greenMapRef, offset: greenOffset },
        { ref: blueMapRef, offset: blueOffset },
      ].forEach(({ ref, offset }) => {
        if (ref.current) {
          ref.current.setAttribute('scale', (distortionScale + offset).toString());
          ref.current.setAttribute('xChannelSelector', xChannel);
          ref.current.setAttribute('yChannelSelector', yChannel);
        }
      });
    } else if (neutralMapRef.current) {
      neutralMapRef.current.setAttribute('scale', distortionScale.toString());
      neutralMapRef.current.setAttribute('xChannelSelector', xChannel);
      neutralMapRef.current.setAttribute('yChannelSelector', yChannel);
    }

    if (blurRef.current) {
      blurRef.current.setAttribute('stdDeviation', displace.toString());
    }
  }, [
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
    chromaticAberration,
  ]);

  // ResizeObserver for dynamic reactive sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      setTimeout(updateMap, 0);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(updateMap, 0);
  }, [width, height]);

  const effectiveBgOpacity = isScrolled ? Math.max(0.25, backgroundOpacity) : backgroundOpacity;

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${
        isSvgSupported ? 'glass-surface--svg' : 'glass-surface--fallback'
      } ${className}`}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        border: 'none',
        outline: 'none',
        // Minimal optical liquid glass: zero meniscus artifact, 0.8 saturation, transparent across all scroll states
        background: isScrolled
          ? 'rgba(255, 255, 255, 0.035)'
          : 'rgba(255, 255, 255, 0.025)',
        backdropFilter: distortionScale !== 0 && isSvgSupported
          ? `url(#${filterId}) saturate(${saturation})`
          : `saturate(${saturation})`,
        WebkitBackdropFilter: distortionScale !== 0 && isSvgSupported
          ? `url(#${filterId}) saturate(${saturation})`
          : `saturate(${saturation})`,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.20)',
      }}
    >
      {/* SVG Displacement Filter Element */}
      <svg
        className="glass-surface__filter pointer-events-none opacity-0 absolute inset-0 w-full h-full -z-10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={feImageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            {chromaticAberration ? (
              <>
                <feDisplacementMap
                  ref={redMapRef}
                  in="SourceGraphic"
                  in2="map"
                  id="redchannel"
                  result="dispRed"
                />
                <feColorMatrix
                  in="dispRed"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="red"
                />
                <feDisplacementMap
                  ref={greenMapRef}
                  in="SourceGraphic"
                  in2="map"
                  id="greenchannel"
                  result="dispGreen"
                />
                <feColorMatrix
                  in="dispGreen"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="green"
                />
                <feDisplacementMap
                  ref={blueMapRef}
                  in="SourceGraphic"
                  in2="map"
                  id="bluechannel"
                  result="dispBlue"
                />
                <feColorMatrix
                  in="dispBlue"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="blue"
                />
                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="output" />
              </>
            ) : (
              <feDisplacementMap
                ref={neutralMapRef}
                in="SourceGraphic"
                in2="map"
                id="neutralchannel"
                result="output"
                scale={distortionScale.toString()}
                xChannelSelector={xChannel}
                yChannelSelector={yChannel}
              />
            )}
            <feGaussianBlur
              ref={blurRef}
              in="output"
              stdDeviation={displace.toString()}
            />
          </filter>
        </defs>
      </svg>

      {/* Content Container */}
      <div className="glass-surface__content relative z-10 w-full h-full flex items-center justify-center rounded-[inherit] px-6 py-2">
        {children}
      </div>
    </div>
  );
};
