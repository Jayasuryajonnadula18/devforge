'use client';

import React from 'react';
import { ProjectTrack } from '../types';
import { PROJECTS } from '../data/projects';
import { X, Check, Code, Layers, Sparkles } from 'lucide-react';

interface ProjectSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onSelectProject: (project: ProjectTrack) => void;
}

export const ProjectSelectorModal: React.FC<ProjectSelectorModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  onSelectProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-none p-4">
      <div 
        className="w-full max-w-2xl bg-[#131518] border border-[#23272f] shadow-none flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-[#23272f] flex items-center justify-between bg-[#101215]">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#60a5fa] uppercase tracking-wider">
              Curriculum Tracks
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Select a Real-World Engineering Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9ca3af] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {PROJECTS.map((proj) => {
            const isSelected = proj.id === currentProjectId;

            return (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className={`p-3.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#181c24] border-[#2563eb]'
                    : 'bg-[#101215] border-[#23272f] hover:border-[#374151] hover:bg-[#15181d]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#1f242d] text-[#60a5fa] border border-[#2d3543] uppercase">
                      {proj.languageBadge}
                    </span>
                    <span className="text-[11px] font-mono text-[#9ca3af] px-1.5 py-0.5 bg-[#171a1f] border border-[#23272f]">
                      {proj.level}
                    </span>
                    <span className="text-[11px] text-[#6b7280] font-mono">
                      {proj.milestones.length} Milestones
                    </span>
                  </div>

                  {isSelected && (
                    <span className="flex items-center space-x-1 text-xs text-[#22c55e] font-mono bg-[#052e16] px-2 py-0.5 border border-[#14532d]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#f3f4f6]">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                  {proj.tagline}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#1f242d] flex items-center justify-between text-[11px] text-[#6b7280]">
                  <span className="truncate max-w-[420px]">
                    <strong className="text-[#9ca3af]">Scenario: </strong>{proj.scenario}
                  </span>
                  <span className="font-mono text-[#3b82f6] shrink-0 ml-2">
                    Start Track &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#101215] border-t border-[#23272f] flex items-center justify-between text-xs text-[#9ca3af]">
          <span className="font-mono text-[11px]">
            DevForge Engineering Platform
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1c2026] hover:bg-[#252b34] text-white border border-[#2b3340] text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
