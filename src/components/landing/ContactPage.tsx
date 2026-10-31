'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Check, Copy, Send, Sparkles, Terminal, Mail, MapPin, Clock } from 'lucide-react';
import { ForgeSymbol } from '../icons/ForgeSymbol';
import { toast } from 'sonner';

interface ContactPageProps {
  onBack: () => void;
}

const INTEREST_TOPICS = [
  'Systems Architecture Review',
  'Distributed Consensus Lab',
  'Compiler & VM Engine',
  'Enterprise Engineering Track',
  'Technical Writing & Docs',
  'General Engineering Inquiry',
];

const SCOPE_TIERS = [
  'Exploratory / Research',
  'Production Hardening',
  'Enterprise Architecture',
  'Open-Source Collaboration',
];

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([INTEREST_TOPICS[0]]);
  const [selectedScope, setSelectedScope] = useState<string>(SCOPE_TIERS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleInterest = (topic: string) => {
    setSelectedInterests((prev) =>
      prev.includes(topic) ? (prev.length > 1 ? prev.filter((t) => t !== topic) : prev) : [...prev, topic]
    );
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('engineering@devforge.org');
    setCopiedEmail(true);
    toast.success('Email copied to clipboard', {
      description: 'engineering@devforge.org',
    });
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error('Please enter a valid engineering email.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      toast.error('Please provide a short description (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Transmission Received', {
        description: 'Our engineering core will review your specifications and reply within 24 hours.',
      });
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col relative overflow-x-hidden">
      {/* Ambient Volumetric Aura Inspired by Cuberto / DevForge */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-[15%] left-[25%] w-[850px] h-[850px] rounded-full blur-[170px] opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-[45%] -right-[10%] w-[750px] h-[750px] rounded-full blur-[180px] opacity-15 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.1) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-6 border-b border-white/[0.08] flex items-center justify-between select-none">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>Return to DevForge</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <ForgeSymbol size={22} className="w-5 h-5 text-amber-400" />
          <span className="font-sans font-bold text-sm tracking-tight text-white">DevForge</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 sm:px-12 lg:px-16 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Monumental Headline & Direct Channels (Cuberto Style) */}
          <div className="lg:col-span-5 space-y-8 select-none">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-medium block">
                Initiate Contact
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white leading-[1.08]">
                Hey! Let’s engineer something{' '}
                <span className="font-rector italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white">
                  real.
                </span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md pt-2">
                Have an architecture inquiry, a systems research project, or feedback on first-principles tracks? Tell us all the things.
              </p>
            </div>

            {/* Direct Engineering Channel Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium block">
                Direct Engineering Line
              </span>

              <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-black/50 border border-white/10 group">
                <div className="flex items-center space-x-3 truncate">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-mono text-neutral-200 truncate">
                    engineering@devforge.org
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono text-neutral-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer shrink-0 inline-flex items-center space-x-1"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Studio Coordinates */}
              <div className="space-y-3 pt-2 text-xs font-mono text-neutral-400 border-t border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>San Francisco · Global Distributed Lab</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Direct response within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Architectural Invariants Pill */}
            <div className="flex items-center space-x-3 text-xs font-mono text-neutral-500">
              <Terminal className="w-4 h-4 text-neutral-600" />
              <span>Zero third-party trackers · Encrypted dispatch</span>
            </div>
          </div>

          {/* Right Column: Interactive Form with Cuberto-style Option Pills */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-emerald-500/30 text-center space-y-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white">
                    Transmission Dispatched
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{name}</strong>. Your engineering specifications have been routed to our core systems team. We will review your notes and reply to <strong className="text-white">{email}</strong> within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setMessage('');
                    }}
                    className="px-6 py-3 rounded-full bg-white text-black font-medium text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Send Another Transmission
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-8"
                >
                  {/* Step 1: Cuberto-style Interest Selector */}
                  <div className="space-y-3.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                      I’m interested in...
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {INTEREST_TOPICS.map((topic) => {
                        const isSelected = selectedInterests.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleInterest(topic)}
                            className={`px-3.5 py-2 rounded-full text-xs font-sans transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                                : 'bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Name & Email Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                        Engineering Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@systems.org"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Step 3: Project Scale / Tier */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Scope / Engagement Stage
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SCOPE_TIERS.map((tier) => {
                        const isSelected = selectedScope === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setSelectedScope(tier)}
                            className={`p-3 rounded-xl text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border border-amber-500/40 text-amber-200 font-medium'
                                : 'bg-white/[0.02] border border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/15'
                            }`}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Tell us about your systems inquiry */}
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Tell us about your project or inquiry
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what you want to achieve, architectural bottlenecks, or questions..."
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button (Magnetic / High Contrast) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[11px] font-mono text-neutral-500">
                      Protected by DevForge RFC validation
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-sans font-semibold text-sm hover:bg-neutral-200 transition-all duration-200 cursor-pointer disabled:opacity-50 inline-flex items-center justify-center space-x-2 shrink-0 group"
                    >
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                      <Send className="w-3.5 h-3.5 text-neutral-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500 select-none">
        <span>DevForge Engineering Core</span>
        <span>© {new Date().getFullYear()} DevForge · First Principles</span>
      </footer>
    </div>
  );
};
