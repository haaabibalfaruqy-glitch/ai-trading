/**
 * Events & Funnel Tracking System
 * Type-safe event handling with state synchronization
 */

import { featureStateManager } from "./featureStateManager";

/* ============================================================
   TYPES & INTERFACES
============================================================ */

export type EventType =
  // STEP 1–2
  | "page_view"
  | "cta_click"
  | "cta_click_hero"
  | "cta_click_final"
  | "module_view"
  | "homepage_viewed"
  | "feature_explorer_opened"
  // EXIT / TRUST
  | "exit_intent"
  | "exit_recover"
  | "exit_dismiss"
  | "trust_pulse"
  // STEP 3
  | "execution_gate_view"
  | "execution_gate_click"
  | "execution_unlocked"
  | "execution_blocked"
  | "premium_cta_click"
  // STEP 4
  | "affiliate_redirect"
  | "return_from_broker"
  | "premium_trial_expired"
  | "premium_returning_user"
  | "premium_slots_exhausted"
  // STEP 6 — RESURRECTION
  | "user_resurrected"
  | "resurrection_cta_click"
  // STEP 7 — INSIGHT / VIRAL
  | "insight_generated"
  | "insight_viewed"
  | "insight_shared"
  | "viral_insight_generated"
  // DASHBOARD INTERACTIONS
  | "card_reordered"
  | "card_order_reset"
  // FEATURE UNLOCK EVENTS
  | "feature_unlock_requested"
  | "feature_unlock_success"
  | "feature_unlock_failed"
  | "unlock_requested"
  | "unlock_success"
  | "unlock_failed"
  | "lock"
  | "expired"
  | "feature_lock"
  | "feature_expired";

export interface EventPayload {
  type: EventType;
  meta?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface FunnelState {
  sawChart: boolean;
  clickedSoftCTA: boolean;
  gateViewed: boolean;
  gateClicked: boolean;
  executionUnlocked: boolean;
  redirectedToBroker: boolean;
  featureUnlocksCount: number;
  lastEventType?: EventType;
  lastEventTime?: number;
}

export interface EventListener {
  (event: EventPayload): void;
}

/* ============================================================
   STORAGE KEYS
============================================================ */

const FUNNEL_KEY = "ai_funnel_state";
const SESSION_KEY = "session_id";
const EVENT_QUEUE_KEY = "event_queue";

/* ============================================================
   SESSION MANAGEMENT
============================================================ */

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/* ============================================================
   STORAGE FUNCTIONS
============================================================ */

function loadFunnel(): FunnelState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FUNNEL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveFunnel(state: FunnelState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FUNNEL_KEY, JSON.stringify(state));
  } catch {
    console.warn("[Events] Failed to save funnel state");
  }
}

function loadEventQueue(): EventPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(EVENT_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEventQueue(queue: EventPayload[]): void {
  if (typeof window === "undefined") return;
  try {
    // Only keep last 100 events
    const limited = queue.slice(-100);
    sessionStorage.setItem(EVENT_QUEUE_KEY, JSON.stringify(limited));
  } catch {
    console.warn("[Events] Failed to save event queue");
  }
}

/* ============================================================
   GLOBAL STATE
============================================================ */

let funnelState: FunnelState = {
  sawChart: false,
  clickedSoftCTA: false,
  gateViewed: false,
  gateClicked: false,
  executionUnlocked: false,
  redirectedToBroker: false,
  featureUnlocksCount: 0,
};

const eventQueue: EventPayload[] = loadEventQueue();
const funnelListeners = new Set<EventListener>();
const eventListeners = new Set<EventListener>();

/* ============================================================
   EVENT TRACKING (TYPE-SAFE)
============================================================ */

/**
 * Track an event with type checking and automatic state sync
 */
export function trackEvent(
  type: EventType,
  meta?: Record<string, any>
): EventPayload {
  if (typeof window === "undefined") {
    return {
      type,
      meta,
      timestamp: Date.now(),
      sessionId: "",
    };
  }

  const event: EventPayload = {
    type,
    meta,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  eventQueue.push(event);
  saveEventQueue(eventQueue);

  // Update funnel state
  updateFunnel(type, meta);

  // Notify listeners
  notifyEventListeners(event);

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("[EVENT]", {
      type,
      meta,
      sessionId: event.sessionId,
    });
  }

  return event;
}

/**
 * Track event with feature unlock sync
 */
export function trackFeatureEvent(
  type: "unlock_requested" | "unlock_success" | "unlock_failed" | "lock" | "expired",
  featureName: string,
  meta?: Record<string, any>
): EventPayload {
  const eventTypeMap = {
    unlock_requested: "feature_unlock_requested" as const,
    unlock_success: "feature_unlock_success" as const,
    unlock_failed: "feature_unlock_failed" as const,
    lock: "feature_lock" as const,
    expired: "feature_expired" as const,
  };

  return trackEvent(eventTypeMap[type], {
    feature: featureName,
    ...meta,
  });
}

/* ============================================================
   FUNNEL STATE MANAGEMENT
============================================================ */

/**
 * Update funnel state based on event
 */
export function updateFunnel(
  type: EventType,
  meta?: Record<string, any>
): void {
  const previousState = { ...funnelState };

  // Update based on event type
  if (type === "module_view") {
    funnelState.sawChart = true;
  }

  if (type === "cta_click" && (meta?.tier === "soft" || meta?.tier === "hard")) {
    funnelState.clickedSoftCTA = true;
  }

  if (type === "affiliate_redirect") {
    funnelState.redirectedToBroker = true;
  }

  if (type === "execution_gate_view") {
    funnelState.gateViewed = true;
  }

  if (type === "execution_gate_click") {
    funnelState.gateClicked = true;
  }

  if (type === "execution_unlocked") {
    funnelState.executionUnlocked = true;
  }

  if (type === "feature_unlock_success") {
    funnelState.featureUnlocksCount++;
  }

  // Update last event tracking
  funnelState.lastEventType = type;
  funnelState.lastEventTime = Date.now();

  // Save only if changed
  if (JSON.stringify(previousState) !== JSON.stringify(funnelState)) {
    saveFunnel(funnelState);
    notifyFunnelListeners();
  }
}

/**
 * Initialize funnel state from storage
 */
export function initializeFunnelState(): void {
  const stored = loadFunnel();
  if (stored) {
    funnelState = stored;
  }
}

/**
 * Get current funnel state (copy)
 */
export function getFunnelState(): FunnelState {
  return { ...funnelState };
}

/**
 * Reset funnel state
 */
export function resetFunnelState(): void {
  funnelState = {
    sawChart: false,
    clickedSoftCTA: false,
    gateViewed: false,
    gateClicked: false,
    executionUnlocked: false,
    redirectedToBroker: false,
    featureUnlocksCount: 0,
  };
  saveFunnel(funnelState);
  notifyFunnelListeners();
}

/* ============================================================
   EVENT LISTENERS & SUBSCRIPTIONS
============================================================ */

/**
 * Subscribe to any event
 */
export function subscribeToEvents(listener: EventListener): () => void {
  eventListeners.add(listener);
  return () => eventListeners.delete(listener);
}

/**
 * Subscribe to funnel state changes
 */
export function subscribeFunnel(listener: EventListener): () => void {
  funnelListeners.add(listener);
  return () => funnelListeners.delete(listener);
}

/**
 * Notify event listeners
 */
function notifyEventListeners(event: EventPayload): void {
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.error("[Events] Listener error:", error);
    }
  });
}

/**
 * Notify funnel listeners
 */
function notifyFunnelListeners(): void {
  funnelListeners.forEach((listener) => {
    try {
      listener({
        type: "trust_pulse",
        timestamp: Date.now(),
        sessionId: getSessionId(),
        meta: funnelState,
      });
    } catch (error) {
      console.error("[Events] Funnel listener error:", error);
    }
  });
}

/* ============================================================
   EVENT QUEUE & HISTORY
============================================================ */

/**
 * Get all tracked events
 */
export function getEvents(): EventPayload[] {
  return [...eventQueue];
}

/**
 * Get events of specific type
 */
export function getEventsByType(type: EventType): EventPayload[] {
  return eventQueue.filter((e) => e.type === type);
}

/**
 * Get events in time range
 */
export function getEventsByTimeRange(
  startTime: number,
  endTime: number
): EventPayload[] {
  return eventQueue.filter(
    (e) => e.timestamp >= startTime && e.timestamp <= endTime
  );
}

/**
 * Clear event history
 */
export function clearEventHistory(): void {
  eventQueue.length = 0;
  saveEventQueue(eventQueue);
}

/* ============================================================
   ANALYTICS & STATISTICS
============================================================ */

/**
 * Get session statistics
 */
export function getSessionStats() {
  const sessionId = getSessionId();
  const sessionEvents = eventQueue.length;

  return {
    sessionId,
    eventCount: sessionEvents,
    funnel: getFunnelState(),
    startTime: eventQueue[0]?.timestamp,
    endTime: eventQueue[eventQueue.length - 1]?.timestamp,
    duration: eventQueue[eventQueue.length - 1]
      ? eventQueue[eventQueue.length - 1].timestamp - (eventQueue[0]?.timestamp || 0)
      : 0,
  };
}

/**
 * Get event type distribution
 */
export function getEventDistribution(): Record<EventType, number> {
  const distribution: Record<EventType, number> = {} as any;

  eventQueue.forEach((event) => {
    distribution[event.type] = (distribution[event.type] || 0) + 1;
  });

  return distribution;
}

/* ============================================================
   STATE SYNC WITH FEATURES
============================================================ */

/**
 * Sync event state with feature manager
 */
export function syncFeatureStateFromEvents(): void {
  // Count feature unlocks from events
  const unlocks = getEventsByType("feature_unlock_success").length;

  // Update funnel
  funnelState.featureUnlocksCount = unlocks;
  saveFunnel(funnelState);
}

/**
 * Debug: Print all events
 */
export function debugEvents(): void {
  console.group("[Events Debug]");
  console.log("Session:", getSessionStats());
  console.log("Events:", eventQueue);
  console.log("Distribution:", getEventDistribution());
  console.groupEnd();
}