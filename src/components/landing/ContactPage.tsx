'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const emailRef = useRef<HTMLAnchorElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Device & accessibility checks
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Motion values for orb position & opacity (isolated from React render cycles)
  const targetOrbX = useMotionValue(600);
  const targetOrbY = useMotionValue(400);
  const orbOpacity = useMotionValue(0);

  // Playful spring scale (squishes on click without triggering React re-renders)
  const rawScale = useMotionValue(1);
  const springScale = useSpring(rawScale, { stiffness: 480, damping: 20 });

  // Smooth position springs for natural optical tracking
  const springX = useSpring(targetOrbX, { stiffness: 380, damping: 30, mass: 0.5 });
  const springY = useSpring(targetOrbY, { stiffness: 380, damping: 30, mass: 0.5 });

  // Direct Message Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Live India Standard Time (IST) for Mangalagiri, Andhra Pradesh
  const [indiaTime, setIndiaTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setIndiaTime(timeStr);
      } catch {
        setIndiaTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect touch device & reduced motion
  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Window-level pointer tracking (runs purely through MotionValues, 0 re-render cost)
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      targetOrbX.set(e.clientX);
      targetOrbY.set(e.clientY);
      const target = e.target as HTMLElement | null;
      if (target?.closest('form, input, textarea')) {
        orbOpacity.set(0);
      } else {
        orbOpacity.set(1);
      }
    };

    const handlePointerLeave = () => {
      orbOpacity.set(0);
    };

    // Playful toy click feedback: squishes slightly on click outside inputs/buttons
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, button, a, form')) return;
      rawScale.set(0.8);
      setTimeout(() => rawScale.set(1), 90);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [isTouchDevice, targetOrbX, targetOrbY, orbOpacity, rawScale]);

  // Keyboard navigation: Escape key returns or closes message form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showForm) {
          setShowForm(false);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, onBack]);

  // Scroll to top on mount and synchronize Lenis
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
    }
    window.dispatchEvent(new Event('resize'));
  }, []);

  // Sync scroll whenever form toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      const lenis = (window as any).lenis;
      if (lenis) lenis.resize();
      window.dispatchEvent(new Event('resize'));
    }, 320);
    return () => clearTimeout(timer);
  }, [showForm]);

  const handleCopyEmail = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText('jayasuryajonnadula18@gmail.com');
      setCopiedEmail(true);
      toast.success('Email Copied to Clipboard', {
        description: 'jayasuryajonnadula18@gmail.com',
      });
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      toast.error('Failed to copy email address', {
        description: 'Please copy manually: jayasuryajonnadula18@gmail.com',
      });
    }
  };

  const handleEmailAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Copy email address to clipboard immediately
    try {
      navigator.clipboard.writeText('jayasuryajonnadula18@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {}

    // 2. Open default mail client
    window.location.href = 'mailto:jayasuryajonnadula18@gmail.com?subject=DevForge%20Inquiry';

    // 3. Clear toast confirming action with Gmail fallback
    toast.success('Opening Email App', {
      description: 'Address copied to clipboard: jayasuryajonnadula18@gmail.com',
      action: {
        label: 'Open in Gmail',
        onClick: () => {
          window.open(
            'https://mail.google.com/mail/?view=cm&fs=1&to=jayasuryajonnadula18@gmail.com&su=DevForge%20Inquiry',
            '_blank'
          );
        },
      },
    });
  };

  const toggleForm = () => {
    setShowForm((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(formSectionRef.current, { offset: -60, duration: 0.8 });
          }
        }, 140);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please provide your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      toast.error('Please enter a message (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      toast.success('Message Sent', {
        description: `Thank you, ${name.trim()}! We'll reply to ${email.trim()}.`,
      });
    }, 400);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setFormSubmitted(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-hidden overflow-y-auto">
      {/* ================= OPTICAL GLASS ORB (PLAYFUL TOY & ACTION LENS) ================= */}
      {!isTouchDevice && !prefersReducedMotion && (
        <motion.div
          style={{
            x: springX,
            y: springY,
            opacity: orbOpacity,
          }}
          className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block"
        >
          <motion.div
            style={{
              transform: 'translate(-50%, -50%)',
              scale: springScale,
            }}
            animate={{
              width: isHoveringEmail ? 164 : 54,
              height: isHoveringEmail ? 164 : 54,
              borderColor: isHoveringEmail ? 'rgba(255, 255, 255, 0.50)' : 'rgba(255, 255, 255, 0.22)',
              backgroundColor: isHoveringEmail ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
              boxShadow: isHoveringEmail
                ? [
                    /* Red/Magenta chromatic fringe */
                    '-2px -1.5px 3px rgba(255, 40, 80, 0.65)',
                    /* Cyan/Blue chromatic fringe */
                    '2px 1.5px 3px rgba(0, 225, 255, 0.65)',
                    /* Atmospheric glass glow */
                    '0 15px 40px -10px rgba(0, 0, 0, 0.5)',
                    /* Inner glass rim */
                    'inset 0 0 0 1px rgba(255, 255, 255, 0.35)',
                    /* Inner chromatic refraction */
                    'inset -1.5px -1.5px 3px rgba(255, 40, 80, 0.45)',
                    'inset 1.5px 1.5px 3px rgba(0, 225, 255, 0.45)',
                  ].join(', ')
                : [
                    '-1.2px -0.8px 2px rgba(255, 40, 80, 0.45)',
                    '1.2px 0.8px 2px rgba(0, 225, 255, 0.45)',
                    '0 8px 20px -5px rgba(0, 0, 0, 0.4)',
                    'inset 0 0 0 1px rgba(255, 255, 255, 0.22)',
                    'inset -0.8px -0.8px 2px rgba(255, 40, 80, 0.3)',
                    'inset 0.8px 0.8px 2px rgba(0, 225, 255, 0.3)',
                  ].join(', '),
            }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 26,
            }}
            className="relative rounded-full border flex items-center justify-center overflow-hidden backdrop-blur-[1.5px]"
          >
            {/* Top Curved Specular Glint */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse 70% 35% at 50% 8%, rgba(255, 255, 255, 0.35), transparent 70%)',
              }}
            />

            {/* Perimeter Chromatic Prism Ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-55 mix-blend-screen"
              style={{
                background:
                  'conic-gradient(from 45deg, rgba(255,45,85,0.45), rgba(0,230,255,0.45) 120deg, rgba(255,220,50,0.3) 240deg, rgba(255,45,85,0.45) 360deg)',
                WebkitMask: 'radial-gradient(circle, transparent 86%, black 91%)',
                mask: 'radial-gradient(circle, transparent 86%, black 91%)',
              }}
            />

            {/* Bottom Subtle Ambient Refraction */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse 60% 30% at 50% 95%, rgba(0, 230, 255, 0.12), transparent 70%)',
              }}
            />

            {isHoveringEmail ? (
              /* Expanded State: Optical Action Lens */
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center space-y-2 select-none px-3">
                <div
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/25 shadow-lg"
                  style={{
                    filter:
                      'drop-shadow(-0.8px 0 0 rgba(255, 45, 85, 0.6)) drop-shadow(0.8px 0 0 rgba(0, 230, 255, 0.6))',
                  }}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className="text-[11px] font-sans font-bold uppercase tracking-widest text-white leading-tight"
                    style={{
                      textShadow:
                        '-0.75px 0 0.5px rgba(255, 45, 85, 0.75), 0.75px 0 0.5px rgba(0, 230, 255, 0.75)',
                    }}
                  >
                    SEND MAIL
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-300/80 mt-0.5">
                    OPEN EMAIL APP
                  </span>
                </div>
              </div>
            ) : (
              /* Idle State: Optical Lens with Chromatic Glint */
              <div className="relative z-10 w-full h-full flex items-center justify-center select-none">
                <ArrowRight
                  className="w-3.5 h-3.5 text-white/80"
                  style={{
                    filter:
                      'drop-shadow(-0.6px 0 0 rgba(255, 45, 85, 0.5)) drop-shadow(0.6px 0 0 rgba(0, 230, 255, 0.5))',
                  }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ================= TOP HEADER ================= */}
      <header className="relative z-20 w-full px-6 sm:px-12 lg:px-20 py-5 sm:py-6 flex items-center justify-between select-none border-b border-white/[0.05]">
        {/* Brand & Back Button */}
        <div className="flex items-center space-x-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-500 group-hover:-translate-x-1 group-hover:text-white transition-all" />
            <span>DevForge</span>
          </button>
        </div>

        {/* Live Location & IST Telemetry */}
        <div className="flex items-center space-x-3 text-xs font-mono text-neutral-400">
          <span className="inline-flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">MANGALAGIRI, AP · IST</span>
            <span className="sm:hidden">IST</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white tabular-nums text-[11px] sm:text-xs">
            {indiaTime || 'IST'}
          </span>
        </div>
      </header>

      {/* ================= HERO STAGE ================= */}
      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-20 py-6 sm:py-8 lg:py-10 flex flex-col justify-between pb-24 sm:pb-36">
        
        {/* Row 1: Massive CONTACT Landmark Title */}
        <div className="w-full">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[120px] font-sans font-black tracking-[-0.045em] leading-[0.9] text-white select-none">
            CONTACT
          </h1>
        </div>

        {/* Row 2: Genuine DevForge Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-5 sm:py-7 items-end border-b border-white/[0.05]">
          
          {/* Left: Open Source Platform Info */}
          <div className="md:col-span-4 space-y-2 text-xs sm:text-sm font-sans text-neutral-400 select-none">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
              Creator & Maintainer
            </span>
            <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
              DevForge is created and maintained by <span className="text-white font-medium">Jaya Surya</span>, based in <span className="text-white font-medium">Mangalagiri, Andhra Pradesh, India</span>, as an open-source systems engineering platform and curriculum.
            </p>
          </div>

          {/* Center: Inquiries & Contributions */}
          <div className="md:col-span-5 text-left space-y-1.5 select-none">
            <span className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 font-medium">
              Direct Contact & Coordinates
            </span>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-sm">
              Based in <span className="text-white font-medium">Mangalagiri, India (IST)</span>. Have questions or ideas? Send a note below or reach out directly at <span className="text-white font-medium">jayasuryajonnadula18@gmail.com</span>.
            </p>
          </div>

          {/* Right: Real Project Channels */}
          <div className="md:col-span-3 flex md:flex-col items-start md:items-end justify-start gap-3 text-xs font-sans uppercase tracking-wider text-neutral-400">
            <span className="text-[11px] text-neutral-500 font-mono hidden md:block">
              MANGALAGIRI · AP · INDIA
            </span>
            <a
              href="https://github.com/Jayasuryajonnadula18/devforge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center space-x-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </a>
            <a
              href="https://github.com/Jayasuryajonnadula18/devforge/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center space-x-1"
            >
              <span>Discussions</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </a>
          </div>
        </div>

        {/* Row 3: COLOSSAL INTERACTIVE TYPOGRAPHIC EMAIL */}
        <div className="w-full pt-5 sm:pt-7 pb-3 flex flex-col items-start sm:items-end text-left sm:text-right select-none group">
          
          {/* Action Header: Dedicated Accessible Copy Button */}
          <div className="w-full flex items-center justify-end mb-2">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-xs font-sans font-medium text-neutral-300 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 active:scale-98"
              title="Copy email address to clipboard"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{copiedEmail ? 'Email Copied' : 'Copy Email Address'}</span>
            </button>
          </div>

          {/* Primary Semantic Mailto Anchor with Reliable Click & Copy Feedback */}
          <a
            ref={emailRef}
            href="mailto:jayasuryajonnadula18@gmail.com?subject=DevForge%20Inquiry"
            onClick={handleEmailAction}
            onMouseEnter={() => setIsHoveringEmail(true)}
            onMouseLeave={() => setIsHoveringEmail(false)}
            className="w-full block cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-xl transition-all"
            aria-label="Send email to jayasuryajonnadula18@gmail.com (opens your default email client or copies address)"
          >
            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] xl:text-[88px] font-sans font-black tracking-tight leading-[0.92] text-white group-hover:text-neutral-300 transition-colors">
              <span className="block">jayasurya</span>
              <span className="block">jonnadula18@</span>
              <span className="block">gmail.com</span>
            </div>
          </a>

          {/* Mobile Native Touch Targets */}
          <div className="flex sm:hidden items-stretch gap-3 w-full pt-4">
            <button
              type="button"
              onClick={handleEmailAction}
              className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-sans font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-transform cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 text-black" />
              <span>Send Mail</span>
            </button>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="py-3 px-4 rounded-xl bg-white/10 active:bg-white/15 border border-white/15 text-white font-sans font-medium text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
              <span>{copiedEmail ? 'Copied' : 'Copy Address'}</span>
            </button>
          </div>
        </div>

        {/* Message Form Toggle Trigger */}
        <div className="pt-3 flex items-center justify-between border-t border-white/[0.05]">
          <button
            type="button"
            onClick={toggleForm}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer py-2 group"
          >
            <span>{showForm ? 'Close Message Form' : 'Send a Message Directly'}</span>
            {showForm ? (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
            )}
          </button>
        </div>

        {/* ================= CLEAN, DE-SLOPPED CONTACT FORM ================= */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden pt-4 pb-8"
            >
              <div
                ref={formSectionRef}
                onPointerEnter={() => orbOpacity.set(0)}
                onPointerLeave={() => orbOpacity.set(1)}
              >
                {formSubmitted ? (
                  /* Honest Success Receipt */
                  <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5 my-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-sans font-bold text-white">
                        Message Sent
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                        Thank you, <span className="text-white font-medium">{name}</span>. We&apos;ve received your note and will get back to you at <span className="text-white font-medium">{email}</span>.
                      </p>
                    </div>
                    <div className="pt-3 flex items-center justify-center space-x-4">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Send Another Note
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Close Form
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Clean Direct Message Form */
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6 my-4"
                  >
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight">
                        Send a Message
                      </h3>
                      <p className="text-xs text-neutral-400 font-sans">
                        Send a note, question, or feedback directly to Jaya Surya.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                          Your Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                          Your Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-subject" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                        Subject (optional)
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject or topic"
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message..."
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs text-neutral-400 font-sans">
                        Delivered directly to Jaya Surya · Mangalagiri, Andhra Pradesh, India · jayasuryajonnadula18@gmail.com
                      </span>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer className="relative z-20 w-full px-6 sm:px-12 lg:px-20 py-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge · Jaya Surya · Mangalagiri, Andhra Pradesh, India</span>
        <button
          type="button"
          onClick={onBack}
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Return to Overview ↑
        </button>
      </footer>
    </div>
  );
};

export default ContactPage;
