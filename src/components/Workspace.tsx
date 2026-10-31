'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ProjectTrack, ProjectFile, RunResults, TestResult } from '../types';
import { Header } from './Header';
import { ProjectSpec } from './LeftPanel/ProjectSpec';
import { CodeEditor } from './RightPanel/CodeEditor';
import { TerminalOutput } from './RightPanel/TerminalOutput';
import { CatalogView } from './CatalogView';
import { CommandPalette } from './CommandPalette';
import { ExploreComingSoon } from './landing/ExploreComingSoon';
import { ContactPage } from './landing/ContactPage';
import { PROJECTS } from '../data/projects';

export const Workspace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'catalog' | 'studio' | 'explore' | 'contact'>('catalog');
  const [currentProject, setCurrentProject] = useState<ProjectTrack>(PROJECTS[0]);
  const [activeFileName, setActiveFileName] = useState<string>(PROJECTS[0].initialFiles[0].name);
  const [files, setFiles] = useState<ProjectFile[]>(PROJECTS[0].initialFiles);
  const [activeMilestoneId, setActiveMilestoneId] = useState<number>(1);
  const [completedMilestonesMap, setCompletedMilestonesMap] = useState<Record<string, number[]>>({});
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [lastResults, setLastResults] = useState<RunResults | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Switch to studio mode on project selection
  const handleSelectProject = (project: ProjectTrack) => {
    setCurrentProject(project);
    setFiles(project.initialFiles);
    setActiveFileName(project.initialFiles[0].name);
    setActiveMilestoneId(1);
    setLastResults(null);
    setViewMode('studio');
    toast(`Entered ${project.title}`, {
      description: `Track: ${project.languageBadge} · ${project.level} Complexity`,
    });
  };

  const handleCodeChange = (fileName: string, newContent: string) => {
    setFiles(prev => prev.map(f => f.name === fileName ? { ...f, content: newContent } : f));
  };

  const handleResetCode = () => {
    if (confirm(`Reset ${currentProject.title} code files to initial starter state?`)) {
      setFiles(currentProject.initialFiles);
      setLastResults(null);
      toast.info('Starter files restored to baseline state.');
    }
  };

  const activeMilestoneIndex = Math.max(
    0,
    currentProject.milestones.findIndex(m => m.id === activeMilestoneId)
  );

  const completedForCurrent = completedMilestonesMap[currentProject.id] || [];
  const hasNextStage = activeMilestoneIndex < currentProject.milestones.length - 1;

  const handleAdvanceStage = () => {
    if (hasNextStage) {
      const nextM = currentProject.milestones[activeMilestoneIndex + 1];
      setActiveMilestoneId(nextM.id);
      setLastResults(null);
      toast.success(`Advanced to Stage ${activeMilestoneIndex + 2}: ${nextM.title}`);
    }
  };

  // Run tests logic
  const handleRunTests = useCallback(() => {
    setIsRunningTests(true);

    const activeMilestone = currentProject.milestones.find(m => m.id === activeMilestoneId) || currentProject.milestones[0];
    const fileMap: Record<string, string> = {};
    files.forEach(f => {
      fileMap[f.name] = f.content;
    });

    setTimeout(() => {
      const results: TestResult[] = [];
      let passedCount = 0;

      activeMilestone.testCases.forEach((tc) => {
        try {
          const outcome = tc.validate(fileMap);
          if (outcome.pass) {
            passedCount++;
            results.push({
              id: tc.id,
              name: tc.name,
              passed: true,
              durationMs: Math.floor(Math.random() * 12) + 4,
              output: outcome.output || 'Assertion verified successfully.',
            });
          } else {
            results.push({
              id: tc.id,
              name: tc.name,
              passed: false,
              durationMs: Math.floor(Math.random() * 12) + 4,
              error: outcome.error || 'Test assertion failed.',
            });
          }
        } catch (err: unknown) {
          results.push({
            id: tc.id,
            name: tc.name,
            passed: false,
            durationMs: 6,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

      // Simulated toolchain terminal output
      let toolCmd = '';
      if (currentProject.language === 'go') {
        toolCmd = `$ go test -v -race ./...
=== RUN   TestBasicSetGet
--- PASS: TestBasicSetGet (0.01s)
=== RUN   TestTTLPurgatory
--- PASS: TestTTLPurgatory (0.05s)
=== RUN   TestConcurrentReadsWrites
--- PASS: TestConcurrentReadsWrites (0.03s)
PASS
ok      devforge/cache  0.092s`;
      } else if (currentProject.language === 'python') {
        toolCmd = `$ python3 -m unittest test_pygit.py -v
test_hash_blob (test_pygit.TestPyGit.test_hash_blob) ... ok
test_read_object (test_pygit.TestPyGit.test_read_object) ... ok

----------------------------------------------------------------------
Ran 2 tests in 0.002s

OK`;
      } else if (currentProject.language === 'typescript') {
        toolCmd = `$ npx ts-node queue.test.ts
[PASS] Concurrency slot validation passed
[PASS] DLQ routing verified for retry limit
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.284 s`;
      } else {
        toolCmd = `$ cargo test --lib
   Compiling devforge_parser v0.1.0
    Finished test [unoptimized + debuginfo] target(s) in 0.22s
     Running unittests src/lexer.rs

running 2 tests
test lexer::tests::test_lifetime_tokens ... ok
test lexer::tests::test_zero_copy_headers ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out`;
      }

      const total = results.length;
      const failed = total - passedCount;

      const runResults: RunResults = {
        timestamp: new Date().toLocaleTimeString(),
        total,
        passed: passedCount,
        failed,
        results,
        rawOutput: failed === 0 ? toolCmd : `${toolCmd}\n\n[FAIL] Found ${failed} unsatisfied acceptance criteria. Check Diagnostic tab.`,
      };

      setLastResults(runResults);
      setIsRunningTests(false);

      if (failed === 0 && total > 0) {
        toast.success(`Stage ${activeMilestone.id} Verified!`, {
          description: `All ${total} system invariants satisfied.`,
        });

        const isLastMilestone = activeMilestoneIndex === currentProject.milestones.length - 1;
        if (isLastMilestone) {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.65 },
            colors: ['#ffffff', '#a1a1aa', '#52525b', '#3b82f6', '#10b981']
          });
          toast.success(`Track Complete!`, {
            description: `You engineered all stages of ${currentProject.title}.`,
            duration: 5000,
          });
        }

        setCompletedMilestonesMap(prev => {
          const currentList = prev[currentProject.id] || [];
          if (!currentList.includes(activeMilestone.id)) {
            return {
              ...prev,
              [currentProject.id]: [...currentList, activeMilestone.id],
            };
          }
          return prev;
        });
      } else if (failed > 0) {
        toast.error(`Verification Failed`, {
          description: `${failed} acceptance criteria failed. Review diagnostic trace.`,
        });
      }
    }, 350);
  }, [currentProject, activeMilestoneId, files, activeMilestoneIndex]);

  // Global hotkeys (Ctrl/Cmd+K for palette, Ctrl/Cmd+Enter to Run Tests)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (viewMode === 'studio' && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunTests();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleRunTests]);

  // Global event listeners for routing views
  useEffect(() => {
    const handleOpenContact = () => setViewMode('contact');
    const handleOpenExplore = () => setViewMode('explore');
    const handleOpenStudio = () => setViewMode('studio');
    const handleOpenCatalog = () => setViewMode('catalog');

    window.addEventListener('devforge:open-contact', handleOpenContact);
    window.addEventListener('devforge:open-explore', handleOpenExplore);
    window.addEventListener('devforge:open-studio', handleOpenStudio);
    window.addEventListener('devforge:open-catalog', handleOpenCatalog);

    return () => {
      window.removeEventListener('devforge:open-contact', handleOpenContact);
      window.removeEventListener('devforge:open-explore', handleOpenExplore);
      window.removeEventListener('devforge:open-studio', handleOpenStudio);
      window.removeEventListener('devforge:open-catalog', handleOpenCatalog);
    };
  }, []);

  // Reset scroll and refresh Lenis scroll limits whenever changing views
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      setTimeout(() => lenis.resize(), 60);
    }
  }, [viewMode]);

  return (
    <>
      {/* Universal Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={PROJECTS}
        onSelectProject={handleSelectProject}
        onRunTests={handleRunTests}
        onResetCode={handleResetCode}
        onNavigateToCatalog={() => setViewMode('catalog')}
        onNavigateToStudio={() => setViewMode('studio')}
        isInStudio={viewMode === 'studio'}
      />

      {/* View Transition Modes */}
      <AnimatePresence mode="wait">
        {viewMode === 'catalog' ? (
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.2 }}
          >
            <CatalogView
              projects={PROJECTS}
              completedMilestones={completedMilestonesMap}
              onSelectProject={handleSelectProject}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenContact={() => setViewMode('contact')}
            />
          </motion.div>
        ) : viewMode === 'contact' ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen w-full bg-[#050608]"
          >
            <ContactPage onBack={() => setViewMode('catalog')} />
          </motion.div>
        ) : viewMode === 'explore' ? (
          <motion.div
            key="explore"
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen w-full bg-[#050608]"
          >
            <ExploreComingSoon onBack={() => setViewMode('catalog')} />
          </motion.div>
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-screen w-screen overflow-hidden bg-[#000000]"
          >
            {/* Top Workstation Header */}
            <Header
              currentProject={currentProject}
              completedMilestoneIds={completedForCurrent}
              onBackToCatalog={() => setViewMode('catalog')}
              onOpenProjectModal={() => setIsCommandPaletteOpen(true)}
              onRunTests={handleRunTests}
              onResetCode={handleResetCode}
              isRunningTests={isRunningTests}
              lastResults={lastResults}
              activeMilestoneIndex={activeMilestoneIndex}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />

            {/* Main Split-Pane Workspace */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel: Focused Specification (42% width) */}
              <div className="w-[42%] h-full shrink-0">
                <ProjectSpec
                  project={currentProject}
                  completedMilestoneIds={completedForCurrent}
                  activeMilestoneId={activeMilestoneId}
                  onSelectMilestone={(id) => setActiveMilestoneId(id)}
                  testResults={lastResults?.results || []}
                />
              </div>

              {/* Right Panel: Code Studio & Terminal (58% width) */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Upper: Multi-file Code Editor */}
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    files={files}
                    activeFileName={activeFileName}
                    onSelectFile={(name) => setActiveFileName(name)}
                    onCodeChange={handleCodeChange}
                  />
                </div>

                {/* Lower: Terminal Console */}
                <TerminalOutput
                  results={lastResults}
                  isRunning={isRunningTests}
                  language={currentProject.language}
                  onAdvanceStage={handleAdvanceStage}
                  hasNextStage={hasNextStage}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
