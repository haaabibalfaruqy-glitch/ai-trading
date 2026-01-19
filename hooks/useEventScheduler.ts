"use client";

/**
 * useEventScheduler Hook
 * Combines event tracking and scheduling for components
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { scheduler, createMarketFetchTask, createAIPredictionTask } from "@/lib/scheduler";
import { featureStateManager, FeatureName } from "@/lib/featureStateManager";
import { trackEvent, EventType, trackFeatureEvent, subscribeFunnel } from "@/lib/events";

interface UseEventSchedulerOptions {
  onFeatureUnlock?: (feature: FeatureName) => void;
  onFeatureLock?: (feature: FeatureName) => void;
  enableAutoCleanup?: boolean;
  debug?: boolean;
}

interface ScheduledEventConfig {
  eventType: EventType;
  intervalMs: number;
  maxRuns?: number;
  priority?: "high" | "normal" | "low";
}

interface UseEventSchedulerReturn {
  // Event tracking
  trackEvent: (type: EventType, meta?: Record<string, any>) => void;
  trackFeatureUnlock: (feature: FeatureName) => Promise<void>;
  trackFeatureLock: (feature: FeatureName) => void;

  // Scheduling
  scheduleEvent: (config: ScheduledEventConfig) => string;
  scheduleMarketFetch: (symbol: string, intervalMs?: number) => string;
  scheduleAIPrediction: (symbol: string, intervalMs?: number) => string;

  // Feature management
  unlockFeature: (feature: FeatureName) => Promise<boolean>;
  isFeatureUnlocked: (feature: FeatureName) => boolean;
  canUnlockFeature: (feature: FeatureName) => boolean;

  // Task management
  pauseTask: (taskId: string) => boolean;
  resumeTask: (taskId: string) => boolean;
  cancelTask: (taskId: string) => boolean;
  getAllTasks: () => any[];

  // Cleanup
  cleanup: () => void;
}

/**
 * Hook for event tracking and scheduling
 */
export function useEventScheduler(
  options: UseEventSchedulerOptions = {}
): UseEventSchedulerReturn {
  const {
    onFeatureUnlock,
    onFeatureLock,
    enableAutoCleanup = true,
    debug = false,
  } = options;

  const taskIdsRef = useRef<Set<string>>(new Set());
  const unsubscribersRef = useRef<Array<() => void>>([]);
  const [metrics, setMetrics] = useState<any>(null);

  // Initialize cleanup
  useEffect(() => {
    if (enableAutoCleanup) {
      scheduler.enableAutoCleanup(300000); // 5 minutes
    }

    // Subscribe to feature changes
    const unsubscribe = featureStateManager.onAnyChange((feature) => {
      const state = featureStateManager.getFeature(feature);

      if (state.status === "unlocked" && onFeatureUnlock) {
        onFeatureUnlock(feature);
        trackFeatureEvent("unlock_success", feature);
      }

      if (state.status === "locked" && onFeatureLock) {
        onFeatureLock(feature);
      }
    });

    unsubscribersRef.current.push(unsubscribe);

    // Subscribe to funnel changes
    const unsubscribeFunnel = subscribeFunnel(() => {
      if (debug) {
        setMetrics({
          tasks: scheduler.getMetrics(),
          features: featureStateManager.getStats(),
        });
      }
    });

    unsubscribersRef.current.push(unsubscribeFunnel);

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
    };
  }, [onFeatureUnlock, onFeatureLock, enableAutoCleanup, debug]);

  // Track event wrapper
  const trackEventWrapper = useCallback(
    (type: EventType, meta?: Record<string, any>) => {
      trackEvent(type, meta);
    },
    []
  );

  // Track feature unlock
  const trackFeatureUnlock = useCallback(
    async (feature: FeatureName) => {
      try {
        const response = await featureStateManager.unlockFeature({
          feature,
          accessLevel: "broker_connected",
        });

        if (response.success) {
          trackFeatureEvent("unlock_success", feature);
        } else {
          trackFeatureEvent("unlock_failed", feature, {
            reason: response.message,
          });
        }
      } catch (error) {
        trackFeatureEvent("unlock_failed", feature, {
          error: String(error),
        });
      }
    },
    []
  );

  // Track feature lock
  const trackFeatureLock = useCallback((feature: FeatureName) => {
    featureStateManager.lockFeature(feature);
    trackFeatureEvent("lock", feature);
  }, []);

  // Schedule periodic event
  const scheduleEvent = useCallback((config: ScheduledEventConfig): string => {
    const taskId = scheduler.register(
      () => {
        trackEvent(config.eventType);
      },
      config.intervalMs,
      {
        id: `event_${config.eventType}_${Date.now()}`,
        priority: config.priority,
        maxRuns: config.maxRuns,
      }
    );

    taskIdsRef.current.add(taskId);
    return taskId;
  }, []);

  // Schedule market fetch
  const scheduleMarketFetch = useCallback(
    (symbol: string, intervalMs: number = 5000): string => {
      const taskId = createMarketFetchTask(
        symbol,
        (data) => {
          trackEvent("module_view", { symbol, dataPoints: data.length });
        },
        intervalMs
      );

      taskIdsRef.current.add(taskId);
      return taskId;
    },
    []
  );

  // Schedule AI prediction
  const scheduleAIPrediction = useCallback(
    (symbol: string, intervalMs: number = 10000): string => {
      const taskId = createAIPredictionTask(
        symbol,
        (prediction) => {
          trackEvent("insight_generated", {
            symbol,
            signal: prediction.signal,
          });
        },
        intervalMs
      );

      taskIdsRef.current.add(taskId);
      return taskId;
    },
    []
  );

  // Unlock feature
  const unlockFeature = useCallback(async (feature: FeatureName) => {
    try {
      const response = await featureStateManager.unlockFeature({
        feature,
        accessLevel: "broker_connected",
      });
      return response.success;
    } catch {
      return false;
    }
  }, []);

  // Check if feature is unlocked
  const isFeatureUnlocked = useCallback((feature: FeatureName): boolean => {
    return featureStateManager.isUnlocked(feature);
  }, []);

  // Check if feature can be unlocked
  const canUnlockFeature = useCallback((feature: FeatureName): boolean => {
    return featureStateManager.canUnlock(feature);
  }, []);

  // Pause task
  const pauseTask = useCallback((taskId: string): boolean => {
    return scheduler.pause(taskId);
  }, []);

  // Resume task
  const resumeTask = useCallback((taskId: string): boolean => {
    return scheduler.resume(taskId);
  }, []);

  // Cancel task
  const cancelTask = useCallback((taskId: string): boolean => {
    if (scheduler.clear(taskId)) {
      taskIdsRef.current.delete(taskId);
      return true;
    }
    return false;
  }, []);

  // Get all active tasks
  const getAllTasks = useCallback(() => {
    return scheduler.getAllTasks();
  }, []);

  // Cleanup hook
  const cleanup = useCallback(() => {
    // Clear all tasks registered by this hook
    taskIdsRef.current.forEach((taskId) => {
      scheduler.clear(taskId);
    });
    taskIdsRef.current.clear();

    // Unsubscribe from listeners
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];
  }, []);

  // Auto cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    trackEvent: trackEventWrapper,
    trackFeatureUnlock,
    trackFeatureLock,
    scheduleEvent,
    scheduleMarketFetch,
    scheduleAIPrediction,
    unlockFeature,
    isFeatureUnlocked,
    canUnlockFeature,
    pauseTask,
    resumeTask,
    cancelTask,
    getAllTasks,
    cleanup,
  };
}

/**
 * Hook for monitoring scheduler health
 */
export function useSchedulerHealth() {
  const [health, setHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const taskId = scheduler.register(
      () => {
        setHealth(scheduler.healthCheck());
        setMetrics(scheduler.getMetrics());
      },
      5000, // Check every 5 seconds
      { id: "__health_check__", priority: "low" }
    );

    return () => {
      scheduler.clear(taskId);
    };
  }, []);

  return { health, metrics };
}

/**
 * Hook for monitoring feature state
 */
export function useFeatureState(feature: FeatureName) {
  const [state, setState] = useState(() => featureStateManager.getFeature(feature));

  useEffect(() => {
    const unsubscribe = featureStateManager.subscribe(feature, (newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [feature]);

  return state;
}

/**
 * Hook for feature unlock with toast/callback
 */
export function useFeatureUnlock(
  onSuccess?: (feature: FeatureName) => void,
  onError?: (feature: FeatureName, error: string) => void
) {
  const unlockFeature = useCallback(
    async (feature: FeatureName, accessLevel: "broker_connected" | "premium" = "broker_connected") => {
      try {
        const response = await featureStateManager.unlockFeature({
          feature,
          accessLevel,
        });

        if (response.success) {
          onSuccess?.(feature);
          trackFeatureEvent("unlock_success", feature);
          return true;
        } else {
          onError?.(feature, response.message || "Unknown error");
          trackFeatureEvent("unlock_failed", feature);
          return false;
        }
      } catch (error) {
        onError?.(feature, String(error));
        return false;
      }
    },
    [onSuccess, onError]
  );

  return { unlockFeature };
}

export default useEventScheduler;
