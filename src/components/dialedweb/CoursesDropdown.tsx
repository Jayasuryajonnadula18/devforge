'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlowingMenu, FlowingMenuItem } from '../reactbits/FlowingMenu';
import { ProjectTrack } from '../../types';
import { Sparkles, X, Terminal } from 'lucide-react';

interface CoursesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectTrack[];
  onSelectProject: (p: ProjectTrack) => void;
}

export const CoursesDropdown: React.FC<CoursesDropdownProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
}) => {
  const menuItems: FlowingMenuItem[] = projects.map((p) => ({
    text: p.title.split('(')[0].trim(),
    marquee: `${p.languageBadge} · ${p.level} Complexity · ${p.tagline}`,
    meta: p.languageBadge,
    onClick: () => {
      onSelectProject(p);
      onClose();
    },
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Dismissal Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Elevated Floating Dropdown Window */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-2xl bg-[#0d0907]/95 border border-white/15 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden pointer-events-auto flex flex-col"
            style={{
              maxHeight: 'calc(100vh - 120px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans font-semibold text-white text-sm">
                      Curriculum Tracks
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                      {projects.length} Real-World Systems
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans">
                    Hover to preview architecture invariants · Click to launch Studio
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kinetic FlowingMenu Canvas */}
            <div className="relative h-[340px] sm:h-[380px] w-full overflow-hidden bg-gradient-to-b from-transparent to-black/30">
              <FlowingMenu
                items={menuItems}
                speed={50}
                direction="alternate"
                stretch={0.5}
                magnet={0.2}
                followCursor={0.35}
                textColor="#f5f4f0"
                bgColor="transparent"
                marqueeBgColor="#f59e0b"
                marqueeTextColor="#050608"
                borderColor="rgba(255, 255, 255, 0.08)"
                dividers={true}
                showIndex={true}
                showArrow={true}
                align="left"
              />
            </div>

            {/* Footer Prompt */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-neutral-400 font-sans">
              <span className="flex items-center space-x-1.5 text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Each track includes zero-setup in-browser test validation</span>
              </span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                ESC to close
              </kbd>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
