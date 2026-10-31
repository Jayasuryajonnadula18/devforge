'use client';

import React, { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Critical Root Anomaly caught by GlobalError:', error);
    }
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen w-full bg-[#050608] text-[#f5f4f0] font-sans flex items-center justify-center p-6 select-none m-0">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#090b0e] border border-white/10 space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
              Core Runtime Halt
            </span>
            <h1 className="text-2xl font-sans font-bold text-white tracking-tight">
              DevForge Exception
            </h1>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">
              A root-level layout anomaly was intercepted. The runtime supervisor halted execution to prevent state corruption.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="w-full py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Re-initialize Runtime
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="w-full py-3 bg-transparent text-neutral-400 hover:text-white border border-white/10 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reload Safe Baseline
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
