'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  Zap, 
  Activity,
  Layers,
  FileCode
} from 'lucide-react';
import { ProjectTrack } from '../../types';

interface InteractiveSystemHeroProps {
  projects: ProjectTrack[];
  onOpenProject: (project: ProjectTrack) => void;
}

export const InteractiveSystemHero: React.FC<InteractiveSystemHeroProps> = ({
  projects,
  onOpenProject,
}) => {
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lockState, setLockState] = useState<'IDLE' | 'READ_SHARED' | 'WRITE_EXCLUSIVE'>('IDLE');
  const [activeSlots, setActiveSlots] = useState<boolean[]>(Array(16).fill(false));
  const [latency, setLatency] = useState<number>(0.14);
  const [processedOps, setProcessedOps] = useState<number>(2450);

  const currentProject = projects[activeTrackIndex] || projects[0];

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setLockState('WRITE_EXCLUSIVE');

    const interval = setInterval(() => {
      setActiveSlots(prev => prev.map(() => Math.random() > 0.3));
      setProcessedOps(p => p + Math.floor(Math.random() * 80) + 20);
      setLatency(Number((0.10 + Math.random() * 0.12).toFixed(2)));
    }, 120);

    setTimeout(() => {
      setLockState('READ_SHARED');
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setActiveSlots(Array(16).fill(false));
      setLockState('IDLE');
      setIsSimulating(false);
      setLatency(0.14);
    }, 1800);
  };

  return (
    <div className="relative border border-white/[0.08] bg-[#0c0d10] rounded-xl overflow-hidden shadow-2xl font-sans">
      {/* Top Bar with Clean Track Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/[0.08] bg-[#111216] px-5 py-3 gap-3">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {projects.map((proj, idx) => {
            const isActive = idx === activeTrackIndex;
            const romanNumerals = ['I', 'II', 'III', 'IV'];
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setActiveTrackIndex(idx);
                  setIsSimulating(false);
                }}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="heroTabIndicator"
                    className="absolute inset-0 bg-white/[0.08] rounded-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="font-editorial italic font-normal text-neutral-400">{romanNumerals[idx]}.</span>
                  <span>{proj.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-4 shrink-0 self-end sm:self-auto text-xs">
          <span className="flex items-center space-x-1.5 text-neutral-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Deterministic Runtime</span>
          </span>

          <button
            onClick={() => onOpenProject(currentProject)}
            className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-md flex items-center space-x-1.5 transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <span>Enter Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Grid: Code vs Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
        {/* Left: Code Structure (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#0c0d10] space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/[0.06] pb-3">
            <div className="flex items-center space-x-2">
              <FileCode className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-white font-medium">{currentProject.initialFiles[0].name}</span>
              <span className="text-neutral-500">· System Invariant Implementation</span>
            </div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider">{currentProject.language}</span>
          </div>

          <div className="font-mono-code text-xs leading-relaxed text-neutral-300 overflow-x-auto whitespace-pre">
            {currentProject.language === 'go' && (
              <>
                <span className="text-neutral-500">// Thread-safe concurrent cache with zero data-races</span>{'\n'}
                <span className="text-blue-400">func</span> (c *<span className="text-emerald-400">Cache</span>) <span className="text-amber-300">GetOrSet</span>(key <span className="text-blue-400">string</span>, fetch <span className="text-blue-400">func</span>() <span className="text-blue-400">any</span>) <span className="text-blue-400">any</span> &#123;{'\n'}
                {'  '}c.mu.<span className="text-emerald-400">RLock</span>(){'\n'}
                {'  '}<span className="text-blue-400">if</span> val, ok := c.items[key]; ok &#123;{'\n'}
                {'    '}c.mu.<span className="text-emerald-400">RUnlock</span>(){'\n'}
                {'    '}<span className="text-blue-400">return</span> val.Value{'\n'}
                {'  '}&#125;{'\n'}
                {'  '}c.mu.<span className="text-emerald-400">RUnlock</span>(){'\n'}
                {'\n'}
                {'  '}c.mu.<span className="text-amber-400">Lock</span>(){'\n'}
                {'  '}<span className="text-blue-400">defer</span> c.mu.<span className="text-amber-400">Unlock</span>(){'\n'}
                {'  '}val := fetch(){'\n'}
                {'  '}c.items[key] = Item&#123;Value: val&#125;{'\n'}
                {'  '}<span className="text-blue-400">return</span> val{'\n'}
                &#125;
              </>
            )}

            {currentProject.language === 'python' && (
              <>
                <span className="text-neutral-500"># Content-addressable object store & commit hashing</span>{'\n'}
                <span className="text-blue-400">def</span> <span className="text-amber-300">hash_object</span>(data: <span className="text-emerald-400">bytes</span>, obj_type: <span className="text-emerald-400">str</span> = <span className="text-emerald-300">"blob"</span>) -&gt; <span className="text-emerald-400">str</span>:{'\n'}
                {'    '}header = <span className="text-emerald-300">f"&#123;obj_type&#125; &#123;len(data)&#125;\x00"</span>.encode(<span className="text-emerald-300">"ascii"</span>){'\n'}
                {'    '}full_payload = header + data{'\n'}
                {'    '}sha1_digest = hashlib.sha1(full_payload).hexdigest(){'\n'}
                {'    '}path = os.path.join(<span className="text-emerald-300">".git"</span>, <span className="text-emerald-300">"objects"</span>, sha1_digest[:2], sha1_digest[2:]){'\n'}
                {'    '}os.makedirs(os.path.dirname(path), exist_ok=<span className="text-blue-400">True</span>){'\n'}
                {'    '}write_zlib_compressed(path, full_payload){'\n'}
                {'    '}<span className="text-blue-400">return</span> sha1_digest
              </>
            )}

            {currentProject.language === 'typescript' && (
              <>
                <span className="text-neutral-500">// Distributed queue semaphore with automatic DLQ backoff</span>{'\n'}
                <span className="text-blue-400">async</span> <span className="text-amber-300">dispatch</span>(job: <span className="text-emerald-400">JobPayload</span>): <span className="text-emerald-400">Promise</span>&lt;<span className="text-emerald-400">JobStatus</span>&gt; &#123;{'\n'}
                {'  '}<span className="text-blue-400">await</span> <span className="text-blue-400">this</span>.semaphore.<span className="text-amber-300">acquire</span>();{'\n'}
                {'  '}<span className="text-blue-400">try</span> &#123;{'\n'}
                {'    '}<span className="text-blue-400">return</span> <span className="text-blue-400">await</span> <span className="text-blue-400">this</span>.handler.<span className="text-amber-300">execute</span>(job);{'\n'}
                {'  '}&#125; <span className="text-blue-400">catch</span> (err) &#123;{'\n'}
                {'    '}<span className="text-blue-400">if</span> (job.retryCount &gt;= <span className="text-blue-400">this</span>.maxRetries) &#123;{'\n'}
                {'      '}<span className="text-blue-400">return</span> <span className="text-blue-400">this</span>.dlq.<span className="text-amber-300">route</span>(job, err);{'\n'}
                {'    '}&#125;{'\n'}
                {'  '}&#125; <span className="text-blue-400">finally</span> &#123;{'\n'}
                {'    '}<span className="text-blue-400">this</span>.semaphore.<span className="text-amber-300">release</span>();{'\n'}
                {'  '}&#125;{'\n'}
                &#125;
              </>
            )}

            {currentProject.language === 'rust' && (
              <>
                <span className="text-neutral-500">// Zero-copy lifetime token parsing directly from socket buffer</span>{'\n'}
                <span className="text-blue-400">pub fn</span> <span className="text-amber-300">next_token</span>&lt;<span className="text-amber-300">'a</span>&gt;(src: &amp;<span className="text-amber-300">'a</span> [<span className="text-blue-400">u8</span>], cursor: &amp;<span className="text-blue-400">mut usize</span>) -&gt; <span className="text-emerald-400">Option</span>&lt;<span className="text-emerald-400">Token</span>&lt;<span className="text-amber-300">'a</span>&gt;&gt; &#123;{'\n'}
                {'  '}<span className="text-blue-400">if</span> *cursor &gt;= src.len() &#123; <span className="text-blue-400">return</span> <span className="text-emerald-400">None</span>; &#125;{'\n'}
                {'  '}<span className="text-blue-400">let</span> start = *cursor;{'\n'}
                {'  '}<span className="text-blue-400">while</span> *cursor &lt; src.len() &amp;&amp; !<span className="text-emerald-400">is_delimiter</span>(src[*cursor]) &#123;{'\n'}
                {'    '}*cursor += <span className="text-blue-400">1</span>;{'\n'}
                {'  '}&#125;{'\n'}
                {'  '}<span className="text-emerald-400">Some</span>(<span className="text-emerald-400">Token::Slice</span>(&amp;src[start..*cursor])){'\n'}
                &#125;
              </>
            )}
          </div>
        </div>

        {/* Right: Architectural Telemetry */}
        <div className="lg:col-span-5 p-6 bg-[#0f1014] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live System Telemetry</span>
              </span>
              <span className="text-xs text-neutral-400">Strict Invariants</span>
            </div>

            {/* Mutex Lock Gauge */}
            <div className="space-y-2 p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Lock Synchronization:</span>
                <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                  lockState === 'WRITE_EXCLUSIVE' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : lockState === 'READ_SHARED'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {lockState}
                </span>
              </div>

              {/* Thread Slot Matrix */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                  <span>Worker Execution Matrix (16 Cores)</span>
                  <span className="text-neutral-400">{isSimulating ? '100% active' : 'idle'}</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {activeSlots.map((isActive, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-xs transition-colors duration-150 ${
                        isActive
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          : 'bg-white/[0.08]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Dual Ticker */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-neutral-400">p99 Roundtrip</div>
                <div className="text-xl font-semibold text-white mt-1">
                  {latency}ms
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-neutral-400">Atomic Operations / Sec</div>
                <div className="text-xl font-semibold text-emerald-400 mt-1">
                  {processedOps.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <div className="pt-2">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                isSimulating
                  ? 'bg-white/[0.08] text-neutral-400 border-white/[0.1] cursor-wait'
                  : 'bg-white text-black hover:bg-neutral-200 border-transparent active:scale-98 shadow-sm'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : 'fill-current'}`} />
              <span>{isSimulating ? 'Running Concurrent Race Harness...' : 'Dispatch 100 Goroutines (Simulate Load)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
