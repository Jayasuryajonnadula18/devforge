'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
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
  GitBranch,
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
  const emailRef = useRef<HTMLDivElement>(null);

  // Magnetic Cursor Spring Tracker (Le Fruit Studio signature interaction)
  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 28 });

  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

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

  // Live Studio Clock (Pacific Time)
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

  // Track mouse coordinates relative to container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
    if (!cursorVisible) setCursorVisible(true);
  };

  const handleCopyEmail = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigator.clipboard.writeText('engineering@devforge.org');
    setCopiedEmail(true);
    toast.success('Email Copied to Clipboard', {
      description: 'engineering@devforge.org',
    });
    setTimeout(() => setCopiedEmail(false), 2400);

    // Also trigger mailto after brief confirmation
    setTimeout(() => {
      window.location.href = 'mailto:engineering@devforge.org?subject=DevForge%20Systems%20Architecture%20Inquiry';
    }, 400);
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTicket(true);
    toast.success('Reference Copied', {
      description: id,
    });
    setTimeout(() => setCopiedTicket(false), 2000);
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
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursorVisible(false)}
      className="relative min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-hidden"
    >
      {/* ================= LE FRUIT MAGNETIC LENS FOLLOWER ================= */}
      {cursorVisible && (
        <motion.div
          style={{
            left: springX,
            top: springY,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            width: isHoveringEmail ? 176 : 74,
            height: isHoveringEmail ? 176 : 74,
            borderColor: isHoveringEmail ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="pointer-events-none absolute z-30 rounded-full border flex items-center justify-center overflow-hidden backdrop-blur-sm"
        >
          {isHoveringEmail ? (
            /* Expanded Visual Lens Reveal on Hover (Le Fruit signature) */
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85 scale-105"
                style={{ backgroundImage: `url('/images/menu/architecture-systems.jpg')` }}
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
                {copiedEmail ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-white">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5 text-white" />
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white">
                      Send Mail
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Default Outline Circle with Directional Arrow */
            <div className="flex items-center justify-center text-white/80">
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </motion.div>
      )}

      {/* ================= TOP HEADER ================= */}
      <header className="relative z-20 w-full px-6 sm:px-12 lg:px-20 py-8 flex items-center justify-between select-none border-b border-white/[0.05]">
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
      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-20 py-12 lg:py-16 flex flex-col justify-between">
        
        {/* Row 1: Massive CONTACT Landmark Title */}
        <div className="w-full">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[132px] xl:text-[144px] font-sans font-black tracking-[-0.045em] leading-[0.92] text-white select-none">
            CONTACT
          </h1>
        </div>

        {/* Row 2: Editorial Middle Layer (Coordinates Left · Ecosystem Right · Prompt Center) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-10 sm:py-14 items-end border-b border-white/[0.05]">
          
          {/* Left: Studio Physical & Invariant Coordinates */}
          <div className="md:col-span-4 space-y-5 text-sm font-sans text-neutral-400 select-none">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                Systems Engineering Lab
              </span>
              <p className="text-neutral-300 leading-relaxed">
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
          <div className="md:col-span-5 text-center md:text-left space-y-2 select-none">
            <span className="text-[11px] sm:text-xs font-sans uppercase tracking-widest text-neutral-500 font-medium">
              Ready to build from first principles?
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Distributed protocols, compiler optimization, or kernel internals.
              Drop us your specs or direct questions.
            </p>
          </div>

          {/* Right: Ecosystem Channels */}
          <div className="md:col-span-3 flex md:flex-col items-start md:items-end justify-start gap-4 text-xs font-sans uppercase tracking-wider text-neutral-400">
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
              onClick={handleCopyEmail}
              className="hover:text-white transition-colors inline-flex items-center space-x-1 cursor-pointer"
            >
              <span>Copy PGP Key</span>
              <Copy className="w-3 h-3 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Row 3: COLOSSAL INTERACTIVE TYPOGRAPHIC EMAIL (Le Fruit Interaction) */}
        <div
          ref={emailRef}
          onMouseEnter={() => setIsHoveringEmail(true)}
          onMouseLeave={() => setIsHoveringEmail(false)}
          onClick={handleCopyEmail}
          className="w-full pt-10 sm:pt-14 pb-6 flex flex-col items-start sm:items-end text-left sm:text-right cursor-pointer select-none group"
        >
          <span className="text-xs font-sans uppercase tracking-widest text-neutral-500 font-semibold mb-2 block group-hover:text-white transition-colors">
            Click to copy or dispatch mail →
          </span>
          
          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[124px] font-sans font-black tracking-tight leading-[0.92] text-white group-hover:text-neutral-300 transition-colors">
            <span className="block">engineering@</span>
            <span className="block">devforge.org</span>
          </div>
        </div>

        {/* Brief Composer Toggle */}
        <div className="pt-4 flex items-center justify-between border-t border-white/[0.05]">
          <button
            type="button"
            onClick={() => setShowBriefForm((prev) => !prev)}
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
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Linus Torvalds"
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
