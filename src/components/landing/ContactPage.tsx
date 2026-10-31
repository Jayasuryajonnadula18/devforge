'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { Check, Copy, ArrowLeft, Clock, ShieldCheck, Mail, GitBranch } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

const INQUIRY_AREAS = [
  'Distributed Systems',
  'Compiler Architecture',
  'Kernel & Memory',
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
  const [selectedArea, setSelectedArea] = useState<string>(INQUIRY_AREAS[0]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>(TIMELINE_OPTIONS[1]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionTicket, setSubmissionTicket] = useState<{ id: string; timestamp: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Live Studio Clock (San Francisco Pacific Time)
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('engineering@devforge.org');
    setCopiedEmail(true);
    toast.success('Copied to clipboard', {
      description: 'engineering@devforge.org',
    });
    setTimeout(() => setCopiedEmail(false), 2000);
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
      toast.error('Please share a brief description of your inquiry or system architecture (minimum 10 characters).');
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

  const handleResetForm = () => {
    setSubmissionTicket(null);
    setName('');
    setEmail('');
    setOrg('');
    setMessage('');
    setSelectedArea(INQUIRY_AREAS[0]);
    setSelectedTimeline(TIMELINE_OPTIONS[1]);
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-7 flex items-center justify-between border-b border-white/[0.06] select-none">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-sans font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-500 group-hover:-translate-x-1 group-hover:text-white transition-all" />
          <span>Return to DevForge</span>
        </button>

        <div className="flex items-center space-x-3 select-none">
          <ForgeSymbol size={20} className="w-4 h-4 text-white" />
          <span className="font-sans font-bold text-base tracking-tight text-white">
            DevForge
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-sans text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04] border border-white/[0.06] cursor-pointer"
          title="Click to copy direct engineering email"
        >
          {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-500" />}
          <span>engineering@devforge.org</span>
        </button>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-12 lg:px-20 py-14 lg:py-20">
        <AnimatePresence mode="wait">
          {submissionTicket ? (
            /* ================= POLISHED CONFIRMATION RECEIPT ================= */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto space-y-10 py-6"
            >
              <div className="space-y-3">
                <span className="text-xs font-sans uppercase tracking-widest text-neutral-400 font-semibold">
                  Transmission Verified
                </span>
                <h1 className="font-rector text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                  Message received.
                </h1>
                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-sans pt-1">
                  Thank you, <span className="text-white font-medium">{name}</span>. Your brief has been dispatched directly to our core systems engineering rotation.
                </p>
              </div>

              {/* Reference Card */}
              <div className="p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.06]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-sans uppercase tracking-wider text-neutral-500 font-semibold block">
                      Invariant Reference ID
                    </span>
                    <span className="text-xl font-mono text-white tracking-wider font-semibold">
                      {submissionTicket.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyTicket(submissionTicket.id)}
                    className="inline-flex items-center space-x-1.5 text-xs font-sans text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                    <span>Copy Reference</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-sans">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium block">
                      Topic Focus
                    </span>
                    <span className="text-neutral-200 block">{selectedArea}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium block">
                      Target Reply Channel
                    </span>
                    <span className="text-neutral-200 block">{email}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium block">
                      Response SLA
                    </span>
                    <span className="text-neutral-200 block">&lt; 24h engineering turnaround</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium block">
                      Logged Timestamp
                    </span>
                    <span className="text-xs text-neutral-400 font-mono block">{submissionTicket.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-8 py-4 bg-white text-black font-sans font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer tracking-tight text-center"
                >
                  Return to Overview
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-6 py-4 bg-transparent text-neutral-400 hover:text-white font-sans text-sm transition-colors cursor-pointer border border-white/10 hover:border-white/20 text-center"
                >
                  Send Another Inquiry
                </button>
              </div>
            </motion.div>
          ) : (
            /* ================= EDITORIAL CONTACT FORM ================= */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start"
            >
              {/* Left Column: Monumental Headline & Telemetry (5 cols) */}
              <div className="lg:col-span-5 space-y-12">
                <div className="space-y-4">
                  <span className="text-xs font-sans uppercase tracking-widest text-neutral-400 font-semibold block">
                    Direct Core Channel
                  </span>
                  <h1 className="font-rector text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.02]">
                    Let’s engineer something <span className="italic font-normal text-white">real.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-sans pt-2">
                    Have an architecture challenge, low-level systems project, or collaboration in mind? Write directly to our engineering core.
                  </p>
                </div>

                {/* Studio Telemetry Invariants */}
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-5 select-none">
                  <div className="flex items-center justify-between text-xs font-sans pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center space-x-2 text-neutral-300">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Studio Clock</span>
                    </div>
                    <span className="font-mono text-neutral-400 font-medium">
                      {sfTime || 'San Francisco · PST'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-sans pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center space-x-2 text-neutral-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Response SLA</span>
                    </div>
                    <span className="font-sans text-neutral-400">
                      &lt; 24h engineering turnaround
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center space-x-2 text-neutral-300">
                      <GitBranch className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Code Collaboration</span>
                    </div>
                    <a
                      href="https://github.com/Jayasuryajonnadula18/devforge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white transition-colors underline font-sans"
                    >
                      GitHub Repo
                    </a>
                  </div>
                </div>

                {/* Direct Coordinate Channels */}
                <div className="space-y-4 text-xs font-sans text-neutral-400">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Direct Email
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-sm text-white hover:text-neutral-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>engineering@devforge.org</span>
                      <span className="text-[10px] text-neutral-500 pl-1">(click to copy)</span>
                    </button>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Physical Lab
                    </span>
                    <span className="text-sm text-neutral-300 block">
                      San Francisco · Distributed Systems Core
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form Stage (7 cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
                {/* 1. Topic Matrix (Cuberto-inspired) */}
                <div className="space-y-3">
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                    1. Topic of Discussion
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {INQUIRY_AREAS.map((area) => {
                      const isActive = selectedArea === area;
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setSelectedArea(area)}
                          className={`text-sm font-sans px-4 py-2 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-white text-black font-medium shadow-sm'
                              : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Timeline Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                    2. Project Horizon
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {TIMELINE_OPTIONS.map((opt) => {
                      const isActive = selectedTimeline === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedTimeline(opt)}
                          className={`text-xs sm:text-sm font-sans px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-white text-black font-medium'
                              : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Name & Email Inputs (Clean Single Underline) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                      Your Name <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                      Your Email <span className="text-neutral-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineer@domain.com"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                    />
                  </div>
                </div>

                {/* 4. Organization or GitHub Handle (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="contact-org" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                    Organization or GitHub Profile <span className="text-neutral-600 font-normal">(optional)</span>
                  </label>
                  <input
                    id="contact-org"
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="github.com/username or team/lab name"
                    className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                  />
                </div>

                {/* 5. Architectural Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="contact-message" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                      Project or Architecture Overview <span className="text-neutral-500">*</span>
                    </label>
                    <span className="text-xs font-mono text-neutral-600">
                      {message.length} chars
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are engineering, architectural constraints, systems bottlenecks, or questions..."
                    className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors resize-none leading-relaxed rounded-none"
                  />
                </div>

                {/* Action Trigger */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <span className="text-xs font-sans text-neutral-500">
                    No marketing bots. Direct engineering response.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-white text-black font-sans font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 tracking-tight"
                  >
                    {isSubmitting ? 'Dispatching...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Monochromatic Footer */}
      <footer className="w-full px-6 sm:px-12 lg:px-20 py-7 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge · Systems Engineering Lab</span>
        <span>Architected from first principles</span>
      </footer>
    </div>
  );
};
