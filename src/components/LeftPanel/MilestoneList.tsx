'use client';

import React, { useState } from 'react';
import { Milestone, TestResult } from '../../types';
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Code2, 
  AlertCircle 
} from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
  completedMilestoneIds: number[];
  activeMilestoneId: number;
  onSelectMilestone: (id: number) => void;
  testResults: TestResult[];
}

export const MilestoneList: React.FC<MilestoneListProps> = ({
  milestones,
  completedMilestoneIds,
  activeMilestoneId,
  onSelectMilestone,
  testResults,
}) => {
  const [expandedHints, setExpandedHints] = useState<Record<number, boolean>>({});

  const toggleHint = (mId: number) => {
    setExpandedHints(prev => ({
      ...prev,
      [mId]: !prev[mId]
    }));
  };

  return (
    <div className="space-y-4">
      {milestones.map((m) => {
        const isCompleted = completedMilestoneIds.includes(m.id);
        const isActive = activeMilestoneId === m.id;
        const hintsOpen = expandedHints[m.id] || false;

        // Check tests belonging to this milestone
        const mTestIds = m.testCases.map(tc => tc.id);
        const mResults = testResults.filter(tr => mTestIds.includes(tr.id));
        const allTestsPassed = mResults.length > 0 && mResults.every(tr => tr.passed);

        return (
          <div
            key={m.id}
            onClick={() => onSelectMilestone(m.id)}
            className={`border transition-all cursor-pointer ${
              isActive
                ? 'bg-[#15181d] border-[#3b82f6]'
                : isCompleted
                ? 'bg-[#111316] border-[#1e293b]'
                : 'bg-[#101215] border-[#23272f] hover:border-[#2f3542]'
            }`}
          >
            {/* Header Banner */}
            <div className="p-3 border-b border-[#1f242d] flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  ) : isActive ? (
                    <div className="w-4 h-4 border-2 border-[#3b82f6] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#3b82f6]" />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-[#4b5563]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-[#60a5fa] uppercase tracking-wider">
                      Milestone {m.id}
                    </span>
                    {isCompleted && (
                      <span className="text-[9px] font-mono bg-[#052e16] text-[#4ade80] px-1 border border-[#14532d]">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#f3f4f6] mt-0.5">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    {m.subtitle}
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="text-right">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                  isCompleted 
                    ? 'bg-[#064e3b] text-[#34d399] border-[#047857]' 
                    : isActive 
                    ? 'bg-[#1e3a8a] text-[#93c5fd] border-[#1d4ed8]' 
                    : 'bg-[#181b20] text-[#6b7280] border-[#282d37]'
                }`}>
                  {isCompleted ? 'COMPLETE' : isActive ? 'IN PROGRESS' : 'QUEUED'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-3 space-y-3">
              {/* Objective */}
              <div className="text-xs text-[#d1d5db] bg-[#0c0d0e] p-2 border border-[#1f242d] leading-relaxed">
                <span className="text-[#9ca3af] font-semibold">Objective: </span>
                {m.goal}
              </div>

              {/* Concepts Tags */}
              <div className="flex flex-wrap gap-1.5">
                {m.concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 bg-[#171a1f] text-[#cbd5e1] border border-[#262c37]"
                  >
                    #{concept}
                  </span>
                ))}
              </div>

              {/* Checklist / Specifications */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-semibold font-mono text-[#9ca3af] uppercase tracking-wider">
                  Acceptance Criteria
                </h4>
                <ul className="space-y-1 text-xs">
                  {m.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-start space-x-2 text-[#9ca3af]">
                      <span className="font-mono text-[#3b82f6] select-none text-[10px] mt-0.5">
                        [✓]
                      </span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test Spec Status */}
              {m.testCases.length > 0 && (
                <div className="pt-2 border-t border-[#1f242d]">
                  <h4 className="text-[11px] font-semibold font-mono text-[#6b7280] uppercase tracking-wider mb-1.5">
                    Automated Test Suite ({m.testCases.length})
                  </h4>
                  <div className="space-y-1">
                    {m.testCases.map((tc) => {
                      const res = testResults.find(r => r.id === tc.id);
                      const passed = res?.passed;

                      return (
                        <div
                          key={tc.id}
                          className={`p-2 text-xs border flex items-center justify-between ${
                            passed === true
                              ? 'bg-[#052e16] border-[#14532d] text-[#86efac]'
                              : passed === false
                              ? 'bg-[#450a0a] border-[#7f1d1d] text-[#fca5a5]'
                              : 'bg-[#0f1114] border-[#1f242d] text-[#9ca3af]'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Code2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-mono font-medium truncate">{tc.name}</span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 uppercase border shrink-0">
                            {passed === true ? 'PASS' : passed === false ? 'FAIL' : 'READY'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collapsible Hints */}
              {m.hints.length > 0 && (
                <div className="pt-2 border-t border-[#1f242d]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHint(m.id);
                    }}
                    className="flex items-center space-x-1.5 text-xs text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {hintsOpen ? 'Hide Implementation Hints' : `Show Hints (${m.hints.length})`}
                    </span>
                    {hintsOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {hintsOpen && (
                    <div className="mt-2 p-2.5 bg-[#17140b] border border-[#451a03] space-y-1.5">
                      {m.hints.map((hint, hIdx) => (
                        <div key={hIdx} className="text-xs text-[#fef3c7] flex items-start space-x-2">
                          <span className="text-[#f59e0b] font-mono">•</span>
                          <span>{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
