'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  Play, 
  RotateCcw, 
  FolderGit2, 
  Cpu, 
  Layers, 
  Code2, 
  ArrowRight, 
  BookOpen,
  X
} from 'lucide-react';
import { ProjectTrack } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectTrack[];
  onSelectProject: (p: ProjectTrack) => void;
  onRunTests?: () => void;
  onResetCode?: () => void;
  onNavigateToCatalog?: () => void;
  onNavigateToStudio?: () => void;
  isInStudio?: boolean;
}

interface CommandItem {
  id: string;
  category: 'Tracks' | 'Actions' | 'Navigation';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onRunTests,
  onResetCode,
  onNavigateToCatalog,
  onNavigateToStudio,
  isInStudio = false,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Actions
    ...(isInStudio && onRunTests ? [{
      id: 'action-run',
      category: 'Actions' as const,
      title: 'Verify Solution Invariants',
      subtitle: 'Execute in-browser test runner against acceptance criteria',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      shortcut: '⌘↵',
      action: () => {
        onRunTests();
        onClose();
      }
    }] : []),
    ...(isInStudio && onResetCode ? [{
      id: 'action-reset',
      category: 'Actions' as const,
      title: 'Reset Active Project Code',
      subtitle: 'Revert to untouched starter template files',
      icon: <RotateCcw className="w-4 h-4 text-neutral-400" />,
      action: () => {
        onResetCode();
        onClose();
      }
    }] : []),

    // Navigation
    ...(isInStudio && onNavigateToCatalog ? [{
      id: 'nav-catalog',
      category: 'Navigation' as const,
      title: 'Return to Curriculum Catalog',
      subtitle: 'Browse all systems engineering tracks and roadmaps',
      icon: <BookOpen className="w-4 h-4 text-neutral-300" />,
      action: () => {
        onNavigateToCatalog();
        onClose();
      }
    }] : []),
    ...(!isInStudio && onNavigateToStudio ? [{
      id: 'nav-studio',
      category: 'Navigation' as const,
      title: 'Enter Systems Studio',
      subtitle: 'Open the active development environment and editor',
      icon: <Terminal className="w-4 h-4 text-neutral-300" />,
      action: () => {
        onNavigateToStudio();
        onClose();
      }
    }] : []),

    // Tracks
    ...projects.map((p) => {
      let icon = <Layers className="w-4 h-4 text-neutral-300" />;
      if (p.language === 'go') icon = <Cpu className="w-4 h-4 text-cyan-400" />;
      else if (p.language === 'python') icon = <FolderGit2 className="w-4 h-4 text-amber-400" />;
      else if (p.language === 'typescript') icon = <Code2 className="w-4 h-4 text-blue-400" />;
      else if (p.language === 'rust') icon = <Layers className="w-4 h-4 text-orange-400" />;

      return {
        id: `track-${p.id}`,
        category: 'Tracks' as const,
        title: `${p.title} (${p.language})`,
        subtitle: p.tagline,
        icon,
        action: () => {
          onSelectProject(p);
          onClose();
        }
      };
    })
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#121215] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden font-sans z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 h-13 border-b border-white/[0.08]">
              <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search tracks..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No matching tracks or commands found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-white/[0.08] text-white' 
                          : 'text-neutral-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className="p-1.5 rounded-md bg-white/[0.05] shrink-0">
                          {cmd.icon}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-white truncate flex items-center gap-2">
                            <span>{cmd.title}</span>
                            <span className="text-[10px] text-neutral-500 px-1.5 py-0.2 bg-white/[0.04] rounded">
                              {cmd.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate">
                            {cmd.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-3">
                        {cmd.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-medium text-neutral-400 bg-white/[0.06] rounded border border-white/[0.08]">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-neutral-600'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with key hints */}
            <div className="h-9 px-4 bg-[#0a0a0c] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 select-none">
              <div className="flex items-center space-x-4">
                <span><kbd className="font-sans px-1 py-0.5 bg-white/[0.06] rounded text-[10px]">↑</kbd> <kbd className="font-sans px-1 py-0.5 bg-white/[0.06] rounded text-[10px]">↓</kbd> Navigate</span>
                <span><kbd className="font-sans px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px]">↵</kbd> Select</span>
                <span><kbd className="font-sans px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px]">esc</kbd> Dismiss</span>
              </div>
              <span>DevForge Studio</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
