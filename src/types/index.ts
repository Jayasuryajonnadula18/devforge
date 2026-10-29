export type Language = 'go' | 'python' | 'typescript' | 'rust';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  expected: string;
  validate: (files: Record<string, string>) => { pass: boolean; error?: string; output?: string };
}

export interface Milestone {
  id: number;
  title: string;
  subtitle: string;
  goal: string;
  concepts: string[];
  specs: string[];
  hints: string[];
  testCases: TestCase[];
}

export interface ProjectFile {
  name: string;
  language: string;
  readOnly?: boolean;
  content: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
  type: 'input' | 'process' | 'storage' | 'output';
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label: string;
}

export interface ProjectTrack {
  id: string;
  title: string;
  language: Language;
  languageBadge: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tagline: string;
  scenario: string;
  systemDescription: string;
  architectureNodes: ArchitectureNode[];
  architectureEdges: ArchitectureEdge[];
  initialFiles: ProjectFile[];
  milestones: Milestone[];
}

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  durationMs: number;
  output?: string;
  error?: string;
}

export interface RunResults {
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
  rawOutput: string;
}
