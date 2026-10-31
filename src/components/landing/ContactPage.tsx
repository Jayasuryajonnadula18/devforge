'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ContactPageProps {
  onBack: () => void;
}

const INQUIRY_AREAS = [
  'Systems Architecture',
  'Distributed Consensus',
  'Compiler Internals',
  'Enterprise Tracks',
  'General Inquiry',
];

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [selectedArea, setSelectedArea] = useState<string>(INQUIRY_AREAS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please provide your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error('Please provide a valid engineering email.');
      return;
    }

    if (!message.trim() || message.trim().length < 8) {
      toast.error('Please describe your inquiry or project.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Inquiry Received', {
        description: 'Our engineering core will reply within 24 hours.',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-8 flex items-center justify-between border-b border-white/[0.06]">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-sans font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Return to DevForge
        </button>

        <span className="font-sans font-bold text-base tracking-tight text-white select-none">
          DevForge
        </span>
      </header>

      {/* Main Form Stage */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 lg:px-20 py-16 lg:py-24">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-left py-12"
            >
              <h2 className="font-rector text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
                Message received.
              </h2>
              <p className="text-lg text-neutral-300 max-w-xl leading-relaxed">
                Thank you, {name}. We have routed your notes to our engineering team. We will review your inquiry and reply to {email} within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-8 py-3.5 bg-white text-black font-sans font-semibold text-sm rounded-none hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Return to Overview
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              {/* Headline */}
              <div className="space-y-4 max-w-3xl">
                <h1 className="font-rector text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
                  Let’s engineer something <span className="italic font-normal text-white">real.</span>
                </h1>
                <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-sans pt-1">
                  Have an architecture question, systems project, or collaboration in mind? Reach out directly to our core team.
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-12 max-w-3xl">
                {/* Interest Area Selector (Architectural Typographic Matrix) */}
                <div className="space-y-4">
                  <span className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                    Topic of Discussion
                  </span>
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
                              ? 'bg-white text-black font-medium'
                              : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email Clean Underlined Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Linus Torvalds"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                      Your Email
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

                {/* Inquiry Textarea */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                    Project or Inquiry Overview
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are building, architectural bottlenecks, or questions..."
                    className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-700 focus:border-white focus:outline-none transition-colors resize-none leading-relaxed rounded-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <span className="text-xs font-sans text-neutral-500">
                    Direct engineering response within 24 hours.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-white text-black font-sans font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 tracking-tight"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>

              {/* Direct Coordinate Channels */}
              <div className="pt-16 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm font-sans text-neutral-400">
                <div className="space-y-1.5">
                  <span className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                    Direct Email
                  </span>
                  <a
                    href="mailto:engineering@devforge.org"
                    className="text-base text-white hover:text-neutral-300 transition-colors block"
                  >
                    engineering@devforge.org
                  </a>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                    Studio Core
                  </span>
                  <span className="text-base text-neutral-300 block">
                    San Francisco · Distributed Engineering Lab
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Footer */}
      <footer className="w-full px-6 sm:px-12 lg:px-20 py-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-neutral-500 select-none">
        <span>© {new Date().getFullYear()} DevForge</span>
        <span>Architected from first principles</span>
      </footer>
    </div>
  );
};
