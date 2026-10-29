'use client';

import React from 'react';

export const LightRays: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Central Ambient Ray Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[800px] h-[450px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(212, 175, 55, 0.15) 40%, transparent 70%)',
        }}
      />

      {/* Atmospheric Diagonal Light Beams (Dialedweb signature) */}
      <div 
        className="absolute top-0 left-1/4 w-[350px] h-[600px] -rotate-12 opacity-10 blur-[80px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 80%)',
        }}
      />
      <div 
        className="absolute top-0 right-1/4 w-[350px] h-[600px] rotate-12 opacity-10 blur-[80px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 80%)',
        }}
      />
    </div>
  );
};
