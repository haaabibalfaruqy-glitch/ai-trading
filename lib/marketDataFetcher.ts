// C:\ai_trading\lib\marketDataFetcher.ts

import { MarketPoint } from "@/lib/types";
import { getDummyMarketSeries } from "@/lib/marketDummy";
import { AccessState } from "@/context/UserAccessContext";

/* ============================================================
    TYPES
============================================================ */
export interface FetchMarketOptions {
  symbol: string;
  timeframe?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  limit?: number;
  access?: AccessState;
}

export interface MarketDataResponse {
  success: boolean;
  data: MarketPoint[];
  source: "api" | "dummy" | "cache";
  timestamp: number;
  accessLevel: AccessState;
  locked: boolean;
}

/* ============================================================
    MARKET DATA CACHE (Global Singularity)
============================================================ */
const marketDataCache = new Map<string, MarketDataResponse>();

const getCacheKey = (symbol: string, timeframe: string) => `${symbol}:${timeframe}`;

const isCacheValid = (cached: MarketDataResponse) => Date.now() - cached.timestamp < 15000; // 15 detik saja untuk real-time trading

/* ============================================================
    ACCESS CONTROL (Security Hardening)
============================================================ */
const isFullAccess = (access: AccessState) => access === "premium" || access === "broker_connected";

/**
 * Masking Data: User Guest hanya melihat data resolusi rendah
 */
const maskDataForGuest = (data: MarketPoint[]) => {
  return data.filter((_, idx) => idx % 4 === 0); // 25% resolusi untuk guest
};

/* ============================================================
    CORE FETCH ENGINE
============================================================ */
export async function fetchMarketData(options: FetchMarketOptions): Promise<MarketDataResponse> {
  const { symbol, timeframe = "1h", limit = 100, access = "guest" } = options;
  const cacheKey = getCacheKey(symbol, timeframe);
  const hasFullAccess = isFullAccess(access);

  // 1. Check Global Cache
  const cached = marketDataCache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    return { ...cached, source: "cache", accessLevel: access };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Mock API Call - Replace with your actual exchange API (Binance/Bybit)
    const response = await fetch(
      `https://api.exchange.com/v1/klines?symbol=${symbol}&interval=${timeframe}&limit=${limit}`,
      { signal: controller.signal }
    ).catch(() => ({ ok: false }));

    clearTimeout(timeout);

    let marketPoints: MarketPoint[] = [];

    if (response && 'ok' in response && response.ok) {
      const rawData = await (response as Response).json();
      marketPoints = convertRawToMarketPoints(rawData);
    } else {
      // Fallback to Intelligent Dummy Data
      marketPoints = getDummyMarketSeries().map(p => ({
        ...p,
        timestamp: Date.now() - (Math.random() * 1000) // Adjust timestamp to current
      }));
    }

    const result: MarketDataResponse = {
      success: marketPoints.length > 0,
      data: hasFullAccess ? marketPoints : maskDataForGuest(marketPoints),
      source: response && 'ok' in response && response.ok ? "api" : "dummy",
      timestamp: Date.now(),
      accessLevel: access,
      locked: !hasFullAccess,
    };

    // Cache only valid data
    if (result.data.length > 0) marketDataCache.set(cacheKey, result);
    return result;

  } catch (error) {
    return {
      success: false,
      data: maskDataForGuest(getDummyMarketSeries()),
      source: "dummy",
      timestamp: Date.now(),
      accessLevel: access,
      locked: !hasFullAccess,
    };
  }
}

/* ============================================================
    REAL-TIME SUBSCRIPTION (Synchronized)
============================================================ */
export function subscribeToMarketData(
  symbol: string,
  callback: (data: MarketPoint[]) => void,
  options?: Omit<FetchMarketOptions, "symbol">
): () => void {
  // Sync dengan detak jantung pasar (Urutan 4)
  const poll = async () => {
    const res = await fetchMarketData({ ...options, symbol });
    if (res.data.length > 0) callback(res.data);
  };

  poll(); // Initial call
  const interval = setInterval(poll, 3000 + Math.random() * 1000);

  return () => clearInterval(interval);
}

/* ============================================================
    DATA NORMALIZATION
============================================================ */
export function convertRawToMarketPoints(rawData: any[]): MarketPoint[] {
  if (!Array.isArray(rawData)) return [];
  return rawData
    .map((item) => ({
      timestamp: Number(item.t || item[0] || Date.now()),
      price: Number(item.c || item[4] || 0),
      volume: Number(item.v || item[5] || 0),
      open: Number(item.o || item[1]),
      high: Number(item.h || item[2]),
      low: Number(item.l || item[3]),
      close: Number(item.c || item[4]),
    }))
    .filter(p => p.price > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function clearMarketCache() { marketDataCache.clear(); }