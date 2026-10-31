'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ForgeSymbol } from '../components/icons/ForgeSymbol';
import { AlertTriangle, RefreshCw, ArrowLeft, Terminal } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundaryPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception safely in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('DevForge Route Exception captured:', error);
    }
  }, [error]);

  const sanitizedMessage = (error?.message || 'Unknown system invariant violation').replace(
    /([a-zA-Z]:|\/)[^\s:]+/g,
    '[system-path]'
  );

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-8 flex items-center justify-between border-b border-white/[0.06] select-none">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-neutral-500 group-hover:-translate-x-1 group-hover:text-white transition-all" />
          <span>Return to DevForge</span>
        </Link>

        <div className="flex items-center space-x-2.5 select-none">
          <ForgeSymbol size={20} className="w-4 h-4 text-white" />
          <span className="font-sans font-bold text-sm tracking-tight text-white">
            DevForge
          </span>
        </div>

        <div className="text-xs font-mono text-neutral-500 hidden sm:block">
          ERR_CODE // 500_SYSTEM_FAULT
        </div>
      </header>

      {/* Main Error Stage */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-12 py-16 lg:py-24 flex flex-col justify-center items-start space-y-10 select-none">
        {/* Status Tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-neutral-400">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Runtime Fault Intercepted</span>
        </div>

        {/* Monumental Headline */}
        <div className="space-y-4">
          <h1 className="font-rector text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            System Invariant <span className="italic font-normal text-white">Exception.</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed font-sans pt-1">
            An execution anomaly occurred in the compute or rendering tree. The DevForge supervisor caught this exception and prevented a system crash.
          </p>
        </div>

        {/* Diagnostic Snapshot Box */}
        <div className="w-full max-w-xl p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-white/[0.05]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Fault Diagnostic Trace</span>
            </div>
            {error.digest && (
              <span className="text-[11px] text-neutral-500">Digest: #{error.digest}</span>
            )}
          </div>
          <p className="text-neutral-300 break-words font-mono text-[11px] leading-relaxed">
            {sanitizedMessage}
          </p>
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-white text-black font-sans font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate State</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent text-neutral-300 hover:text-white font-sans text-xs uppercase tracking-wider border border-white/10 hover:border-white/20 transition-colors text-center cursor-pointer"
          >
            Return to Safe Overview
          </Link>
        </div>
      </main>

      {/* Clean Monochromatic Footer */}
      <footer className="w-full px-6 sm:px-12 lg:px-20 py-7 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge · Systems Engineering Lab</span>
        <span>Fault Tolerance &amp; Supervisor Architecture</span>
      </footer>
    </div>
  );
}
