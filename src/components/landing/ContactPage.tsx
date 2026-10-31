'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { toast } from 'sonner';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

const INQUIRY_AREAS = [
  'Distributed Consensus',
  'Compiler Architecture',
  'Kernel & Memory Internals',
  'Enterprise Track',
  'Technical Advisory',
  'General Inquiry',
];

const TIMELINE_OPTIONS = [
  'Active Production Sprint',
  'Architectural Planning',
  'Research & Exploration',
];

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const briefFormRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Magnetic Cursor Follower with Collision-Aware Positioning
  const pointerPosRef = useRef({ x: 600, y: 400 });
  const isHoveringEmailRef = useRef(false);
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Position motion values for the orb center
  const targetOrbX = useMotionValue(600);
  const targetOrbY = useMotionValue(400);

  // Spring smoothing with calibrated damping to prevent bouncing / elastic jitter
  const springX = useSpring(targetOrbX, { stiffness: 380, damping: 32, mass: 0.8 });
  const springY = useSpring(targetOrbY, { stiffness: 380, damping: 32, mass: 0.8 });

  // Collision-aware target computation: places orb in nearby open pocket, NEVER obscuring email or pointer
  const updateOrbPosition = (clientX: number, clientY: number, hovering = isHoveringEmailRef.current) => {
    pointerPosRef.current = { x: clientX, y: clientY };

    if (!hovering) {
      // Idle state: center directly on cursor
      targetOrbX.set(clientX);
      targetOrbY.set(clientY);
      return;
    }

    // Contextual expanded state (over email):
    // Collision-aware offset: Keep orb in open space, NEVER covering the email text or pointer!
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const orbRadius = 90;
    const margin = 24;

    const emailRect = emailRef.current?.getBoundingClientRect();

    let computedX = clientX;
    let computedY = clientY;

    if (emailRect) {
      // Collision-aware placement: Strictly place the orb above the email bounding box
      // Target Y center guarantees the bottom of the orb stays above emailRect.top
      const gap = 16;
      const spaceAbove = emailRect.top;

      if (spaceAbove >= orbRadius * 2 + gap) {
        // Float cleanly in the open negative space directly above email text
        computedY = emailRect.top - (orbRadius + gap);
      } else {
        // If constrained above, float cleanly below email text
        computedY = emailRect.bottom + (orbRadius + gap);
      }

      // Horizontally: offset 140px to the open side so the user's pointer is never covered
      const isRightHalf = clientX > windowWidth / 2;
      computedX = isRightHalf ? clientX - 140 : clientX + 140;
    } else {
      computedX = clientX - 140;
      computedY = clientY - 140;
    }

    // Viewport clamping
    const clampedX = Math.max(orbRadius + margin, Math.min(windowWidth - orbRadius - margin, computedX));
    const clampedY = Math.max(orbRadius + margin, Math.min(windowHeight - orbRadius - margin, computedY));

    targetOrbX.set(clampedX);
    targetOrbY.set(clampedY);
  };

  // Follower transform: subtract radius so top-left tracks center
  // Idle: width = 64px, radius = 32px
  // Expanded: width = 180px, radius = 90px
  const followerX = useTransform(springX, (v) => v - (isHoveringEmail ? 90 : 32));
  const followerY = useTransform(springY, (v) => v - (isHoveringEmail ? 90 : 32));

  // Expandable Structured Brief Form
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>(INQUIRY_AREAS[0]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>(TIMELINE_OPTIONS[1]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionTicket, setSubmissionTicket] = useState<{ id: string; timestamp: string } | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Live Studio Clock (Pacific Time PST/PDT)
  const [sfTime, setSfTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setSfTime(timeStr);
      } catch {
        setSfTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect touch device and reduced motion preferences
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

  // Window-level mouse tracking for fixed follower lens
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      updateOrbPosition(e.clientX, e.clientY);
      setCursorVisible(true);
    };
    const handlePointerLeave = () => {
      setCursorVisible(false);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [isTouchDevice, isHoveringEmail]);

  // Keyboard navigation: Escape key returns or closes brief form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showBriefForm) {
          setShowBriefForm(false);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBriefForm, onBack]);

  const handleCopyEmail = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText('engineering@devforge.org');
      setCopiedEmail(true);
      toast.success('Email Copied to Clipboard', {
        description: 'engineering@devforge.org',
      });
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      toast.error('Failed to copy email address', {
        description: 'Please copy manually: engineering@devforge.org',
      });
    }
  };

  const handleCopyPgp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pgp = 'pub 4096R/0x4DF7E99A 2026-01-15 DevForge Engineering Core <engineering@devforge.org>';
    navigator.clipboard.writeText(pgp);
    toast.success('PGP Fingerprint Copied', {
      description: '0x4DF7E99A · 4096R',
    });
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTicket(true);
    toast.success('Reference Copied', {
      description: id,
    });
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const toggleBriefForm = () => {
    setShowBriefForm((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          briefFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          nameInputRef.current?.focus();
        }, 120);
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
      toast.error('Please enter a valid engineering email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      toast.error('Please describe your inquiry or system architecture (min 10 characters).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `DF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const timestamp = new Date().toUTCString();
      setSubmissionTicket({ id: ticketId, timestamp });
      setIsSubmitting(false);
      toast.success('Inquiry Dispatched to Engineering Core', {
        description: `Reference #${ticketId} registered. Direct reply within 24h.`,
      });
    }, 550);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        if (isTouchDevice) return;
        updateOrbPosition(e.clientX, e.clientY);
        if (!cursorVisible) setCursorVisible(true);
      }}
      className="relative min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-hidden"
    >
      {/* ================= CONTEXTUAL GLASS ORB ACTION LENS (NON-OBSTRUCTING) ================= */}
      {!isTouchDevice && !prefersReducedMotion && cursorVisible && (
        <motion.div
          style={{
            x: followerX,
            y: followerY,
          }}
          animate={{
            width: isHoveringEmail ? 180 : 64,
            height: isHoveringEmail ? 180 : 64,
            borderColor: isHoveringEmail ? 'rgba(255, 255, 255, 0.40)' : 'rgba(255, 255, 255, 0.18)',
            backgroundColor: isHoveringEmail ? 'rgba(5, 6, 8, 0.88)' : 'rgba(255, 255, 255, 0.03)',
            boxShadow: isHoveringEmail
              ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12) inset'
              : '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border hidden md:flex items-center justify-center overflow-hidden backdrop-blur-md"
        >
          {isHoveringEmail ? (
            /* Contextual Action Lens: SEND MAIL / OPEN EMAIL APP */
            <div className="relative w-full h-full flex items-center justify-center select-none">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-75 scale-105"
                style={{ backgroundImage: `url('/images/menu/architecture-systems.jpg')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/65" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1.5 px-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white leading-tight">
                    SEND MAIL
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                    OPEN EMAIL APP
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Idle State: Restrained Glass Indicator with directional arrow & subtle reflection */
            <div className="relative w-full h-full flex items-center justify-center select-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent pointer-events-none" />
              <ArrowRight className="w-3.5 h-3.5 text-white/70" />
            </div>
          )}
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

        {/* Center Indicator */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Core Engineering Available</span>
        </div>

        {/* Live Telemetry Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono text-neutral-400">
          <span className="hidden sm:inline">SF PST</span>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white">
            {sfTime || 'San Francisco'}
          </span>
        </div>
      </header>

      {/* ================= HERO STAGE (LE FRUIT MONUMENTAL TYPOGRAPHY) ================= */}
      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-20 py-6 sm:py-8 lg:py-10 flex flex-col justify-between">
        
        {/* Row 1: Massive CONTACT Landmark Title */}
        <div className="w-full">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[120px] font-sans font-black tracking-[-0.045em] leading-[0.9] text-white select-none">
            CONTACT
          </h1>
        </div>

        {/* Row 2: Editorial Middle Layer (Coordinates Left · Ecosystem Right · Prompt Center) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-5 sm:py-7 items-end border-b border-white/[0.05]">
          
          {/* Left: Studio Physical & Invariant Coordinates */}
          <div className="md:col-span-4 space-y-4 text-xs sm:text-sm font-sans text-neutral-400 select-none">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                Systems Engineering Lab
              </span>
              <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
                Mission Bay · CA 94158<br />
                San Francisco, United States
              </p>
            </div>

            <div className="space-y-1 text-xs text-neutral-400 pt-2 border-t border-white/[0.05]">
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Response SLA: &lt; 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Zero sales bots. Direct engineer reply.</span>
              </div>
            </div>
          </div>

          {/* Center: Socratic Invitation Prompt */}
          <div className="md:col-span-5 text-left space-y-1.5 select-none">
            <span className="text-[11px] font-sans uppercase tracking-widest text-neutral-500 font-medium">
              Ready to build from first principles?
            </span>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Distributed protocols, compiler optimization, or kernel internals.
              Drop us your specs or direct questions.
            </p>
          </div>

          {/* Right: Ecosystem Channels */}
          <div className="md:col-span-3 flex md:flex-col items-start md:items-end justify-start gap-3.5 text-xs font-sans uppercase tracking-wider text-neutral-400">
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
            <button
              type="button"
              onClick={handleCopyPgp}
              className="hover:text-white transition-colors inline-flex items-center space-x-1 cursor-pointer"
              title="Copy PGP public fingerprint"
            >
              <KeyRound className="w-3 h-3 text-neutral-500" />
              <span>Copy PGP Key</span>
            </button>
          </div>
        </div>

        {/* Row 3: COLOSSAL INTERACTIVE TYPOGRAPHIC EMAIL & DEDICATED ACTION TOOLBAR */}
        <div className="w-full pt-5 sm:pt-7 pb-3 flex flex-col items-start sm:items-end text-left sm:text-right select-none group">
          
          {/* Action Header: Status + Dedicated Accessible Copy Button */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Direct Core Inquiries</span>
            </div>

            <div className="flex items-center space-x-3">
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
          </div>

          {/* Primary Semantic Mailto Anchor */}
          <a
            ref={emailRef}
            href="mailto:engineering@devforge.org?subject=DevForge%20Systems%20Architecture%20Inquiry"
            onMouseEnter={(e) => {
              isHoveringEmailRef.current = true;
              setIsHoveringEmail(true);
              updateOrbPosition(e.clientX, e.clientY, true);
            }}
            onMouseMove={(e) => {
              isHoveringEmailRef.current = true;
              updateOrbPosition(e.clientX, e.clientY, true);
            }}
            onMouseLeave={(e) => {
              isHoveringEmailRef.current = false;
              setIsHoveringEmail(false);
              updateOrbPosition(e.clientX, e.clientY, false);
            }}
            className="w-full block cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-xl transition-all"
            aria-label="Send email to engineering@devforge.org (opens your default email client)"
          >
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[104px] font-sans font-black tracking-tight leading-[0.92] text-white group-hover:text-neutral-300 transition-colors">
              <span className="block">engineering@</span>
              <span className="block">devforge.org</span>
            </div>
          </a>

          {/* Mobile Native Touch Targets (Accessible on touch devices) */}
          <div className="flex sm:hidden items-stretch gap-3 w-full pt-4">
            <a
              href="mailto:engineering@devforge.org?subject=DevForge%20Systems%20Architecture%20Inquiry"
              className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-sans font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-transform"
            >
              <ArrowUpRight className="w-4 h-4 text-black" />
              <span>Send Mail</span>
            </a>
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

        {/* Brief Composer Toggle Trigger */}
        <div className="pt-3 flex items-center justify-between border-t border-white/[0.05]">
          <button
            type="button"
            onClick={toggleBriefForm}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer py-2 group"
          >
            <span>{showBriefForm ? 'Close Technical Brief Form' : 'Or Compose a Technical Brief Directly'}</span>
            {showBriefForm ? (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
            )}
          </button>

          <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
            Direct Core Transmission
          </span>
        </div>

        {/* ================= OPTIONAL STRUCTURED BRIEF COMPOSER ================= */}
        <AnimatePresence>
          {showBriefForm && (
            <motion.div
              ref={briefFormRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden pt-8"
            >
              {submissionTicket ? (
                /* Submission Receipt */
                <div className="max-w-2xl mx-auto p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-6 my-6">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block">
                      Transmission Confirmed
                    </span>
                    <h3 className="text-2xl font-sans font-bold text-white">
                      Brief logged under {submissionTicket.id}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs text-neutral-400">
                    <span>Target Reply: {email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyTicket(submissionTicket.id)}
                      className="inline-flex items-center space-x-1.5 text-white hover:underline cursor-pointer"
                    >
                      {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Reference</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionTicket(null);
                      setShowBriefForm(false);
                    }}
                    className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Close Form
                  </button>
                </div>
              ) : (
                /* Interactive Brief Form */
                <form
                  onSubmit={handleSubmit}
                  className="max-w-3xl mx-auto p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-8 my-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
                      Architectural Brief
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-sans">
                      Dispatched straight to our active engineering rotation.
                    </p>
                  </div>

                  {/* 1. Topic Matrix */}
                  <div className="space-y-2.5">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Topic Area
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_AREAS.map((area) => {
                        const isActive = selectedArea === area;
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => setSelectedArea(area)}
                            className={`text-xs font-sans px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                              isActive
                                ? 'bg-white text-black font-medium'
                                : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.06]'
                            }`}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Timeline Selector */}
                  <div className="space-y-2.5">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Project Horizon
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINE_OPTIONS.map((opt) => {
                        const isActive = selectedTimeline === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedTimeline(opt)}
                            className={`text-xs font-sans px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                              isActive
                                ? 'bg-white text-black font-medium'
                                : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.06]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                        Your Name *
                      </label>
                      <input
                        ref={nameInputRef}
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-base text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@domain.com"
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-base text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  {/* 4. Organization */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-org" className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Organization or GitHub Profile (optional)
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      placeholder="github.com/username or team/lab name"
                      className="w-full bg-transparent border-b border-white/20 py-2.5 text-base text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                    />
                  </div>

                  {/* 5. Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Architecture Overview *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe architectural challenges, consensus bottlenecks, compiler benchmarks..."
                      className="w-full bg-transparent border-b border-white/20 py-2.5 text-base text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors resize-none rounded-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-sans">
                      &lt; 24h engineering reply
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Dispatching...' : 'Dispatch Brief'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer className="relative z-20 w-full px-6 sm:px-12 lg:px-20 py-6 border-t border-white/[0.05] flex items-center justify-between text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge · Systems Engineering Lab</span>
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
