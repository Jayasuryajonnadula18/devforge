'use client';

import React from 'react';
import { ProjectTrack, RunResults } from '../types';
import { ArrowLeft, Play, RotateCcw, CheckCircle2, Search } from 'lucide-react';
import { Magnetic } from './reactbits/Magnetic';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  currentProject: ProjectTrack;
  completedMilestoneIds: number[];
  onBackToCatalog: () => void;
  onOpenProjectModal: () => void;
  onRunTests: () => void;
  onResetCode: () => void;
  isRunningTests: boolean;
  lastResults: RunResults | null;
  activeMilestoneIndex: number;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  completedMilestoneIds,
  onBackToCatalog,
  onRunTests,
  onResetCode,
  isRunningTests,
  lastResults,
  activeMilestoneIndex,
  onOpenCommandPalette,
}) => {
  const totalMilestones = currentProject.milestones.length;
  const isCurrentStageDone = completedMilestoneIds.includes(
    currentProject.milestones[activeMilestoneIndex]?.id
  );

  return (
    <header className="h-14 bg-[#000000] border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between select-none shrink-0 z-30 font-sans text-xs">
      {/* Left: Navigation & Current Track */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onBackToCatalog}
          className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer font-medium"
        >
          <span className="text-white text-xs mr-0.5">▲</span>
          <span>Curriculum</span>
        </button>

        <span className="text-white/20">/</span>

        <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-md">
          {currentProject.title}
        </span>

        <span className="text-white/20 hidden sm:inline">/</span>

        <div className="hidden sm:flex items-center space-x-2 text-neutral-400 font-medium">
          <span>Stage {activeMilestoneIndex + 1} of {totalMilestones}</span>
          {isCurrentStageDone && (
            <span className="text-emerald-400 flex items-center ml-1">
              <CheckCircle2 className="w-3 h-3 mr-0.5" />
              <span className="text-xs">Passed</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        <ThemeSwitcher />

        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-md transition-colors border border-white/[0.06] cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Menu</span>
            <kbd className="text-[10px] bg-white/[0.08] px-1 py-0.2 rounded text-neutral-300">⌘K</kbd>
          </button>
        )}

        <button
          onClick={onResetCode}
          className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer px-2 py-1 flex items-center space-x-1 rounded-md hover:bg-white/[0.04]"
          title="Reset starter files"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <Magnetic intensity={0.2}>
          <button
            onClick={onRunTests}
            disabled={isRunningTests}
            className={`h-8 px-4 text-xs font-semibold rounded-full transition-all flex items-center space-x-2 cursor-pointer ${
              isRunningTests
                ? 'bg-[#18181b] text-neutral-500 cursor-wait'
                : 'bg-white hover:bg-neutral-200 text-black shadow-sm active:scale-98'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunningTests ? 'Verifying...' : 'Verify Solution'}</span>
            <span className="hidden md:inline text-[11px] text-neutral-500 ml-1">
              ⌘↵
            </span>
          </button>
        </Magnetic>
      </div>
    </header>
  );
};
