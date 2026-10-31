'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ExploreComingSoonProps {
  onBack: () => void;
}

const LAB_TRACKS = [
  {
    title: 'Distributed Systems',
    description: 'Multi-node Raft consensus engines, network partition injection, and Byzantine fault recovery without third-party frameworks.',
  },
  {
    title: 'Compiler & VM Architecture',
    description: 'Zero-copy tokenization, stack-based bytecode execution engines, and SSA intermediate representation builders.',
  },
  {
    title: 'Kernel & Memory Primitives',
    description: 'Virtual memory page table translation, slab allocators, and lock-free concurrency queues from the bare metal up.',
  },
];

export const ExploreComingSoon: React.FC<ExploreComingSoonProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubscribed(true);
    toast.success('Waitlist Confirmed', {
      description: 'You will receive an early access invite when the Systems Lab launches.',
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-8 flex items-center justify-between border-b border-white/[0.06] select-none">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-sans font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Return to DevForge
        </button>

        <span className="font-sans font-bold text-base tracking-tight text-white">
          DevForge
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 lg:px-20 py-16 lg:py-24 space-y-16">
        {/* Monumental Headline */}
        <div className="space-y-4 max-w-3xl">
          <span className="block text-xs font-sans uppercase tracking-wider text-amber-400/90 font-semibold">
            Systems Lab
          </span>
          <h1 className="font-rector text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            Interactive sandboxes.{' '}
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-neutral-300">
              Coming soon.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-sans pt-1">
            We are engineering zero-dependency execution environments to study low-level systems architecture. Inspect state machines, execute custom bytecode, and explore memory layouts from first principles.
          </p>
        </div>

        {/* Systems Pillars — Clean Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-white/[0.08]">
          {LAB_TRACKS.map((track) => (
            <div key={track.title} className="space-y-3">
              <h2 className="text-lg font-sans font-semibold text-white tracking-tight">
                {track.title}
              </h2>
              <p className="text-sm text-neutral-400 font-sans leading-relaxed">
                {track.description}
              </p>
            </div>
          ))}
        </div>

        {/* Underlined Minimalist Early Access Dispatch */}
        <div className="pt-12 border-t border-white/[0.08] max-w-xl">
          {isSubscribed ? (
            <p className="text-sm font-sans text-neutral-300">
              Your request is registered. We will send private access credentials prior to public launch.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <label htmlFor="lab-email" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                Receive Lab Access Invitation
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="lab-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  className="flex-1 bg-transparent border-b border-white/20 py-3 text-base text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black font-sans font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full px-6 sm:px-12 lg:px-20 py-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge</span>
        <span>Systems Architecture</span>
      </footer>
    </div>
  );
};
