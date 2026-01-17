export type BrokerKey = "binance" | "bybit";

export const BROKERS: Record<
  BrokerKey,
  {
    name: string;
    affiliateUrl: string;
  }
> = {
  binance: {
    name: "Binance",
    affiliateUrl: "https://www.binance.com/en/register",
  },
  bybit: {
    name: "Bybit",
    affiliateUrl: "https://www.bybit.com/register",
  },
};

/**
 * STEALTH broker connection
 * ❌ no redirect
 * ❌ no api call
 * ✅ session marker only
 */
export function connectBroker() {
  if (typeof window === "undefined") return;

  // hard lock
  sessionStorage.setItem("access_state", "broker_connected");

  // optional analytics / future webhook trigger
  sessionStorage.setItem(
    "broker_connected_at",
    String(Date.now())
  );
}

