'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { ArrowUpRight, Loader2, Info } from 'lucide-react';
import { ProjectTrack } from '../../types';
import {
  EXPLORE_GROUP,
  ABOUT_GROUP,
  CONNECT_GROUP,
  LEGAL_GROUP,
  triggerComingSoonToast,
} from '../../lib/navigationConfig';

interface DevForgeFooterProps {
  projects?: ProjectTrack[];
  onSelectProject?: (project: ProjectTrack) => void;
  onSelectInitialProject?: () => void;
  onOpenCourses?: () => void;
  onOpenContact?: () => void;
}

export const DevForgeFooter: React.FC<DevForgeFooterProps> = ({
  projects = [],
  onSelectProject,
  onSelectInitialProject,
  onOpenCourses,
  onOpenContact,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newsletterState, setNewsletterState] = useState<'idle' | 'coming-soon'>('idle');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const lastSubmitTimeRef = useRef<number>(0);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Rate-limited, RFC-validated subscription handler with honest Coming Soon state
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Rate-limiting check
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 2500) {
      toast.warning('Please wait a moment before resubmitting.');
      return;
    }
    lastSubmitTimeRef.current = now;

    // 2. Strict Input Validation
    const sanitizedEmail = email.trim();
    if (!sanitizedEmail) {
      toast.error('Email address cannot be empty.');
      return;
    }

    if (sanitizedEmail.length > 254) {
      toast.error('Email address exceeds maximum permissible length.');
      return;
    }

    // RFC 5322 standard email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      toast.error('Please enter a valid, well-formed email address.');
      return;
    }

    // 3. Honest Coming Soon Behavior (No fake subscription backend success)
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setNewsletterState('coming-soon');
      toast.info('Newsletter — Coming soon', {
        description:
          "We're currently preparing our announcement pipeline. Subscription services are not connected yet, so your email has not been stored. Check back soon!",
        duration: 5000,
      });
    }, 450);
  };

  const handleOpenStudio = () => {
    if (onSelectInitialProject) {
      onSelectInitialProject();
    } else if (projects.length > 0 && onSelectProject) {
      onSelectProject(projects[0]);
    }
  };

  const handleOpenCourses = () => {
    if (onOpenCourses) {
      onOpenCourses();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('devforge:open-courses'));
    }
  };

  const handleOpenContact = () => {
    if (onOpenContact) {
      onOpenContact();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('devforge:open-contact'));
    }
  };

  return (
    <footer
      className="relative w-full overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #050608 0%, #0d0907 20%, #2a150b 50%, #5c2912 80%, #7e3a19 100%)',
      }}
    >
      {/* Top Seam Blending (Smooth transition from page dark canvas) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050608] via-[#050608]/70 to-transparent pointer-events-none z-10" />

      {/* Subtle Noise / Film Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient Top Glow / Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 85% 50% at 50% 0%, rgba(5, 6, 8, 0.85) 0%, transparent 80%)',
        }}
      />

      {/* Smoothly Animated Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32 lg:py-36 text-[#f5f4f0]"
      >
        {/* Main Grid: Left Newsletter / Right Navigation Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Closing Message & Newsletter */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-[-0.03em] leading-[1.12] text-white">
                Keep building.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300/80 font-normal max-w-md leading-relaxed">
                Explore ideas, understand systems, and build with intention.
              </p>
            </div>

            {/* Newsletter Form with honest status handling */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-md space-y-3">
              {newsletterState === 'idle' ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    spellCheck={false}
                    disabled={isSubmitting}
                    placeholder="Enter your email"
                    className="h-12 px-4 rounded-xl bg-[#180e08]/90 border border-white/15 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors flex-1 w-full disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.3)] shrink-0 flex items-center justify-center space-x-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <span>Join the list</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs sm:text-sm text-amber-200/90 flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-white">Newsletter subscriptions — Coming soon</p>
                    <p className="text-amber-200/80 leading-relaxed">
                      We do not have a live mailing list backend connected yet, so your email was not stored. Check back soon for first-principles dispatches.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('');
                        setNewsletterState('idle');
                      }}
                      className="text-xs text-amber-400 hover:text-white underline pt-1 cursor-pointer"
                    >
                      Reset form
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Three Clean Navigation Groups (EXPLORE, ABOUT, CONNECT) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {/* 1. EXPLORE */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
                {EXPLORE_GROUP.title}
              </span>
              <ul className="space-y-2.5 text-neutral-300" role="list">
                {EXPLORE_GROUP.items.map((item) => (
                  <li key={item.id}>
                    {item.id === 'courses' ? (
                      <button
                        type="button"
                        onClick={handleOpenCourses}
                        className="hover:text-white transition-colors cursor-pointer text-left block"
                      >
                        {item.label}
                      </button>
                    ) : item.id === 'studio' ? (
                      <button
                        type="button"
                        onClick={handleOpenStudio}
                        className="hover:text-white transition-colors cursor-pointer text-left block"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerComingSoonToast(item.label, item.comingSoonDetail)}
                        className="hover:text-white transition-colors cursor-pointer text-left block"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. ABOUT */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
                ABOUT
              </span>
              <ul className="space-y-2.5 text-neutral-300" role="list">
                {ABOUT_GROUP.items.map((item) => (
                  <li key={item.id}>
                    {item.status === 'implemented' && item.href ? (
                      <a href={item.href} className="hover:text-white transition-colors block">
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerComingSoonToast(item.label, item.comingSoonDetail)}
                        className="hover:text-white transition-colors cursor-pointer text-left block"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. CONNECT */}
            <div className="space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
                {CONNECT_GROUP.title}
              </span>
              <ul className="space-y-2.5 text-neutral-300" role="list">
                {CONNECT_GROUP.items.map((item) => (
                  <li key={item.id}>
                    {item.id === 'contact' ? (
                      <button
                        type="button"
                        onClick={handleOpenContact}
                        className="hover:text-white transition-colors cursor-pointer text-left block"
                      >
                        {item.label}
                      </button>
                    ) : item.status === 'external' && item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors inline-flex items-center space-x-1"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerComingSoonToast(item.label, item.comingSoonDetail)}
                        className="hover:text-white transition-colors cursor-pointer text-left block"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row: Brand Mark, Dynamic Year, Brand Statement, Legal Links */}
        <div className="mt-20 pt-8 border-t border-white/[0.12] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300/80 font-mono tracking-wide">
          {/* Left: Brand mark and statement */}
          <div className="flex items-center space-x-3">
            <div className="text-white">
              <ForgeSymbol size={20} className="w-5 h-5 text-white" />
            </div>
            <span>© {currentYear} DevForge</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-400">Architected from first principles.</span>
          </div>

          {/* Right: Legal Links with Coming Soon notification */}
          <div className="flex items-center space-x-6 text-neutral-400">
            {LEGAL_GROUP.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => triggerComingSoonToast(item.label, item.comingSoonDetail)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default DevForgeFooter;
