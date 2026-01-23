/* ============================================================
   BROKER DEFINITIONS
============================================================ */

export type BrokerKey = "binance" | "bybit";

export interface BrokerConfig {
  key: BrokerKey;
  name: string;
  affiliateUrl: string;
  region?: string;
  supportsSpot?: boolean;
  supportsFutures?: boolean;
}

export const BROKERS: Record<BrokerKey, BrokerConfig> = {
  binance: {
    key: "binance",
    name: "Binance",
    affiliateUrl: "https://www.binance.com/en/register",
    region: "global",
    supportsSpot: true,
    supportsFutures: true,
  },
  bybit: {
    key: "bybit",
    name: "Bybit",
    affiliateUrl: "https://www.bybit.com/register",
    region: "global",
    supportsSpot: true,
    supportsFutures: true,
  },
};

/* ============================================================
   SESSION KEYS (CENTRALIZED)
============================================================ */

const SESSION_KEYS = {
  ACCESS_STATE: "access_state",
  BROKER_KEY: "connected_broker",
  CONNECTED_AT: "broker_connected_at",
};

/* ============================================================
   STEALTH BROKER CONNECTION
============================================================ */
/**
 * ❌ no redirect
 * ❌ no API call
 * ❌ no wallet / auth
 * ✅ session-based unlock marker
 * ✅ compatible with AccessContext & FeatureGate
 */
export function connectBroker(broker: BrokerKey): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    SESSION_KEYS.ACCESS_STATE,
    "broker_connected"
  );

  sessionStorage.setItem(
    SESSION_KEYS.BROKER_KEY,
    broker
  );

  sessionStorage.setItem(
    SESSION_KEYS.CONNECTED_AT,
    String(Date.now())
  );
}

/* ============================================================
   HELPERS
============================================================ */

export function getConnectedBroker(): BrokerKey | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(
    SESSION_KEYS.BROKER_KEY
  ) as BrokerKey | null;
}

export function isBrokerConnected(): boolean {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(
      SESSION_KEYS.ACCESS_STATE
    ) === "broker_connected"
  );
}

export function disconnectBroker(): void {
  if (typeof window === "undefined") return;

  Object.values(SESSION_KEYS).forEach((key) =>
    sessionStorage.removeItem(key)
  );
}
