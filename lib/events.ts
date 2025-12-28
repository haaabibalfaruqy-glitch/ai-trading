const FUNNEL_KEY = "ai_funnel_state";

function loadFunnel() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FUNNEL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveFunnel(state: any) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FUNNEL_KEY, JSON.stringify(state));
}

export type EventType =
  // STEP 1–2
  | "page_view"
  | "cta_click"
  | "module_view"

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
  | "viral_insight_generated";





type EventPayload = {
  type: EventType;
  meta?: Record<string, any>;
  timestamp: number;
};

const eventQueue: EventPayload[] = [];


let funnelState =
  loadFunnel() || {
    // STEP 1–2
    sawChart: false,
    clickedSoftCTA: false,

    // STEP 3–4
    gateViewed: false,
    gateClicked: false,
    executionUnlocked: false,

    // STEP 4
    redirectedToBroker: false,
  };


export function trackEvent(
  type: EventType,
  meta?: Record<string, any>
) {
  try {
    const event: EventPayload = {
      type,
      meta,
      timestamp: Date.now(),
    };

    eventQueue.push(event);
    updateFunnel(type, meta);

    if (process.env.NODE_ENV === "development") {
      console.log("[EVENT]", event);
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EVENT FAILED]", type, err);
    }
  }
}

export function updateFunnel(
  type: EventType,
  meta?: Record<string, any>
) {

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

  saveFunnel(funnelState);
  notifyFunnel();
}


export function getFunnelState() {
  return { ...funnelState };
}

// optional
export function getEvents() {
  return eventQueue;
}

type FunnelListener = () => void;
const funnelListeners: FunnelListener[] = [];

export function subscribeFunnel(fn: FunnelListener) {
  funnelListeners.push(fn);
  return () => {
    const idx = funnelListeners.indexOf(fn);
    if (idx >= 0) funnelListeners.splice(idx, 1);
  };
}

function notifyFunnel() {
  funnelListeners.forEach(fn => fn());
}
