/**
 * Advanced Interval Scheduler
 * Handles periodic AI computations, market updates, and memory cleanup
 */

type IntervalID = number;
type ScheduledTask = () => void | Promise<void>;

interface TaskConfig {
  id: string;
  fn: ScheduledTask;
  delay: number;
  priority?: "high" | "normal" | "low";
  maxRuns?: number; // undefined = infinite
  lastRun?: number;
  runs: number;
  active: boolean;
}

/* ============================================================
   PERFORMANCE MONITORING
============================================================ */

interface PerformanceMetrics {
  totalTasks: number;
  activeTasks: number;
  totalRuns: number;
  memoryUsage: number;
  lastCleanup: number;
  avgExecutionTime: number;
}

/* ============================================================
   INTERVAL SCHEDULER CLASS
============================================================ */

class AdvancedScheduler {
  private intervals = new Map<IntervalID, TaskConfig>();
  private taskMap = new Map<string, TaskConfig>();
  private nextTaskId = 1;
  private performanceMetrics: PerformanceMetrics = {
    totalTasks: 0,
    activeTasks: 0,
    totalRuns: 0,
    memoryUsage: 0,
    lastCleanup: Date.now(),
    avgExecutionTime: 0,
  };
  private executionTimes: number[] = [];

  /**
   * Register a task with automatic cleanup on max runs
   */
  register(
    fn: ScheduledTask,
    delay: number,
    config?: { id?: string; priority?: "high" | "normal" | "low"; maxRuns?: number }
  ): string {
    const taskId = config?.id || `task_${this.nextTaskId++}`;

    const task: TaskConfig = {
      id: taskId,
      fn,
      delay,
      priority: config?.priority || "normal",
      maxRuns: config?.maxRuns,
      runs: 0,
      active: true,
    };

    // Create interval
    const intervalId = window.setInterval(async () => {
      if (!task.active) return;

      try {
        const startTime = performance.now();
        await task.fn();
        const executionTime = performance.now() - startTime;

        // Track execution time for metrics
        this.executionTimes.push(executionTime);
        if (this.executionTimes.length > 100) this.executionTimes.shift();

        task.lastRun = Date.now();
        task.runs++;
        this.performanceMetrics.totalRuns++;

        // Auto-cleanup on max runs
        if (task.maxRuns && task.runs >= task.maxRuns) {
          this.clear(taskId);
        }
      } catch (error) {
        console.error(`[Scheduler Error] Task ${taskId}:`, error);
      }
    }, delay);

    // Store references
    this.intervals.set(intervalId, task);
    this.taskMap.set(taskId, task);
    this.performanceMetrics.totalTasks++;
    this.performanceMetrics.activeTasks++;

    return taskId;
  }

  /**
   * Pause a task without removing it
   */
  pause(taskId: string): boolean {
    const task = this.taskMap.get(taskId);
    if (!task) return false;
    task.active = false;
    this.performanceMetrics.activeTasks--;
    return true;
  }

  /**
   * Resume a paused task
   */
  resume(taskId: string): boolean {
    const task = this.taskMap.get(taskId);
    if (!task) return false;
    task.active = true;
    this.performanceMetrics.activeTasks++;
    return true;
  }

  /**
   * Clear a specific task
   */
  clear(taskId: string): boolean {
    const task = this.taskMap.get(taskId);
    if (!task) return false;

    // Find and clear interval
    for (const [intervalId, t] of this.intervals) {
      if (t.id === taskId) {
        clearInterval(intervalId);
        this.intervals.delete(intervalId);
        break;
      }
    }

    this.taskMap.delete(taskId);
    if (task.active) this.performanceMetrics.activeTasks--;
    this.performanceMetrics.totalTasks--;

    return true;
  }

  /**
   * Clear all tasks (full cleanup)
   */
  clearAll(): void {
    this.intervals.forEach((_, intervalId) => clearInterval(intervalId));
    this.intervals.clear();
    this.taskMap.clear();
    this.performanceMetrics = {
      totalTasks: 0,
      activeTasks: 0,
      totalRuns: 0,
      memoryUsage: 0,
      lastCleanup: Date.now(),
      avgExecutionTime: 0,
    };
    this.executionTimes = [];
  }

  /**
   * Pause all tasks temporarily
   */
  pauseAll(): void {
    this.taskMap.forEach((task) => {
      task.active = false;
    });
    this.performanceMetrics.activeTasks = 0;
  }

  /**
   * Resume all paused tasks
   */
  resumeAll(): void {
    this.taskMap.forEach((task) => {
      task.active = true;
    });
    this.performanceMetrics.activeTasks = this.performanceMetrics.totalTasks;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): TaskConfig | undefined {
    return this.taskMap.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): TaskConfig[] {
    return Array.from(this.taskMap.values());
  }

  /**
   * Memory cleanup - remove completed/inactive tasks
   */
  memoryCleanup(): void {
    const now = Date.now();
    const completedTasks: string[] = [];

    this.taskMap.forEach((task, taskId) => {
      // Remove tasks that completed
      if (task.maxRuns && task.runs >= task.maxRuns) {
        completedTasks.push(taskId);
      }

      // Remove tasks inactive for >5 minutes
      if (!task.active && task.lastRun && now - task.lastRun > 300000) {
        completedTasks.push(taskId);
      }
    });

    completedTasks.forEach((taskId) => this.clear(taskId));

    this.performanceMetrics.lastCleanup = now;
    this.performanceMetrics.memoryUsage =
      ((performance as any).memory?.usedJSHeapSize || 0) / 1048576; // MB
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      ...this.performanceMetrics,
      avgExecutionTime: this.executionTimes.length
        ? this.executionTimes.reduce((a, b) => a + b, 0) / this.executionTimes.length
        : 0,
    };
  }

  /**
   * Get detailed task statistics
   */
  getTaskStats(taskId: string) {
    const task = this.taskMap.get(taskId);
    if (!task) return null;

    return {
      id: task.id,
      runs: task.runs,
      maxRuns: task.maxRuns,
      active: task.active,
      delay: task.delay,
      priority: task.priority,
      lastRun: task.lastRun ? new Date(task.lastRun).toISOString() : null,
      progress: task.maxRuns ? `${task.runs}/${task.maxRuns}` : "∞",
    };
  }

  /**
   * Periodic memory cleanup (call once on app init)
   */
  enableAutoCleanup(intervalMs: number = 300000): string {
    return this.register(
      () => this.memoryCleanup(),
      intervalMs,
      { id: "__auto_cleanup__", priority: "high" }
    );
  }

  /**
   * Health check
   */
  healthCheck(): {
    healthy: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (this.performanceMetrics.activeTasks === 0 && this.performanceMetrics.totalTasks > 0) {
      issues.push("No active tasks but tasks registered");
    }

    if (this.performanceMetrics.memoryUsage > 500) {
      issues.push("High memory usage");
    }

    return {
      healthy: issues.length === 0,
      issues,
    };
  }
}

/* ============================================================
   SINGLETON INSTANCE
============================================================ */

export const scheduler = new AdvancedScheduler();

/* ============================================================
   PRESET TASK FACTORIES
============================================================ */

/**
 * Create a market data fetch task
 */
export function createMarketFetchTask(
  symbol: string,
  onData: (data: any) => void,
  intervalMs: number = 5000
): string {
  return scheduler.register(
    async () => {
      try {
        const response = await fetch(`/api/market/${symbol}`);
        const data = await response.json();
        onData(data);
      } catch (error) {
        console.error(`Failed to fetch market data for ${symbol}:`, error);
      }
    },
    intervalMs,
    { id: `market_${symbol}`, priority: "high" }
  );
}

/**
 * Create an AI prediction update task
 */
export function createAIPredictionTask(
  symbol: string,
  onPrediction: (prediction: any) => void,
  intervalMs: number = 10000
): string {
  return scheduler.register(
    async () => {
      try {
        const response = await fetch(`/api/predict/${symbol}`);
        const prediction = await response.json();
        onPrediction(prediction);
      } catch (error) {
        console.error(`Failed to generate prediction for ${symbol}:`, error);
      }
    },
    intervalMs,
    { id: `predict_${symbol}`, priority: "normal" }
  );
}

/**
 * Create a periodic state sync task
 */
export function createStateSyncTask(
  onSync: () => void,
  intervalMs: number = 30000
): string {
  return scheduler.register(() => onSync(), intervalMs, {
    id: "state_sync",
    priority: "normal",
  });
}
