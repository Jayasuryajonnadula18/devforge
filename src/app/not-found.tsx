import React from 'react';
import Link from 'next/link';
import { ForgeSymbol } from '../components/icons/ForgeSymbol';
import { ArrowLeft, Terminal, Compass, Mail } from 'lucide-react';

export const metadata = {
  title: '404 — Invariant Not Found | DevForge',
  description: 'The requested route does not map to any active track or laboratory surface in DevForge.',
};

export default function NotFound() {
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
          ERR_CODE // 404_UNRESOLVED
        </div>
      </header>

      {/* Main 404 Hero */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-12 py-16 lg:py-24 flex flex-col justify-center items-start space-y-10 select-none">
        {/* Status Tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Status 404 · Unmapped Route</span>
        </div>

        {/* Monumental Title */}
        <div className="space-y-4">
          <h1 className="font-sans text-7xl sm:text-9xl lg:text-[140px] font-black tracking-[-0.05em] leading-[0.9] text-white">
            404
          </h1>
          <h2 className="font-rector text-2xl sm:text-4xl text-neutral-200 font-semibold tracking-tight pt-2">
            Destination invariant <span className="italic font-normal text-white">not found.</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed font-sans pt-1">
            The path you requested does not map to any active track, system specification, or laboratory surface in DevForge.
          </p>
        </div>

        {/* Diagnostic Invariant Card */}
        <div className="w-full max-w-xl p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-white/[0.05]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Routing Diagnostics</span>
            </div>
            <span className="text-neutral-500">HTTP/2 404</span>
          </div>
          <div className="text-neutral-400 space-y-1">
            <p className="text-neutral-300">Target route unresolved in static router graph.</p>
            <p className="text-neutral-500">Valid destinations: / (Catalog), Studio (Workstation), /contact</p>
          </div>
        </div>

        {/* Navigation Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
          <Link
            href="/"
            className="px-8 py-3.5 bg-white text-black font-sans font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-sm"
          >
            Return to Overview
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-transparent text-neutral-300 hover:text-white font-sans text-xs uppercase tracking-wider border border-white/10 hover:border-white/20 transition-colors text-center cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>Explore Tracks</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-transparent text-neutral-400 hover:text-white font-sans text-xs uppercase tracking-wider transition-colors text-center cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            <span>Report Broken Link</span>
          </Link>
        </div>
      </main>

      {/* Clean Monochromatic Footer */}
      <footer className="w-full px-6 sm:px-12 lg:px-20 py-7 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge · Systems Engineering Lab</span>
        <span>Architected from first principles</span>
      </footer>
    </div>
  );
}
