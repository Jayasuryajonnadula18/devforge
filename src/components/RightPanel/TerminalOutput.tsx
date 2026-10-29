'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RunResults } from '../../types';
import { 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface TerminalOutputProps {
  results: RunResults | null;
  isRunning: boolean;
  language: string;
  onAdvanceStage?: () => void;
  hasNextStage?: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  results,
  isRunning,
  language,
  onAdvanceStage,
  hasNextStage,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'terminal'>('tests');
  const [copied, setCopied] = useState(false);

  const handleCopyLog = () => {
    if (results?.rawOutput) {
      navigator.clipboard.writeText(results.rawOutput);
      setCopied(true);
      toast.success('Copied execution logs to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isAllPassed = results && results.failed === 0 && results.total > 0;

  return (
    <div className="flex flex-col bg-[#000000] border-t border-white/[0.08] h-60 select-text font-sans text-xs">
      {/* Console Tab Header */}
      <div className="h-10 bg-[#000000] border-b border-white/[0.08] px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'tests' ? 'text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span>Verification Suite</span>
            {results && (
              <span className={`text-xs ml-2 font-medium ${
                results.failed === 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                ({results.passed}/{results.total})
              </span>
            )}
            {activeTab === 'tests' && (
              <motion.div
                layoutId="activeConsoleTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-2.5 transition-colors relative cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'terminal' ? 'text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-neutral-500" />
            <span>Raw Toolchain Stream</span>
            {activeTab === 'terminal' && (
              <motion.div
                layoutId="activeConsoleTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Status & Copy Action */}
        <div className="flex items-center space-x-2 text-xs">
          {isRunning ? (
            <span className="flex items-center space-x-1.5 text-neutral-300">
              <Clock className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Verifying solution...</span>
            </span>
          ) : results ? (
            <button
              onClick={handleCopyLog}
              className="text-neutral-400 hover:text-white transition-colors flex items-center space-x-1 cursor-pointer p-1 rounded hover:bg-white/[0.04]"
              title="Copy terminal logs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Console Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
        {isRunning && (
          <div className="space-y-3 py-4">
            <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-xs text-neutral-500 text-center">
              Compiling and executing deterministic language assertions...
            </p>
          </div>
        )}

        {!isRunning && activeTab === 'tests' && results && (
          <div className="space-y-4">
            {isAllPassed ? (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-l-2 border-emerald-400 pl-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02]"
              >
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-xs">
                    Stage Invariants Satisfied ({results.passed}/{results.total} Assertions Passed)
                  </span>
                </div>
                {hasNextStage && onAdvanceStage && (
                  <button
                    onClick={onAdvanceStage}
                    className="h-7 px-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-full cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto shrink-0 transition-all shadow-sm active:scale-98"
                  >
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-l-2 border-rose-400 pl-4 py-2 text-rose-400 bg-white/[0.02]"
              >
                <span className="font-semibold text-xs block">
                  Verification Incomplete: {results.failed} Failure(s) Encountered
                </span>
                <p className="text-xs text-neutral-400 font-normal pt-0.5">
                  Inspect the diagnostic trace below to align code with required system invariants.
                </p>
              </motion.div>
            )}

            {/* Test Results Breakdown */}
            <div className="space-y-0 divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
              {results.results.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center space-x-2 text-xs">
                      <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {r.passed ? '✓' : '✗'}
                      </span>
                      <span className="text-neutral-100">{r.name}</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono-code">
                      {r.durationMs}ms
                    </span>
                  </div>

                  {r.passed && r.output && (
                    <p className="text-xs text-neutral-400 pl-5 font-mono-code">
                      › {r.output}
                    </p>
                  )}

                  {!r.passed && r.error && (
                    <div className="pl-5 pt-1 space-y-1">
                      <p className="text-xs text-rose-400 font-mono-code">
                        Trace: {r.error}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* RAW TERMINAL LOG TAB */}
        {!isRunning && activeTab === 'terminal' && results && (
          <pre className="text-xs text-neutral-300 leading-5 whitespace-pre-wrap font-mono-code selection:bg-white selection:text-black">
            {results.rawOutput}
          </pre>
        )}

        {/* DEFAULT IDLE STATE */}
        {!results && !isRunning && (
          <div className="h-full flex items-center justify-center text-xs text-neutral-500 space-x-2 py-8">
            <TerminalIcon className="w-4 h-4 text-neutral-600" />
            <span>Ready for runtime assertion suite. Press ⌘↵ to verify code.</span>
          </div>
        )}
      </div>
    </div>
  );
};
