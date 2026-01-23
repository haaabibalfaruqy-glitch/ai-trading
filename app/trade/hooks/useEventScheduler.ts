"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  scheduler,
  createMarketFetchTask,
  createAIPredictionTask,
} from "@/lib/scheduler";
import {
  featureStateManager,
  FeatureName,
} from "@/lib/featureStateManager";
import {
  trackEvent,
  EventType,
  trackFeatureEvent,
  subscribeFunnel,
} from "@/lib/events";

/* ================================
   TYPES
================================ */

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
  // analytics
  trackEvent: (type: EventType, meta?: Record<string, any>) => void;

  // feature
  unlockFeature: (
    feature: FeatureName,
    accessLevel: "broker_connected" | "premium"
  ) => Promise<boolean>;
  isFeatureUnlocked: (feature: FeatureName) => boolean;
  canUnlockFeature: (feature: FeatureName) => boolean;

  // scheduling
  scheduleEvent: (config: ScheduledEventConfig) => string;
  scheduleMarketFetch: (symbol: string, intervalMs?: number) => string;
  scheduleAIPrediction: (symbol: string, intervalMs?: number) => string;

  // task control
  pauseTask: (taskId: string) => boolean;
  resumeTask: (taskId: string) => boolean;
  cancelTask: (taskId: string) => boolean;
  getAllTasks: () => any[];

  // debug
  metrics: any;

  // cleanup
  cleanup: () => void;
}

/* ================================
   MAIN HOOK
================================ */

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

  /* ================================
     INIT
  ================================ */

  useEffect(() => {
    if (enableAutoCleanup) {
      scheduler.enableAutoCleanup(5 * 60_000);
    }

    const unsubscribeFeature = featureStateManager.onAnyChange(
      (feature) => {
        const state = featureStateManager.getFeature(feature);

        if (state.status === "unlocked") {
          onFeatureUnlock?.(feature);
        }

        if (state.status === "locked") {
          onFeatureLock?.(feature);
        }
      }
    );

    const unsubscribeFunnel = subscribeFunnel(() => {
      if (debug) {
        setMetrics({
          scheduler: scheduler.getMetrics(),
          features: featureStateManager.getStats(),
        });
      }
    });

    unsubscribersRef.current.push(unsubscribeFeature, unsubscribeFunnel);

    return () => {
      unsubscribersRef.current.forEach((u) => u());
      unsubscribersRef.current = [];
    };
  }, [onFeatureUnlock, onFeatureLock, enableAutoCleanup, debug]);

  /* ================================
     ANALYTICS
  ================================ */

  const trackEventWrapper = useCallback(
    (type: EventType, meta?: Record<string, any>) => {
      trackEvent(type, meta);
    },
    []
  );

  /* ================================
     FEATURE CONTROL (SINGLE AUTHORITY)
  ================================ */

  const unlockFeature = useCallback(
    async (
      feature: FeatureName,
      accessLevel: "broker_connected" | "premium"
    ): Promise<boolean> => {
      try {
        const result = await featureStateManager.unlockFeature({
          feature,
          accessLevel,
        });

        if (result.success) {
          trackFeatureEvent("unlock_success", feature);
          return true;
        }

        trackFeatureEvent("unlock_failed", feature, {
          reason: result.message,
        });
        return false;
      } catch (err) {
        trackFeatureEvent("unlock_failed", feature, {
          error: String(err),
        });
        return false;
      }
    },
    []
  );

  const isFeatureUnlocked = useCallback(
    (feature: FeatureName) =>
      featureStateManager.isUnlocked(feature),
    []
  );

  const canUnlockFeature = useCallback(
    (feature: FeatureName) =>
      featureStateManager.canUnlock(feature),
    []
  );

  /* ================================
     SCHEDULING
  ================================ */

  const scheduleEvent = useCallback(
    (config: ScheduledEventConfig): string => {
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
    },
    []
  );

  const scheduleMarketFetch = useCallback(
    (symbol: string, intervalMs: number = 5000): string => {
      const taskId = createMarketFetchTask(
        symbol,
        (data) => {
          trackEvent("module_view", {
            symbol,
            points: data.length,
          });
        },
        intervalMs
      );

      taskIdsRef.current.add(taskId);
      return taskId;
    },
    []
  );

  const scheduleAIPrediction = useCallback(
    (symbol: string, intervalMs: number = 10_000): string => {
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

  /* ================================
     TASK CONTROL
  ================================ */

  const pauseTask = useCallback(
    (taskId: string) => scheduler.pause(taskId),
    []
  );

  const resumeTask = useCallback(
    (taskId: string) => scheduler.resume(taskId),
    []
  );

  const cancelTask = useCallback((taskId: string) => {
    if (scheduler.clear(taskId)) {
      taskIdsRef.current.delete(taskId);
      return true;
    }
    return false;
  }, []);

  const getAllTasks = useCallback(
    () => scheduler.getAllTasks(),
    []
  );

  /* ================================
     CLEANUP
  ================================ */

  const cleanup = useCallback(() => {
    taskIdsRef.current.forEach((id) => scheduler.clear(id));
    taskIdsRef.current.clear();

    unsubscribersRef.current.forEach((u) => u());
    unsubscribersRef.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  /* ================================
     RETURN
  ================================ */

  return {
    trackEvent: trackEventWrapper,

    unlockFeature,
    isFeatureUnlocked,
    canUnlockFeature,

    scheduleEvent,
    scheduleMarketFetch,
    scheduleAIPrediction,

    pauseTask,
    resumeTask,
    cancelTask,
    getAllTasks,

    metrics,
    cleanup,
  };
}

/* ================================
   HEALTH HOOK
================================ */

export function useSchedulerHealth() {
  const [health, setHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const taskId = scheduler.register(
      () => {
        setHealth(scheduler.healthCheck());
        setMetrics(scheduler.getMetrics());
      },
      5000,
      { id: "__scheduler_health__", priority: "low" }
    );

    return () => {
      scheduler.clear(taskId);
    };
  }, []);

  return { health, metrics };
}

/* ================================
   FEATURE STATE HOOK
================================ */

export function useFeatureState(feature: FeatureName) {
  const [state, setState] = useState(() =>
    featureStateManager.getFeature(feature)
  );

  useEffect(() => {
    return featureStateManager.subscribe(feature, setState);
  }, [feature]);

  return state;
}
