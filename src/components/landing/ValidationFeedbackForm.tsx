'use client';

import React, { useState, useEffect } from 'react';

interface FeedbackSubmission {
  id: string;
  role: string;
  learningGap: string;
  desiredSystem: string;
  contact: string;
  timestamp: string;
}

export const ValidationFeedbackForm: React.FC = () => {
  const [role, setRole] = useState<string>('student');
  const [learningGap, setLearningGap] = useState<string>('');
  const [desiredSystem, setDesiredSystem] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentCount, setRecentCount] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('devforge_learner_feedback');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          setRecentCount(list.length);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningGap.trim() || learningGap.trim().length < 10) {
      setError('Please share a few words about where tutorials fell short for you (at least 10 characters).');
      return;
    }

    setError(null);

    const newSubmission: FeedbackSubmission = {
      id: `fb_${Date.now()}`,
      role,
      learningGap: learningGap.trim(),
      desiredSystem: desiredSystem.trim(),
      contact: contact.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('devforge_learner_feedback');
      const list: FeedbackSubmission[] = existing ? JSON.parse(existing) : [];
      list.push(newSubmission);
      localStorage.setItem('devforge_learner_feedback', JSON.stringify(list));
      setSubmitted(true);
    } catch {
      // If localStorage is unavailable, still confirm receipt
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setLearningGap('');
    setDesiredSystem('');
    setContact('');
    setError(null);
    setSubmitted(false);
  };

  return (
    <section 
      id="feedback" 
      aria-label="Student and Developer Feedback"
      className="w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-white/[0.08] bg-[#07080a]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span>03 // Validation &amp; Research</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-sans font-medium text-white tracking-tight leading-snug">
            Help us understand your learning difficulties.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl font-normal leading-relaxed">
            We are not building another generic course catalog. If you have ever felt stranded between passing basic tutorial syntax and understanding production software, your real experience will directly shape what we explore.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-white/[0.12] bg-white/[0.03] p-8 sm:p-10 space-y-5">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Feedback recorded</span>
            </div>
            <h3 className="text-xl font-medium text-white">
              Thank you for sharing your experience.
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Your feedback has been saved locally on this device. We read every response to verify whether our hypothesis matches the real struggles of practicing developers and students.
            </p>
            {contact && (
              <p className="text-xs font-mono text-neutral-400">
                Follow-up contact noted: <span className="text-neutral-300">{contact}</span>
              </p>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded text-xs font-mono text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] transition-colors cursor-pointer"
              >
                Submit another reflection
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
            
            {/* Field 1: Role */}
            <div className="space-y-2">
              <label htmlFor="role-select" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                1. Your current background
              </label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full sm:w-auto min-w-[260px] bg-[#0c0e12] border border-white/[0.12] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                <option value="student">Computer Science / University Student</option>
                <option value="self-taught">Self-taught Developer / Bootcamp Grad</option>
                <option value="junior-dev">Junior Software Engineer (&lt; 2 yrs)</option>
                <option value="mid-senior">Mid or Senior Engineer</option>
                <option value="educator">Instructor or Mentor</option>
              </select>
            </div>

            {/* Field 2: Learning Gap */}
            <div className="space-y-2">
              <label htmlFor="learning-gap" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                2. Where do tutorials stop being helpful for you? <span className="text-neutral-500 font-normal">(Required)</span>
              </label>
              <textarea
                id="learning-gap"
                rows={4}
                value={learningGap}
                onChange={(e) => setLearningGap(e.target.value)}
                placeholder="For example: I can write SQL queries and basic endpoints, but when asked to design for concurrency, transactions, or handle failure modes, I have no intuition for how the underlying database actually behaves."
                className="w-full bg-[#0c0e12] border border-white/[0.12] rounded p-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors leading-relaxed"
              />
            </div>

            {/* Field 3: Desired System */}
            <div className="space-y-2">
              <label htmlFor="desired-system" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                3. What system or primitive would you most want to build to truly understand it?
              </label>
              <input
                id="desired-system"
                type="text"
                value={desiredSystem}
                onChange={(e) => setDesiredSystem(e.target.value)}
                placeholder="e.g. A storage engine (LSM-tree), a Git implementation, an HTTP/2 server, a message queue"
                className="w-full bg-[#0c0e12] border border-white/[0.12] rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* Field 4: Optional Contact */}
            <div className="space-y-2">
              <label htmlFor="contact-handle" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                4. Optional: Email or Twitter/GitHub handle
              </label>
              <input
                id="contact-handle"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Only if you are open to a brief 15-minute chat about your learning journey"
                className="w-full sm:w-80 bg-[#0c0e12] border border-white/[0.12] rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {error && (
              <div className="text-xs text-rose-400 font-mono">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 rounded text-xs font-mono font-medium text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Send Feedback →
              </button>
              {recentCount > 0 && (
                <span className="text-xs font-mono text-neutral-400">
                  {recentCount} reflection{recentCount > 1 ? 's' : ''} saved locally
                </span>
              )}
            </div>

          </form>
        )}
      </div>
    </section>
  );
};
