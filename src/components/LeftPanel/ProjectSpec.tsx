'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectTrack, TestResult } from '../../types';
import { ArchitectureView } from './ArchitectureView';
import { CheckCircle2, ChevronRight, ChevronDown, HelpCircle, Network, FileText, Code2 } from 'lucide-react';
import { DecryptedText } from '../reactbits/DecryptedText';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface ProjectSpecProps {
  project: ProjectTrack;
  completedMilestoneIds: number[];
  activeMilestoneId: number;
  onSelectMilestone: (id: number) => void;
  testResults: TestResult[];
}

export const ProjectSpec: React.FC<ProjectSpecProps> = ({
  project,
  completedMilestoneIds,
  activeMilestoneId,
  onSelectMilestone,
  testResults,
}) => {
  const [activeTab, setActiveTab] = useState<'stage' | 'architecture' | 'scenario'>('stage');
  const [showHints, setShowHints] = useState<boolean>(false);

  const activeMilestone = project.milestones.find(m => m.id === activeMilestoneId) || project.milestones[0];
  const isCompleted = completedMilestoneIds.includes(activeMilestone.id);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col h-full bg-[#000000] border-r border-white/[0.08] text-[#f4f4f5] select-text font-sans">
        {/* 1. Stage Stepper */}
        <div className="h-12 px-6 bg-[#000000] border-b border-white/[0.08] flex items-center space-x-6 overflow-x-auto text-xs select-none">
          {project.milestones.map((m, idx) => {
            const isDone = completedMilestoneIds.includes(m.id);
            const isCur = m.id === activeMilestoneId;

            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMilestone(m.id);
                  setActiveTab('stage');
                }}
                className={`flex items-center space-x-2 py-3 transition-colors relative cursor-pointer shrink-0 ${
                  isCur
                    ? 'text-white font-medium'
                    : isDone
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-neutral-500 font-medium">{idx + 1}.</span>
                )}
                <span className="truncate max-w-[140px]">{m.title}</span>

                {isCur && (
                  <motion.div
                    layoutId="activeStageUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 2. Quiet Tabs for Progressive Disclosure */}
        <div className="flex border-b border-white/[0.08] bg-[#000000] px-6 text-xs font-medium">
          {[
            { id: 'stage', label: 'Task Spec' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'scenario', label: 'Context' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative py-3 px-3 transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSpecTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Stage Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
          <AnimatePresence mode="wait">
            {activeTab === 'stage' && (
              <motion.div 
                key={`stage-${activeMilestone.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Stage Headline */}
                <div className="space-y-2 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-2 text-xs text-neutral-500 font-medium">
                    <span>Stage {activeMilestone.id} of {project.milestones.length}</span>
                    {isCompleted && (
                      <span className="text-emerald-400 flex items-center space-x-1 font-medium ml-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-medium text-white tracking-tight leading-snug">
                    {activeMilestone.title}
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {activeMilestone.subtitle}
                  </p>
                </div>

                {/* Objective */}
                <div className="border-l border-white/20 pl-4 space-y-1 py-0.5">
                  <span className="text-[11px] font-medium text-neutral-400 block">
                    Objective
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                    {activeMilestone.goal}
                  </p>
                </div>

                {/* Acceptance Checklist */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-medium text-neutral-400 block">
                    Acceptance Criteria
                  </span>
                  <ul className="space-y-2.5 text-xs">
                    {activeMilestone.specs.map((spec, i) => (
                      <li key={i} className="flex items-start space-x-2.5 text-neutral-300">
                        <span className="text-emerald-400 select-none mt-0.5 font-bold">✓</span>
                        <span className="leading-relaxed">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concepts Learned with Tooltip */}
                <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                  <span className="text-[11px] font-medium text-neutral-400 block">
                    Core Concepts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeMilestone.concepts.map((concept, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <span
                            className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 border border-white/[0.06] cursor-help transition-colors"
                          >
                            {concept}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Core architectural concept verified in Stage {activeMilestone.id}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Collapsible Guidance / Hints */}
                {activeMilestone.hints.length > 0 && (
                  <div className="pt-3 border-t border-white/[0.08]">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>
                        {showHints ? 'Hide guidance hints' : 'Need guidance? View hints'}
                      </span>
                      {showHints ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    <AnimatePresence>
                      {showHints && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 border-l border-white/10 pl-4 space-y-2 text-xs text-neutral-400 pt-1">
                            {activeMilestone.hints.map((hint, idx) => (
                              <p key={idx} className="leading-relaxed">
                                • {hint}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* ARCHITECTURE VIEW */}
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <ArchitectureView
                  nodes={project.architectureNodes}
                  edges={project.architectureEdges}
                  systemDescription={project.systemDescription}
                />
              </motion.div>
            )}

            {/* REAL-WORLD CONTEXT */}
            {activeTab === 'scenario' && (
              <motion.div
                key="scenario"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 text-xs"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-neutral-400 block">
                    Production Scenario
                  </span>
                  <p className="text-neutral-200 leading-relaxed">
                    {project.scenario}
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-white/[0.08]">
                  <span className="text-[11px] font-medium text-neutral-400 block">
                    System Contract & Constraints
                  </span>
                  <p className="text-neutral-400 leading-relaxed">
                    {project.systemDescription}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};
