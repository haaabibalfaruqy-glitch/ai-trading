// C:\ai_trading\lib\events.ts

import { featureStateManager } from "./featureStateManager";

/* ============================================================
    TYPES & ENUMERATIONS (Synchronized with All Groups)
============================================================ */
export type EventType =
  | "page_view" | "cta_click" | "cta_click_hero" | "module_view"
  | "execution_gate_view" | "execution_gate_click" | "execution_unlocked"
  | "execution_blocked" | "premium_cta_click" | "feature_unlock_requested"
  | "feature_unlock_success" | "feature_unlock_failed" | "feature_lock"
  | "market_chart_view" | "insight_generated" | "insight_shared"
  | "exit_intent" | "trust_pulse" | "user_resurrected";
  
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
    STATE & SESSION (Next.js Optimized)
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

/* ============================================================
    CORE TRACKING ENGINE
============================================================ */
let funnelState: FunnelState = {
  sawChart: false,
  clickedSoftCTA: false,
  gateViewed: false,
  executionUnlocked: false,
  featureUnlocksCount: 0,
};

const eventListeners = new Set<(ev: EventPayload) => void>();

/**
 * Enterprise Event Tracker: 
 * Mencatat kejadian dan mensinkronisasi state aplikasi secara global.
 */
export function trackEvent(type: EventType, meta?: Record<string, any>): EventPayload {
  const event: EventPayload = {
    type,
    meta,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  if (typeof window !== "undefined") {
    // 1. Update Internal Funnel
    updateFunnelLogic(type, meta);
    
    // 2. Local Storage Persistence
    saveToStorage(event);

    // 3. Global Notification (Sinkronisasi UI)
    eventListeners.forEach(listener => listener(event));

    // 4. Debugging (Hanya di Dev)
    if (process.env.NODE_ENV === "development") {
      console.log(`%c[EVENT: ${type}]`, "color: #10b981; font-weight: bold", meta);
    }
  }

  return event;
}

/* ============================================================
    FUNNEL LOGIC (The Path to Conversion)
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

  localStorage.setItem(FUNNEL_KEY, JSON.stringify(funnelState));
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

export function getFunnelAnalytics() {
  if (typeof window === "undefined") return funnelState;
  const stored = localStorage.getItem(FUNNEL_KEY);
  return stored ? JSON.parse(stored) : funnelState;
}

/**
 * Spesifik untuk integrasi dengan FeatureLock (Urutan 5)
 */
export function trackFeatureUnlock(featureId: string, success: boolean) {
  return trackEvent(success ? "feature_unlock_success" : "feature_unlock_failed", {
    featureId,
    timestamp: new Date().toISOString()
  });
}