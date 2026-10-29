'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectTrack } from '../../types';
import { 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Binary, 
  Layers, 
  Cpu, 
  GitBranch,
  Terminal,
  Activity
} from 'lucide-react';

interface CurriculumFolioProps {
  projects: ProjectTrack[];
  completedMilestones: Record<string, number[]>;
  onSelectProject: (project: ProjectTrack) => void;
}

export const CurriculumFolio: React.FC<CurriculumFolioProps> = ({
  projects,
  completedMilestones,
  onSelectProject,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pythonProjects = projects.filter((p) => p.language === 'python');
  const filtered = pythonProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scenario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const romanNumerals = ['I', 'II', 'III', 'IV'];

  return (
    <div className="w-full space-y-12 select-none">
      {/* Header & Minimal Search Input */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-3">
          <span className="text-xs text-neutral-400 uppercase tracking-[0.25em] font-mono font-medium block">
            04 / Curriculum
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-[-0.035em] text-white leading-tight">
            Python systems.{' '}
            <span className="font-serif italic font-normal tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-white">
              Engineered from scratch.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-sans font-light max-w-xl">
            Four masterwork systems built exclusively in pure Python 3.12 without third-party black boxes.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Python tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white/[0.03] text-xs text-white placeholder-neutral-500 rounded-full border border-white/[0.08] outline-none focus:border-white/20 transition-colors w-56 font-sans"
          />
        </div>
      </div>

      {/* Full-Bleed Folio Rows with Animated Schematics on Hover */}
      <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
        {filtered.map((project, idx) => {
          const completed = completedMilestones[project.id] || [];
          const isDone = completed.length === project.milestones.length && project.milestones.length > 0;
          const roman = romanNumerals[idx] || `${idx + 1}`;
          const isHovered = hoveredId === project.id;

          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectProject(project)}
              className="group py-12 px-4 -mx-4 rounded-3xl hover:bg-white/[0.015] transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left: Roman Index & Technical Identity */}
              <div className="lg:col-span-3 space-y-2">
                <div className="text-4xl sm:text-5xl font-display font-medium text-neutral-500 group-hover:text-white transition-colors tracking-tight font-serif italic">
                  {roman}.
                </div>
                <div className="text-xs text-neutral-400 font-mono tracking-wider uppercase font-medium">
                  {project.languageBadge}
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-500 pt-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>~45 min duration</span>
                </div>
              </div>

              {/* Center: System Architecture Narrative */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white group-hover:text-white transition-colors tracking-tight">
                  {project.title}
                </h3>

                <p className="text-sm text-neutral-300 font-sans font-light leading-relaxed">
                  {project.tagline}
                </p>

                {/* Milestones Flow with Interactive Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
                  {project.milestones.map((m, mIdx) => (
                    <span key={m.id} className="flex items-center gap-2">
                      <span className="text-neutral-300 font-medium">{mIdx + 1}. {m.title}</span>
                      {mIdx < project.milestones.length - 1 && <span className="text-neutral-600">→</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Interactive Action & Animated Mini-Pulse */}
              <div className="lg:col-span-3 flex lg:flex-col lg:items-end justify-between self-center lg:self-center space-y-4">
                <div className="font-mono text-xs">
                  {isDone ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>All Invariants Verified</span>
                    </span>
                  ) : (
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-emerald-400 transition-colors" />
                      <span>{project.milestones.length} Invariant Stages</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelectProject(project)}
                  className="px-5 py-2.5 rounded-full bg-white/[0.04] group-hover:bg-white text-neutral-300 group-hover:text-black border border-white/[0.09] text-xs font-sans font-medium transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
                >
                  <span>{completed.length > 0 ? 'Resume Workstation' : 'Enter Studio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
