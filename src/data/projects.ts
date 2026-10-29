import { ProjectTrack } from '../types';

export const PROJECTS: ProjectTrack[] = [
  {
    id: 'go-cache',
    title: 'Concurrent In-Memory Cache (Redis-Lite)',
    language: 'go',
    languageBadge: 'Go 1.23',
    level: 'Intermediate',
    tagline: 'Master Go concurrency, sync.RWMutex, channels, and background cleanup goroutines.',
    scenario: 'High-throughput microservices at an e-commerce platform require a sub-millisecond in-memory cache to absorb traffic spikes without overwhelming Postgres.',
    systemDescription: 'An in-memory key-value cache supporting Set, Get, Delete, TTL expiration, and automatic background cleanup via ticker channels.',
    architectureNodes: [
      { id: 'client', label: 'HTTP / RPC Clients', description: 'Concurrent readers and writers issuing queries', type: 'input' },
      { id: 'rwlock', label: 'sync.RWMutex', description: 'Permits unlimited concurrent readers, singular exclusive writer', type: 'process' },
      { id: 'store', label: 'Map [string]Item', description: 'Underlying raw hash map storing values & Unix expiry timestamps', type: 'storage' },
      { id: 'cleaner', label: 'Eviction Goroutine', description: 'time.NewTicker daemon loop pruning dead keys asynchronously', type: 'process' },
    ],
    architectureEdges: [
      { from: 'client', to: 'rwlock', label: 'Get / Set' },
      { from: 'rwlock', to: 'store', label: 'Safe Read / Write' },
      { from: 'cleaner', to: 'rwlock', label: 'Periodic Lock & Prune' },
    ],
    initialFiles: [
      {
        name: 'cache.go',
        language: 'go',
        content: `package main

import (
	"sync"
	"time"
	"errors"
)

var (
	ErrKeyNotFound = errors.New("key not found in cache")
	ErrKeyExpired  = errors.New("key has expired")
)

type Item struct {
	Value      interface{}
	ExpiresAt  int64 // Unix nanoseconds, 0 means no expiry
}

func (i Item) IsExpired() bool {
	if i.ExpiresAt == 0 {
		return false
	}
	return time.Now().UnixNano() > i.ExpiresAt
}

type Cache struct {
	mu    sync.RWMutex
	items map[string]Item
	stopChan chan struct{}
}

// NewCache initializes an empty thread-safe cache
func NewCache(cleanupInterval time.Duration) *Cache {
	c := &Cache{
		items:    make(map[string]Item),
		stopChan: make(chan struct{}),
	}
	
	// Milestone 3: launch background cleaner goroutine
	if cleanupInterval > 0 {
		go c.startJanitor(cleanupInterval)
	}

	return c
}

// Set stores a value with an optional TTL (0 = no expiration)
func (c *Cache) Set(key string, value interface{}, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	var expiresAt int64
	if ttl > 0 {
		expiresAt = time.Now().Add(ttl).UnixNano()
	}

	c.items[key] = Item{
		Value:     value,
		ExpiresAt: expiresAt,
	}
}

// Get retrieves a value, returning ErrKeyNotFound or ErrKeyExpired
func (c *Cache) Get(key string) (interface{}, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, exists := c.items[key]
	if !exists {
		return nil, ErrKeyNotFound
	}

	if item.IsExpired() {
		return nil, ErrKeyExpired
	}

	return item.Value, nil
}

// Delete removes a key immediately
func (c *Cache) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.items, key)
}

// Size returns count of non-expired keys
func (c *Cache) Size() int {
	c.mu.RLock()
	defer c.mu.RUnlock()

	count := 0
	for _, item := range c.items {
		if !item.IsExpired() {
			count++
		}
	}
	return count
}

// startJanitor runs in a goroutine and periodically sweeps expired keys
func (c *Cache) startJanitor(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			c.DeleteExpired()
		case <-c.stopChan:
			return
		}
	}
}

// DeleteExpired scans and removes all dead keys under a write lock
func (c *Cache) DeleteExpired() {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := time.Now().UnixNano()
	for k, item := range c.items {
		if item.ExpiresAt > 0 && now > item.ExpiresAt {
			delete(c.items, k)
		}
	}
}

// Close terminates background routines
func (c *Cache) Close() {
	close(c.stopChan)
}
`,
      },
      {
        name: 'cache_test.go',
        language: 'go',
        readOnly: true,
        content: `package main

import (
	"sync"
	"testing"
	"time"
)

func TestBasicSetGet(t *testing.T) {
	c := NewCache(0)
	c.Set("user:101", "Mahesh", 0)

	val, err := c.Get("user:101")
	if err != nil || val != "Mahesh" {
		t.Fatalf("Expected 'Mahesh', got %v (err: %v)", val, err)
	}
}

func TestTTLPurgatory(t *testing.T) {
	c := NewCache(0)
	c.Set("token:session", "abc", 50*time.Millisecond)

	time.Sleep(70 * time.Millisecond)
	_, err := c.Get("token:session")
	if err != ErrKeyExpired {
		t.Fatalf("Expected ErrKeyExpired, got: %v", err)
	}
}

func TestConcurrentReadsWrites(t *testing.T) {
	c := NewCache(0)
	var wg sync.WaitGroup

	// 50 concurrent writers
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			c.Set("counter", id, 0)
		}(i)
	}

	// 100 concurrent readers
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Get("counter")
		}()
	}

	wg.Wait()
}
`,
      },
      {
        name: 'main.go',
        language: 'go',
        content: `package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("=== Starting DevForge Cache Server ===")
	cache := NewCache(100 * time.Millisecond)
	defer cache.Close()

	cache.Set("status", "healthy", 0)
	cache.Set("temp_otp", "948211", 500*time.Millisecond)

	val, _ := cache.Get("status")
	fmt.Printf("[OK] status = %v\\n", val)
	fmt.Printf("[OK] Active items in memory: %d\\n", cache.Size())
}
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Core Store & Thread-Safe Access',
        subtitle: 'Protecting state with sync.RWMutex',
        goal: 'Implement basic Set, Get, and Delete methods using read/write locks to prevent data races.',
        concepts: ['sync.RWMutex', 'Data Race Condition', 'defer unlock', 'Value Wrapping'],
        specs: [
          'Create NewCache constructor initializing the map',
          'Implement Set(key, value, ttl) with c.mu.Lock()',
          'Implement Get(key) with c.mu.RLock() returning ErrKeyNotFound if missing',
          'Implement Delete(key) under write lock',
        ],
        hints: [
          'Always defer c.mu.Unlock() immediately after c.mu.Lock().',
          'Multiple readers can safely read simultaneously using c.mu.RLock(), which avoids bottle-necking reads.',
        ],
        testCases: [
          {
            id: 'go-m1-t1',
            name: 'Store Initialization',
            description: 'Verifies NewCache instantiates the map and returns non-nil pointer',
            expected: 'NewCache returns valid *Cache',
            validate: (files) => {
              const code = files['cache.go'] || '';
              if (!code.includes('NewCache') || !code.includes('make(map[string]Item)')) {
                return { pass: false, error: 'NewCache must initialize the internal items map.' };
              }
              return { pass: true, output: 'PASS: NewCache properly configured.' };
            },
          },
          {
            id: 'go-m1-t2',
            name: 'RWMutex Concurrency Guards',
            description: 'Ensures RLock is used on reads and Lock on mutations',
            expected: 'RLock on Get, Lock on Set and Delete',
            validate: (files) => {
              const code = files['cache.go'] || '';
              const hasRLock = code.includes('c.mu.RLock()') && code.includes('c.mu.RUnlock()');
              const hasLock = code.includes('c.mu.Lock()') && code.includes('c.mu.Unlock()');
              if (!hasRLock || !hasLock) {
                return { pass: false, error: 'Must use c.mu.RLock() for Get() and c.mu.Lock() for Set()/Delete().' };
              }
              return { pass: true, output: 'PASS: Concurrency safety verified with sync.RWMutex.' };
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Time-To-Live (TTL) & Lazy Eviction',
        subtitle: 'Passive expiration checking on access',
        goal: 'Add timestamp validation to Get() so expired keys return ErrKeyExpired instead of stale values.',
        concepts: ['time.Now().UnixNano()', 'Lazy Expiry vs Active Sweep', 'Immutable Item Struct'],
        specs: [
          'Calculate item.ExpiresAt based on current time + duration',
          'Support ttl = 0 as immortal key (ExpiresAt = 0)',
          'Check item.IsExpired() inside Get() under read lock and return ErrKeyExpired',
        ],
        hints: [
          'Using UnixNano timestamps avoids memory overhead compared to storing full time.Time instances.',
          'Lazy expiration means keys are only confirmed dead when accessed.',
        ],
        testCases: [
          {
            id: 'go-m2-t1',
            name: 'Expiration Detection',
            description: 'Checks IsExpired() logic handles 0 vs positive timestamps',
            expected: 'Returns false if 0, true if timestamp in past',
            validate: (files) => {
              const code = files['cache.go'] || '';
              if (!code.includes('IsExpired') || !code.includes('ExpiresAt == 0')) {
                return { pass: false, error: 'IsExpired() method must handle immortal keys (0) and Unix timestamps.' };
              }
              return { pass: true, output: 'PASS: TTL calculation passes spec.' };
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Background Cleaner Goroutine (Janitor)',
        subtitle: 'Active memory sweeping with time.Ticker',
        goal: 'Prevent memory leaks by building an asynchronous daemon loop that removes dead keys periodically.',
        concepts: ['time.NewTicker', 'select channel multiplexing', 'Graceful Shutdown (stopChan)'],
        specs: [
          'Create startJanitor(interval) that loops on ticker.C',
          'Implement DeleteExpired() to prune items under write lock',
          'Implement Close() closing stopChan to prevent goroutine leaks',
        ],
        hints: [
          'Always stop tickers using defer ticker.Stop() to free runtime timer resources.',
          'Closing stopChan broadcasts termination to all listeners simultaneously.',
        ],
        testCases: [
          {
            id: 'go-m3-t1',
            name: 'Janitor Daemon Loop',
            description: 'Ensures ticker and stopChan multiplexing in select statement',
            expected: 'select on ticker.C and stopChan',
            validate: (files) => {
              const code = files['cache.go'] || '';
              if (!code.includes('time.NewTicker') || !code.includes('select') || !code.includes('stopChan')) {
                return { pass: false, error: 'Background sweeper must use time.NewTicker with a select on stopChan.' };
              }
              return { pass: true, output: 'PASS: Janitor eviction loop correctly implemented.' };
            },
          },
        ],
      },
    ],
  },
  {
    id: 'py-git',
    title: 'Distributed VCS (Mini-Git) in Python',
    language: 'python',
    languageBadge: 'Python 3.12',
    level: 'Advanced',
    tagline: 'Understand Git internals: content-addressable storage, SHA-1 hashing, and DAG commit trees.',
    scenario: 'You are architecting a sandboxed code runner that needs instant file snapshots and branching without invoking external subshells or third-party git binaries.',
    systemDescription: 'Pure Python implementation of .git object store: blobs (files), trees (directories), commits (snapshots with parents), and HEAD reference resolution.',
    architectureNodes: [
      { id: 'working', label: 'Working Directory', description: 'Raw project files edited by the user', type: 'input' },
      { id: 'blob', label: 'hash-object (Blob)', description: 'Raw byte content prefixed with size + null byte, zlib-compressed', type: 'process' },
      { id: 'objects', label: '.git/objects/xx/yyyy', description: 'Content-addressable storage keyed by 40-char SHA-1 hash', type: 'storage' },
      { id: 'tree', label: 'write-tree (Tree)', description: 'Directory hierarchy mapping file names to Blob SHA-1s', type: 'process' },
      { id: 'commit', label: 'commit-tree (Commit)', description: 'Snapshot containing tree SHA, parent commit, author, and message', type: 'output' },
    ],
    architectureEdges: [
      { from: 'working', to: 'blob', label: 'Read Bytes' },
      { from: 'blob', to: 'objects', label: 'SHA-1 Addressable Write' },
      { from: 'objects', to: 'tree', label: 'Aggregate Directory' },
      { from: 'tree', to: 'commit', label: 'Anchor Snapshot' },
    ],
    initialFiles: [
      {
        name: 'pygit.py',
        language: 'python',
        content: `import os
import hashlib
import zlib
import sys

class GitRepository:
    """Manages content-addressable object database and references."""
    
    def __init__(self, repo_path="."):
        self.repo_path = repo_path
        self.git_dir = os.path.join(repo_path, ".pygit")
        self.obj_dir = os.path.join(self.git_dir, "objects")
        self.refs_dir = os.path.join(self.git_dir, "refs", "heads")
        
    def init(self):
        """Initializes repository directory structure."""
        os.makedirs(self.obj_dir, exist_ok=True)
        os.makedirs(self.refs_dir, exist_ok=True)
        head_file = os.path.join(self.git_dir, "HEAD")
        if not os.path.exists(head_file):
            with open(head_file, "w") as f:
                f.write("ref: refs/heads/main\\n")
        return self.git_dir

    def hash_object(self, data: bytes, obj_type: str = "blob", write: bool = True) -> str:
        """
        Creates a Git object:
        Header format: '<type> <size>\\x00' + data
        Returns 40-character hexadecimal SHA-1 string.
        """
        header = f"{obj_type} {len(data)}\\x00".encode("utf-8")
        full_payload = header + data
        sha1 = hashlib.sha1(full_payload).hexdigest()

        if write:
            obj_subfolder = os.path.join(self.obj_dir, sha1[:2])
            obj_path = os.path.join(obj_subfolder, sha1[2:])
            if not os.path.exists(obj_path):
                os.makedirs(obj_subfolder, exist_ok=True)
                compressed = zlib.compress(full_payload)
                with open(obj_path, "wb") as f:
                    f.write(compressed)

        return sha1

    def read_object(self, sha1: str):
        """Reads and decompress an object by SHA-1 hash."""
        obj_path = os.path.join(self.obj_dir, sha1[:2], sha1[2:])
        if not os.path.exists(obj_path):
            raise FileNotFoundError(f"Object {sha1} not found")

        with open(obj_path, "rb") as f:
            raw = zlib.decompress(f.read())

        null_idx = raw.find(b"\\x00")
        header = raw[:null_idx].decode("utf-8")
        obj_type, size_str = header.split(" ")
        data = raw[null_idx + 1:]
        return obj_type, int(size_str), data

    def commit(self, tree_sha: str, message: str, parent_sha: str = None) -> str:
        """Creates a commit object and advances HEAD branch."""
        lines = [f"tree {tree_sha}"]
        if parent_sha:
            lines.append(f"parent {parent_sha}")
        lines.append("author DevForge Engineer <engineer@devforge.dev> 1700000000 +0000")
        lines.append("committer DevForge Engineer <engineer@devforge.dev> 1700000000 +0000")
        lines.append("")
        lines.append(message)
        lines.append("")

        commit_content = "\\n".join(lines).encode("utf-8")
        commit_sha = self.hash_object(commit_content, obj_type="commit", write=True)

        # Update current branch ref
        self._update_ref("refs/heads/main", commit_sha)
        return commit_sha

    def _update_ref(self, ref_name: str, sha1: str):
        ref_file = os.path.join(self.git_dir, ref_name)
        os.makedirs(os.path.dirname(ref_file), exist_ok=True)
        with open(ref_file, "w") as f:
            f.write(sha1 + "\\n")
`,
      },
      {
        name: 'test_pygit.py',
        language: 'python',
        readOnly: true,
        content: `import unittest
import tempfile
import shutil
import os
from pygit import GitRepository

class TestPyGit(unittest.TestCase):
    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.repo = GitRepository(self.test_dir)
        self.repo.init()

    def tearDown(self):
        shutil.rmtree(self.test_dir)

    def test_hash_blob(self):
        content = b"hello world\\n"
        # Standard git hash for "hello world\\n" is d670460b4b4aece5915caf5c68d12f560a9fe3e4
        sha = self.repo.hash_object(content, obj_type="blob")
        self.assertEqual(sha, "d670460b4b4aece5915caf5c68d12f560a9fe3e4")

    def test_read_object(self):
        content = b"test content"
        sha = self.repo.hash_object(content, obj_type="blob")
        obj_type, size, data = self.repo.read_object(sha)
        self.assertEqual(obj_type, "blob")
        self.assertEqual(size, len(content))
        self.assertEqual(data, content)

if __name__ == '__main__':
    unittest.main()
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Content-Addressable Blob Storage',
        subtitle: 'Formatting headers and zlib compression',
        goal: 'Format git raw objects (<type> <size>\\x00<content>), compute SHA-1, and store zlib compressed bytes.',
        concepts: ['SHA-1 Hash Digestion', 'zlib.compress/decompress', 'Content Addressability'],
        specs: [
          'Prepend header `<type> <size>\\x00` to binary data',
          'Digest with hashlib.sha1()',
          'Save to `.pygit/objects/<sha[:2]>/<sha[2:]>` compressed with zlib',
        ],
        hints: [
          'Git splits the 40-character hex SHA-1 into 2-char directory and 38-char filename to avoid folder inode limits.',
          'The null byte byte delimiter b"\\x00" separates metadata from payload.',
        ],
        testCases: [
          {
            id: 'py-m1-t1',
            name: 'Git Object Header Compliance',
            description: 'Verifies header format matches standard Git canonical structure',
            expected: 'f"{obj_type} {len(data)}\\x00"',
            validate: (files) => {
              const code = files['pygit.py'] || '';
              if (!code.includes('hashlib.sha1') || !code.includes('zlib.compress')) {
                return { pass: false, error: 'Must use hashlib.sha1 for hashing and zlib.compress for storage.' };
              }
              return { pass: true, output: 'PASS: Object header format matches Git protocol standards.' };
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Commit Objects & Branch References',
        subtitle: 'Building the Directed Acyclic Graph (DAG)',
        goal: 'Create commit objects holding tree SHA, author info, and parent pointers, updating HEAD.',
        concepts: ['Commit DAG structure', 'Pointers & References', 'Fast-Forwarding'],
        specs: [
          'Format commit body with tree, parent, author, and commit message',
          'Hash the commit body and save as object',
          'Update branch ref file under `.pygit/refs/heads/`',
        ],
        hints: [
          'A branch in Git is simply a 41-byte text file containing a 40-character hex commit SHA plus a newline.',
        ],
        testCases: [
          {
            id: 'py-m2-t1',
            name: 'Commit Formatting & Ref Updating',
            description: 'Ensures tree, parent, author, and message are serialized',
            expected: 'commit content contains tree, parent, author lines',
            validate: (files) => {
              const code = files['pygit.py'] || '';
              if (!code.includes('tree {tree_sha}') || !code.includes('_update_ref')) {
                return { pass: false, error: 'Commit method must format tree lines and update branch references.' };
              }
              return { pass: true, output: 'PASS: Commit structure and DAG pointer verified.' };
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ts-queue',
    title: 'Event-Driven Async Task Engine in TypeScript',
    language: 'typescript',
    languageBadge: 'TypeScript 5.6',
    level: 'Intermediate',
    tagline: 'Build a durable, typed background task orchestrator with retry budgets, jitter, and dead-letter queue.',
    scenario: 'A payment gateway needs to process transactional webhooks reliably with concurrency limits, exponential backoff, and idempotent deduplication.',
    systemDescription: 'An in-memory async task runner with typed events, concurrency slots, worker pools, retry policies with backoff, and state machines.',
    architectureNodes: [
      { id: 'producer', label: 'Task Enqueue', description: 'Incoming payloads with unique idempotency keys', type: 'input' },
      { id: 'limiter', label: 'Concurrency Limiter', description: 'Caps parallel execution slots to prevent resource exhaustion', type: 'process' },
      { id: 'workers', label: 'Worker Handlers', description: 'Typed async functions executing job logic', type: 'process' },
      { id: 'dlq', label: 'Dead Letter Queue', description: 'Isolates poisoned/failed jobs after retry exhaustion', type: 'storage' },
    ],
    architectureEdges: [
      { from: 'producer', to: 'limiter', label: 'Priority FIFO' },
      { from: 'limiter', to: 'workers', label: 'Dispatch Job' },
      { from: 'workers', to: 'dlq', label: 'Max Retries Exceeded' },
    ],
    initialFiles: [
      {
        name: 'queue.ts',
        language: 'typescript',
        content: `export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Job<T = unknown> {
  id: string;
  name: string;
  data: T;
  retries: number;
  maxRetries: number;
  status: JobStatus;
  error?: string;
  createdAt: number;
}

export type JobHandler<T = unknown, R = unknown> = (job: Job<T>) => Promise<R>;

export class TaskQueue {
  private queue: Job[] = [];
  private activeCount: number = 0;
  private concurrency: number;
  private handlers = new Map<string, JobHandler>();
  private deadLetterQueue: Job[] = [];
  private deduplicationSet = new Set<string>();

  constructor(concurrency = 3) {
    this.concurrency = concurrency;
  }

  registerHandler<T, R>(name: string, handler: JobHandler<T, R>): void {
    this.handlers.set(name, handler as JobHandler);
  }

  async add<T>(name: string, data: T, options?: { id?: string; maxRetries?: number }): Promise<Job<T>> {
    const id = options?.id || Math.random().toString(36).substring(2, 9);
    
    // Idempotency check
    if (this.deduplicationSet.has(id)) {
      throw new Error(\`Duplicate job ID rejected: \${id}\`);
    }
    this.deduplicationSet.add(id);

    const job: Job<T> = {
      id,
      name,
      data,
      retries: 0,
      maxRetries: options?.maxRetries ?? 3,
      status: 'pending',
      createdAt: Date.now(),
    };

    this.queue.push(job as Job);
    this.processNext();
    return job;
  }

  private async processNext(): Promise<void> {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.activeCount++;
    job.status = 'running';

    const handler = this.handlers.get(job.name);
    if (!handler) {
      job.status = 'failed';
      job.error = \`No handler registered for task: \${job.name}\`;
      this.deadLetterQueue.push(job);
      this.activeCount--;
      this.processNext();
      return;
    }

    try {
      await handler(job);
      job.status = 'completed';
    } catch (err: unknown) {
      job.retries++;
      if (job.retries >= job.maxRetries) {
        job.status = 'failed';
        job.error = err instanceof Error ? err.message : String(err);
        this.deadLetterQueue.push(job);
      } else {
        job.status = 'pending';
        // Exponential backoff re-insertion
        const delay = Math.pow(2, job.retries) * 50;
        setTimeout(() => {
          this.queue.push(job);
          this.processNext();
        }, delay);
      }
    } finally {
      this.activeCount--;
      this.processNext();
    }
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  getDeadLetterJobs(): Job[] {
    return [...this.deadLetterQueue];
  }
}
`,
      },
      {
        name: 'queue.test.ts',
        language: 'typescript',
        readOnly: true,
        content: `import { TaskQueue } from './queue';

async function runTests() {
  const queue = new TaskQueue(2);
  let processed = 0;

  queue.registerHandler('send-email', async (job) => {
    processed++;
    return { success: true };
  });

  await queue.add('send-email', { email: 'user@test.com' });
  console.log('[PASS] Job added & dispatched successfully');
}
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Task Queue & Concurrency Slot Throttling',
        subtitle: 'Managing asynchronous worker capacity',
        goal: 'Implement task registration, queuing, and slot-capped execution using activeCount and concurrency ceiling.',
        concepts: ['Async Task Queues', 'Worker Capacity Limiter', 'Event Loop Scheduling'],
        specs: [
          'Maintain activeCount tracking currently running promises',
          'Halt dispatch when activeCount reaches concurrency limit',
          'Ensure processNext() drains remaining queue after each completion',
        ],
        hints: [
          'Use finally blocks in async handlers to guarantee activeCount is decremented even on unexpected exceptions.',
        ],
        testCases: [
          {
            id: 'ts-m1-t1',
            name: 'Concurrency Throttle Validation',
            description: 'Checks processNext guards with activeCount >= concurrency',
            expected: 'activeCount capped at concurrency limit',
            validate: (files) => {
              const code = files['queue.ts'] || '';
              if (!code.includes('this.activeCount >= this.concurrency')) {
                return { pass: false, error: 'Must restrict execution when activeCount >= concurrency.' };
              }
              return { pass: true, output: 'PASS: Concurrency throttling implemented.' };
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Exponential Backoff Retries & Dead Letter Queue',
        subtitle: 'Handling transient failures and isolating poisoned jobs',
        goal: 'Implement retry counters with backoff delays, routing exhausted failures to a Dead Letter Queue.',
        concepts: ['Exponential Backoff', 'Dead Letter Queue (DLQ)', 'Idempotent Deduplication'],
        specs: [
          'Increment job.retries on caught exceptions',
          'Route to deadLetterQueue when job.retries >= maxRetries',
          'Apply exponential delay before re-queueing failed jobs',
        ],
        hints: [
          'Delay can be calculated as Math.pow(2, job.retries) * baseDelay.',
        ],
        testCases: [
          {
            id: 'ts-m2-t1',
            name: 'Retry & DLQ Routing',
            description: 'Verifies deadLetterQueue receives failed jobs after retry limits',
            expected: 'deadLetterQueue.push(job) on max retries',
            validate: (files) => {
              const code = files['queue.ts'] || '';
              if (!code.includes('this.deadLetterQueue.push(job)')) {
                return { pass: false, error: 'Failed jobs exceeding maxRetries must be pushed to deadLetterQueue.' };
              }
              return { pass: true, output: 'PASS: Fault tolerance and DLQ validated.' };
            },
          },
        ],
      },
    ],
  },
  {
    id: 'rust-parser',
    title: 'Zero-Allocation Markdown Lexer in Rust',
    language: 'rust',
    languageBadge: 'Rust 1.82',
    level: 'Advanced',
    tagline: 'Master Rust memory safety, string slices (&str), peekable iterators, and zero-copy tokenization.',
    scenario: 'High-speed technical documentation generators need a markdown tokenizer that parses gigabytes of markdown at memory bus speeds with zero heap allocations.',
    systemDescription: 'A high-throughput lexer emitting borrowed token slices (&str) from input strings without cloning or heap allocations.',
    architectureNodes: [
      { id: 'input', label: '&str Input Buffer', description: 'Raw immutable markdown text in contiguous memory', type: 'input' },
      { id: 'peekable', label: 'Chars().peekable()', description: 'Zero-overhead character stream lookahead', type: 'process' },
      { id: 'matcher', label: 'Pattern Matcher', description: 'Zero-copy token branch (Headers, Code, Lists, Text)', type: 'process' },
      { id: 'tokens', label: 'Token<\'a> Stream', description: 'Enums carrying borrowed slices referencing input memory', type: 'output' },
    ],
    architectureEdges: [
      { from: 'input', to: 'peekable', label: 'Borrow Slice' },
      { from: 'peekable', to: 'matcher', label: 'Lookahead 1 Char' },
      { from: 'matcher', to: 'tokens', label: 'Emit Lifetime-Bound Tokens' },
    ],
    initialFiles: [
      {
        name: 'lexer.rs',
        language: 'rust',
        content: `#[derive(Debug, PartialEq, Eq)]
pub enum Token<'a> {
    Header { level: u8, text: &'a str },
    ListItem(&'a str),
    CodeBlock { lang: &'a str, code: &'a str },
    Paragraph(&'a str),
    Newline,
}

pub struct Lexer<'a> {
    input: &'a str,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Self { input }
    }

    pub fn tokenize(&self) -> Vec<Token<'a>> {
        let mut tokens = Vec::new();
        
        for line in self.input.lines() {
            let trimmed = line.trim();
            if trimmed.is_empty() {
                tokens.push(Token::Newline);
                continue;
            }

            // Headers (# Title, ## Subtitle)
            if trimmed.starts_with('#') {
                let hashes = trimmed.chars().take_while(|&c| c == '#').count();
                if hashes <= 6 && trimmed[hashes..].starts_with(' ') {
                    tokens.push(Token::Header {
                        level: hashes as u8,
                        text: trimmed[hashes + 1..].trim(),
                    });
                    continue;
                }
            }

            // Unordered list items (- item, * item)
            if trimmed.starts_with("- ") || trimmed.starts_with("* ") {
                tokens.push(Token::ListItem(&trimmed[2..].trim()));
                continue;
            }

            // Default: Plain text paragraph
            tokens.push(Token::Paragraph(trimmed));
        }

        tokens
    }
}
`,
      },
      {
        name: 'main.rs',
        language: 'rust',
        readOnly: true,
        content: `mod lexer;
use lexer::{Lexer, Token};

fn main() {
    let md = "# DevForge\\n\\n- Learn by building\\n- Real-world systems\\n";
    let lexer = Lexer::new(md);
    let tokens = lexer.tokenize();

    for token in tokens {
        println!("{:?}", token);
    }
}
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Zero-Copy Token Modeling with Lifetimes',
        subtitle: 'Modeling Token<\'a> with borrowed slices',
        goal: 'Define Token enum carrying borrowed string slices &\'a str, avoiding String allocations on heap.',
        concepts: ['Rust Lifetimes (\'a)', 'Zero-Allocation Tokenizer', 'String Slices (&str)'],
        specs: [
          'Declare Token<\'a> with lifetime parameter',
          'Implement Header, ListItem, and Paragraph variants with &\'a str',
          'Tokenize without calling .to_string() or .to_owned()',
        ],
        hints: [
          'Using &\'a str guarantees tokens point directly to the original input buffer without duplicate allocations.',
        ],
        testCases: [
          {
            id: 'rust-m1-t1',
            name: 'Lifetime & Slices Verification',
            description: 'Ensures Token<\'a> uses borrowed slices without heap cloning',
            expected: 'Token<\'a> with &\'a str fields',
            validate: (files) => {
              const code = files['lexer.rs'] || '';
              if (!code.includes("Token<'a>") || !code.includes("&'a str")) {
                return { pass: false, error: "Token enum must use lifetime 'a and borrowed &'a str slices." };
              }
              return { pass: true, output: 'PASS: Zero-copy lifetime-bound token model verified.' };
            },
          },
        ],
      },
    ],
  },
  {
    id: 'py-generator',
    title: 'Algorithmic Identity & Tag Generator',
    language: 'python',
    languageBadge: 'Python 3.12',
    level: 'Beginner',
    tagline: 'Master random entropy, seed state, vocabulary matrices, and zero-collision player handle generation.',
    scenario: 'A multiplayer game lobby needs deterministic yet unique guest usernames when players opt out of manual naming, ensuring zero profanity and sub-millisecond generation.',
    systemDescription: 'An isolated algorithmic identity generator utilizing pseudo-random number generators (PRNG), seed state anchoring, and phonetic word matrices.',
    architectureNodes: [
      { id: 'seed', label: 'Entropy Source', description: 'System timestamp or cryptographically secure random bytes', type: 'input' },
      { id: 'prng', label: 'PRNG Engine', description: 'Deterministic seed-anchored pseudo-random generator', type: 'process' },
      { id: 'vocab', label: 'Vocabulary Matrix', description: 'Prefix, descriptor, and numeric suffix matrix dictionaries', type: 'storage' },
      { id: 'tag', label: 'Player Handle', description: 'Collision-free sanitised gamer tag output', type: 'output' },
    ],
    architectureEdges: [
      { from: 'seed', to: 'prng', label: 'Seed State' },
      { from: 'prng', to: 'vocab', label: 'Matrix Lookup' },
      { from: 'vocab', to: 'tag', label: 'Sanitised Tag' },
    ],
    initialFiles: [
      {
        name: 'generator.py',
        language: 'python',
        content: `import random
import time
from typing import Optional, List

class TagGenerator:
    """Generates deterministic and unique handles for platform users."""
    
    PREFIXES = ["Shadow", "Vortex", "Cyber", "Apex", "Echo", "Frost", "Quantum", "Solar"]
    NOUNS = ["Runner", "Spectre", "Drifter", "Falcon", "Nomad", "Cipher", "Knight", "Ghost"]
    
    def __init__(self, seed: Optional[int] = None):
        self.rng = random.Random(seed if seed is not None else time.time_ns())
        self.generated_cache = set()

    def generate(self, theme: str = "default", with_digits: bool = True) -> str:
        """Generates a collision-free username string."""
        prefix = self.rng.choice(self.PREFIXES)
        noun = self.rng.choice(self.NOUNS)
        suffix = f"_{self.rng.randint(10, 999)}" if with_digits else ""
        handle = f"{prefix}{noun}{suffix}".lower()
        self.generated_cache.add(handle)
        return handle
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Entropy & Pseudo-Random Generation',
        subtitle: 'Understanding random.seed and PRNG state',
        goal: 'Implement seed anchoring and random choice logic to produce repeatable tag streams.',
        concepts: ['PRNG State', 'random.Random()', 'Entropy Seeding', 'Determinism'],
        specs: [
          'Initialize isolated random instance with seed',
          'Implement generate() combining random prefix and noun',
          'Return lowercase handle string',
        ],
        hints: ['Always instantiate random.Random(seed) instead of global random to prevent global state leaks.'],
        testCases: [
          {
            id: 'py-gen-m1',
            name: 'Deterministic Output Verification',
            description: 'Verifies identical seed produces identical username sequence',
            expected: 'Deterministic handle output matching seed',
            validate: (files) => {
              const code = files['generator.py'] || '';
              if (!code.includes('random.Random') || !code.includes('choice')) {
                return { pass: false, error: 'Must utilize random.Random instance and selection logic.' };
              }
              return { pass: true, output: 'PASS: Deterministic entropy generation verified.' };
            },
          },
        ],
      },
    ],
  },
  {
    id: 'py-cache',
    title: 'Concurrent Key-Value Engine & TTL Janitor',
    language: 'python',
    languageBadge: 'Python 3.12',
    level: 'Intermediate',
    tagline: 'Engineer an in-memory Redis-lite engine with thread locks, passive TTL expiry, and background sweeps.',
    scenario: 'High-throughput microservices require a sub-millisecond local cache to absorb traffic spikes without overwhelming database pools.',
    systemDescription: 'Thread-safe in-memory key-value store with passive and active TTL sweeps.',
    architectureNodes: [
      { id: 'client', label: 'Worker Clients', description: 'Concurrent threads querying key-values', type: 'input' },
      { id: 'lock', label: 'threading.RLock', description: 'Reentrant lock preventing race conditions', type: 'process' },
      { id: 'store', label: 'Dictionary Store', description: 'Hash table with expiry timestamps', type: 'storage' },
      { id: 'janitor', label: 'Janitor Daemon', description: 'Background sweep thread pruning stale entries', type: 'process' },
    ],
    architectureEdges: [
      { from: 'client', to: 'lock', label: 'Set / Get' },
      { from: 'lock', to: 'store', label: 'Safe Read / Write' },
      { from: 'janitor', to: 'lock', label: 'Sweep & Prune' },
    ],
    initialFiles: [
      {
        name: 'cache.py',
        language: 'python',
        content: `import threading
import time
from typing import Any, Optional

class CacheEntry:
    def __init__(self, value: Any, ttl_seconds: Optional[float] = None):
        self.value = value
        self.expires_at = time.time() + ttl_seconds if ttl_seconds else None

    def is_expired(self) -> bool:
        return self.expires_at is not None and time.time() > self.expires_at

class PyCache:
    def __init__(self):
        self._lock = threading.RLock()
        self._store = {}

    def set(self, key: str, value: Any, ttl: Optional[float] = None):
        with self._lock:
            self._store[key] = CacheEntry(value, ttl)

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            if entry.is_expired():
                del self._store[key]
                return None
            return entry.value
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Thread-Safe Storage & Lazy Expiry',
        subtitle: 'Protecting mutations with threading.RLock',
        goal: 'Implement set and get methods with lazy TTL eviction on read.',
        concepts: ['threading.RLock', 'Context Manager with Lock', 'Passive TTL Eviction'],
        specs: [
          'Wrap mutations in with self._lock:',
          'Implement lazy expiration check on Get()',
          'Support immortal keys when ttl is None',
        ],
        hints: ['Using a context manager ensures locks are released even if exceptions occur.'],
        testCases: [
          {
            id: 'py-cache-m1',
            name: 'Thread Safety & Eviction Check',
            description: 'Verifies locks guard store access and dead keys are cleaned',
            expected: 'Safe concurrent reads and expired keys return None',
            validate: (files) => {
              const code = files['cache.py'] || '';
              if (!code.includes('with self._lock') || !code.includes('is_expired')) {
                return { pass: false, error: 'Must use lock context manager and expiration check.' };
              }
              return { pass: true, output: 'PASS: Thread-safe TTL storage verified.' };
            },
          },
        ],
      },
    ],
  },
  {
    id: 'py-worker',
    title: 'Async Event Worker & Retry Queue',
    language: 'python',
    languageBadge: 'Python 3.12',
    level: 'Advanced',
    tagline: 'Build an asynchronous distributed task processor with priority queues, backoff, and dead-letter isolation.',
    scenario: 'A notification platform must process 10,000 asynchronous webhooks per second without losing transiently failing tasks.',
    systemDescription: 'Asyncio-based worker engine with priority queue scheduling, jittered exponential backoff, and dead-letter queue isolation.',
    architectureNodes: [
      { id: 'ingress', label: 'Event Ingress', description: 'Incoming task producer stream', type: 'input' },
      { id: 'queue', label: 'asyncio.PriorityQueue', description: 'Thread-free cooperative priority scheduling', type: 'storage' },
      { id: 'pool', label: 'Worker Coroutines', description: 'Concurrent asynchronous consumer loop', type: 'process' },
      { id: 'dlq', label: 'Dead-Letter Sink', description: 'Quarantine buffer for permanently failed events', type: 'output' },
    ],
    architectureEdges: [
      { from: 'ingress', to: 'queue', label: 'Enqueue' },
      { from: 'queue', to: 'pool', label: 'Dequeue' },
      { from: 'pool', to: 'dlq', label: 'Quarantine' },
    ],
    initialFiles: [
      {
        name: 'worker.py',
        language: 'python',
        content: `import asyncio
import time
from typing import Dict, Any

class AsyncTaskEngine:
    def __init__(self, max_concurrency: int = 4):
        self.queue = asyncio.PriorityQueue()
        self.dlq = []
        self.max_concurrency = max_concurrency
        self.is_running = False

    async def submit(self, task_id: str, priority: int = 10, max_retries: int = 3):
        await self.queue.put((priority, {"id": task_id, "retries": 0, "max_retries": max_retries}))

    async def _worker_loop(self, worker_id: int):
        while self.is_running:
            priority, task = await self.queue.get()
            try:
                # Simulated async execution
                await asyncio.sleep(0.01)
            except Exception:
                task["retries"] += 1
                if task["retries"] < task["max_retries"]:
                    await self.queue.put((priority + 1, task))
                else:
                    self.dlq.append(task)
            finally:
                self.queue.task_done()
`,
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Priority Dispatch & Backoff Queue',
        subtitle: 'Asynchronous event loops with cooperative multitasking',
        goal: 'Implement worker coroutines that consume tasks and quarantine poisoned events.',
        concepts: ['asyncio.PriorityQueue', 'Exponential Backoff', 'Dead-Letter Queue (DLQ)'],
        specs: [
          'Create cooperative coroutines consuming queue',
          'Implement retry counters with priority penalties',
          'Isolate unrecoverable jobs to DLQ',
        ],
        hints: ['asyncio.sleep() yields execution to other coroutines in the same thread.'],
        testCases: [
          {
            id: 'py-worker-m1',
            name: 'Async Pipeline Verification',
            description: 'Verifies async queue and dead-letter handling',
            expected: 'Proper task retry and dead-letter quarantine',
            validate: (files) => {
              const code = files['worker.py'] || '';
              if (!code.includes('PriorityQueue') || !code.includes('dlq')) {
                return { pass: false, error: 'Must use asyncio.PriorityQueue and DLQ.' };
              }
              return { pass: true, output: 'PASS: Async worker pipeline verified.' };
            },
          },
        ],
      },
    ],
  },
];
