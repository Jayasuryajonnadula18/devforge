'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface DialedButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: 'glass' | 'white';
}

export const DialedButton: React.FC<DialedButtonProps> = ({
  label,
  onClick,
  className = '',
  variant = 'glass',
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full cursor-pointer select-none transition-all duration-300 active:scale-98 ${
        variant === 'white'
          ? 'bg-white text-black hover:bg-neutral-200'
          : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.09] hover:border-white/20 text-white shadow-[inset_0_0_14px_rgba(255,255,255,0.04)]'
      } ${className}`}
    >
      {/* Rolling Text Container */}
      <div className="h-5 overflow-hidden flex flex-col justify-start">
        <span className="block h-5 leading-5 text-xs font-medium tracking-wide transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {label}
        </span>
        <span className="block h-5 leading-5 text-xs font-medium tracking-wide transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {label}
        </span>
      </div>

      {/* Rotating Circle Icon Badge */}
      <div 
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
          variant === 'white' 
            ? 'bg-black text-white' 
            : 'bg-white text-black'
        }`}
      >
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45" />
      </div>
    </button>
  );
};
