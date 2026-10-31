'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  errorDigest?: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    // Sanitize error message to prevent leaking system file paths or credentials
    const rawMessage = error?.message || 'Unknown system invariant violation';
    const sanitized = rawMessage.replace(/([a-zA-Z]:|\/)[^\s:]+/g, '[system-path]');
    return {
      hasError: true,
      errorMessage: sanitized,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Safe logging without leaking sensitive internals
    if (process.env.NODE_ENV !== 'production') {
      console.error('DevForge Runtime Anomaly caught by GlobalErrorBoundary:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#050608] flex items-center justify-center p-6 text-[#f5f4f0] font-sans select-none">
          {/* Subtle Background Glow */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle 600px at 50% 50%, rgba(220, 38, 38, 0.08) 0%, transparent 80%)',
            }}
          />

          <div className="relative z-10 max-w-lg w-full bg-[#0d0907]/90 border border-amber-500/20 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
            {/* Header Icon & Tag */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-medium">
                  Engine Resilience
                </span>
                <h2 className="text-xl font-sans font-semibold text-white">
                  System Invariant Exception
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              An unexpected execution state occurred in the rendering or compute pipeline. 
              The DevForge supervisor prevented a catastrophic application crash.
            </p>

            {/* Diagnostic Snapshot Box */}
            <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-neutral-400 space-y-1 overflow-x-auto">
              <div className="flex items-center space-x-2 text-neutral-300">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Diagnostic Report</span>
              </div>
              <p className="text-[11px] text-amber-300/80 break-words pt-1 font-mono">
                {this.state.errorMessage || 'Invariant verification check failed.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 h-11 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold font-sans transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-initialize Engine</span>
              </button>

              <button
                onClick={this.handleReset}
                className="h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium font-sans text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.98]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
