// C:\ai_trading\lib\events.ts

import { featureStateManager } from "./featureStateManager";

/* ============================================================
    TYPES & ENUMERATIONS
============================================================ */
export type EventType =
  | "page_view" | "cta_click" | "cta_click_hero" | "module_view"
  | "execution_gate_view" | "execution_gate_click" | "execution_unlocked"
  | "execution_blocked" | "premium_cta_click" | "feature_unlock_requested"
  | "feature_unlock_success" | "feature_unlock_failed" | "feature_lock"
  | "market_chart_view" | "insight_generated" | "insight_shared"
  | "exit_intent" | "trust_pulse" | "user_resurrected" | "feature_usage"
  | "feature_explorer_opened" | "homepage_viewed"
  | (string & {}); 

export interface EventPayload {
  type: EventType;
  meta?: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

export interface FunnelState {
  sawChart: boolean;
  clickedSoftCTA: boolean;
  gateViewed: boolean;
  executionUnlocked: boolean;
  featureUnlocksCount: number;
  lastEventType?: EventType;
}

/* ============================================================
    STATE & SESSION
============================================================ */
const FUNNEL_KEY = "omega_funnel_v2";
const SESSION_KEY = "omega_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `neural_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

let funnelState: FunnelState = {
  sawChart: false,
  clickedSoftCTA: false,
  gateViewed: false,
  executionUnlocked: false,
  featureUnlocksCount: 0,
};

const eventListeners = new Set<(ev: EventPayload) => void>();
const funnelListeners = new Set<(state: FunnelState) => void>();

/* ============================================================
    CORE TRACKING ENGINE
============================================================ */

export function trackEvent(type: EventType, meta?: Record<string, any>): EventPayload {
  const event: EventPayload = {
    type,
    meta,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  if (typeof window !== "undefined") {
    updateFunnelLogic(type, meta);
    saveToStorage(event);
    eventListeners.forEach(listener => listener(event));

    if (process.env.NODE_ENV === "development") {
      console.log(`%c[EVENT: ${type}]`, "color: #10b981; font-weight: bold", meta);
    }
  }

  return event;
}

export function trackFeatureEvent(featureName: string, action: string, meta?: any) {
  return trackEvent("feature_usage", {
    feature: featureName,
    action: action,
    ...meta
  });
}

/* ============================================================
    FIX: FUNNEL SUBSCRIPTION (Dibutuhkan oleh useEventScheduler)
============================================================ */

/**
 * Berlangganan pada perubahan state funnel secara real-time.
 */
export function subscribeFunnel(callback: (state: FunnelState) => void) {
  funnelListeners.add(callback);
  // Kirim state saat ini segera setelah berlangganan
  callback(getFunnelAnalytics());
  return () => funnelListeners.delete(callback);
}

/* ============================================================
    FUNNEL LOGIC
============================================================ */

function updateFunnelLogic(type: EventType, meta?: Record<string, any>) {
  funnelState.lastEventType = type;

  switch (type) {
    case "market_chart_view": funnelState.sawChart = true; break;
    case "cta_click": funnelState.clickedSoftCTA = true; break;
    case "execution_gate_view": funnelState.gateViewed = true; break;
    case "execution_unlocked": funnelState.executionUnlocked = true; break;
    case "feature_unlock_success": funnelState.featureUnlocksCount++; break;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(FUNNEL_KEY, JSON.stringify(funnelState));
    // Beritahu semua subscriber funnel bahwa state berubah
    funnelListeners.forEach(listener => listener({ ...funnelState }));
  }
}

function saveToStorage(event: EventPayload) {
  try {
    const queue = JSON.parse(sessionStorage.getItem("omega_event_log") || "[]");
    queue.push(event);
    sessionStorage.setItem("omega_event_log", JSON.stringify(queue.slice(-50)));
  } catch (e) { /* silent fail */ }
}

/* ============================================================
    HOOKS & UTILITIES
============================================================ */

export function subscribeToEvents(callback: (ev: EventPayload) => void) {
  eventListeners.add(callback);
  return () => eventListeners.delete(callback);
}

export function getFunnelAnalytics(): FunnelState {
  if (typeof window === "undefined") return funnelState;
  const stored = localStorage.getItem(FUNNEL_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return funnelState;
    }
  }
  return funnelState;
}

export function trackFeatureUnlock(featureId: string, success: boolean) {
  return trackEvent(success ? "feature_unlock_success" : "feature_unlock_failed", {
    featureId,
    timestamp: new Date().toISOString()
  });
}