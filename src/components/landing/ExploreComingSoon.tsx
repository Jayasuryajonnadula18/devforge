'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Cpu, Network, Terminal, CheckCircle2 } from 'lucide-react';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { toast } from 'sonner';

interface ExploreComingSoonProps {
  onBack: () => void;
}

export const ExploreComingSoon: React.FC<ExploreComingSoonProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid engineering email address.');
      return;
    }
    setIsSubscribed(true);
    toast.success('You have been added to the early access list.', {
      description: 'We will notify you when the Systems Lab launches.',
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      {/* Background Volumetric Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full blur-[160px] opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.1) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-6 border-b border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Overview</span>
        </button>

        <div className="flex items-center space-x-2.5 select-none">
          <ForgeSymbol size={22} className="w-5 h-5 text-amber-400" />
          <span className="font-sans font-bold text-sm tracking-tight text-white">DevForge</span>
        </div>
      </header>

      {/* Main Monumental Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-16 text-center max-w-5xl mx-auto w-full">
        {/* Category Header */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-medium mb-4 block"
        >
          Systems Lab
        </motion.span>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white leading-[1.1] max-w-4xl"
        >
          Explore Systems.{' '}
          <span className="font-rector italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white">
            Coming soon.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-300/80 font-sans max-w-2xl mt-6 leading-relaxed"
        >
          We are currently engineering interactive, zero-dependency sandboxes for real systems engineering. Inspect distributed consensus topologies, run bytecode in simulated stack machines, and explore kernel memory layouts from first principles.
        </motion.p>

        {/* Systems Pillars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left w-full mt-12 mb-12"
        >
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-semibold text-white text-base mb-1.5 group-hover:text-amber-200 transition-colors">
              Distributed Systems
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Live multi-node Raft state machines, network partition injection, and Byzantine fault simulation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-semibold text-white text-base mb-1.5 group-hover:text-emerald-200 transition-colors">
              Compiler & VM Internals
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Zero-copy AST parsers, stack-based bytecode evaluation, and SSA intermediate representation builders.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/[0.08] border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-semibold text-white text-base mb-1.5 group-hover:text-blue-200 transition-colors">
              Kernel Primitives
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Virtual memory page tables, slab allocators, and lock-free concurrency rings without standard library crutches.
            </p>
          </div>
        </motion.div>

        {/* Early Access Notification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-md bg-white/[0.02] border border-white/[0.08] p-5 sm:p-6 rounded-2xl"
        >
          {isSubscribed ? (
            <div className="flex items-center justify-center space-x-2 text-emerald-400 py-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-sans font-medium">Access request confirmed. We will reach out.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="lab-email" className="block text-xs font-mono uppercase tracking-wider text-neutral-400 text-left">
                Get notified upon lab launch
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="lab-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-sm hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                >
                  Notify Me
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Footer Links */}
        <div className="flex items-center justify-center space-x-6 text-xs font-mono text-neutral-400 mt-10">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
          <span className="text-white/20">·</span>
          <a
            href="https://github.com/Jayasuryajonnadula18/devforge"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors inline-flex items-center space-x-1"
          >
            <span>GitHub Repository</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-500" />
          </a>
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
        <span>DevForge Systems Architecture</span>
        <span>© {new Date().getFullYear()} DevForge · First Principles</span>
      </footer>
    </div>
  );
};
