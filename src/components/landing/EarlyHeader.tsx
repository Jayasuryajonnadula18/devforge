'use client';

import React from 'react';
import { ForgeSymbol } from '../icons/ForgeSymbol';

interface EarlyHeaderProps {
  onOpenPrototype?: () => void;
}

export const EarlyHeader: React.FC<EarlyHeaderProps> = ({ onOpenPrototype }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-md px-6 sm:px-12 lg:px-20 py-4 text-sm font-sans">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand & Stage Identifier */}
        <div className="flex items-center space-x-3.5">
          <div className="text-white flex items-center">
            <ForgeSymbol size={22} className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            DevForge
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium text-neutral-400 bg-white/[0.04] border border-white/[0.08]">
            early research &amp; concept
          </span>
        </div>

        {/* Minimal Navigation */}
        <nav className="flex items-center space-x-6 text-xs sm:text-[13px] text-neutral-400">
          <a 
            href="#hypothesis" 
            className="hover:text-white transition-colors duration-150"
          >
            Hypothesis
          </a>
          <a 
            href="#exploration" 
            className="hover:text-white transition-colors duration-150"
          >
            Exploration
          </a>
          <a 
            href="#feedback" 
            className="hover:text-white transition-colors duration-150"
          >
            Share Feedback
          </a>
          {onOpenPrototype && (
            <button
              onClick={onOpenPrototype}
              className="px-2.5 py-1 rounded text-xs font-mono text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] transition-colors cursor-pointer"
              title="Inspect early workstation prototype"
            >
              Prototype Studio →
            </button>
          )}
        </nav>

      </div>
    </header>
  );
};
