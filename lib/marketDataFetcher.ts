/**
 * Market Data Fetcher with Access Control
 * Handles real-time market data fetching with broker access verification
 */

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
   MARKET DATA CACHE
============================================================ */

const marketDataCache = new Map<string, MarketDataResponse>();

function getCacheKey(symbol: string, timeframe: string): string {
  return `${symbol}:${timeframe}`;
}

function isCacheValid(cachedData: MarketDataResponse, maxAgeMs: number = 60000): boolean {
  return Date.now() - cachedData.timestamp < maxAgeMs;
}

/* ============================================================
   ACCESS CONTROL HELPERS
============================================================ */

function isAccessAllowed(access: AccessState): boolean {
  // Guest access is restricted
  // broker_connected and premium have full access
  return access !== "guest";
}

function maskDataForGuest(data: MarketPoint[]): MarketPoint[] {
  // For guests, only show low-resolution data (every 5th point)
  return data.filter((_, idx) => idx % 5 === 0);
}

/* ============================================================
   REAL-TIME MARKET DATA FETCHING
============================================================ */

/**
 * Fetch market data from real API or fallback to dummy data
 * Respects access control - restricted for guests
 */
export async function fetchMarketData(
  options: FetchMarketOptions
): Promise<MarketDataResponse> {
  const {
    symbol,
    timeframe = "1h",
    limit = 100,
    access = "guest",
  } = options;

  const cacheKey = getCacheKey(symbol, timeframe);
  const locked = !isAccessAllowed(access);

  // Check cache first
  const cached = marketDataCache.get(cacheKey);
  if (cached && isCacheValid(cached) && !locked) {
    return {
      ...cached,
      source: "cache",
      accessLevel: access,
    };
  }

  try {
    // Attempt real API fetch (with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.example.com/market/${symbol}?timeframe=${timeframe}&limit=${limit}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const rawData = await response.json();
      const marketPoints = convertRawToMarketPoints(rawData);

      const result: MarketDataResponse = {
        success: true,
        data: locked ? maskDataForGuest(marketPoints) : marketPoints,
        source: "api",
        timestamp: Date.now(),
        accessLevel: access,
        locked,
      };

      // Cache successful result
      if (!locked) {
        marketDataCache.set(cacheKey, result);
      }

      return result;
    }
  } catch (error) {
    console.warn(`[Market API Error] Failed to fetch ${symbol}:`, error);
  }

  // Fallback to dummy data
  const dummyData = getDummyMarketSeries();

  const result: MarketDataResponse = {
    success: false,
    data: locked ? maskDataForGuest(dummyData) : dummyData,
    source: "dummy",
    timestamp: Date.now(),
    accessLevel: access,
    locked,
  };

  return result;
}

/**
 * Fetch market data for multiple symbols
 */
export async function fetchMultipleMarketData(
  symbols: string[],
  options?: Omit<FetchMarketOptions, "symbol">
): Promise<Record<string, MarketDataResponse>> {
  const results: Record<string, MarketDataResponse> = {};

  const promises = symbols.map((symbol) =>
    fetchMarketData({ ...options, symbol }).then((data) => {
      results[symbol] = data;
    })
  );

  await Promise.all(promises);
  return results;
}

/**
 * Subscribe to real-time market data updates
 * Returns unsubscribe function
 */
export function subscribeToMarketData(
  symbol: string,
  callback: (data: MarketPoint[]) => void,
  options?: Omit<FetchMarketOptions, "symbol">
): () => void {
  // Simulate real-time updates
  const interval = setInterval(async () => {
    const response = await fetchMarketData({
      ...options,
      symbol,
    });

    if (response.success || response.data.length > 0) {
      callback(response.data);
    }
  }, 3000 + Math.random() * 2000);

  // Return unsubscribe function
  return () => clearInterval(interval);
}

/* ============================================================
   DATA CONVERSION HELPERS
============================================================ */

/**
 * Convert raw API data to typed MarketPoint[]
 */
export function convertRawToMarketPoints(rawData: any[]): MarketPoint[] {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .map((item) => {
      try {
        return {
          timestamp: item.time || item.timestamp || item.t || Date.now(),
          price: item.price || item.close || item.c || 0,
          volume: item.volume || item.v || 0,
          open: item.open || item.o,
          high: item.high || item.h,
          low: item.low || item.l,
          close: item.close || item.c,
        } as MarketPoint;
      } catch {
        return null;
      }
    })
    .filter((point): point is MarketPoint => point !== null && point.price > 0);
}

/**
 * Normalize market data to consistent format
 */
export function normalizeMarketData(data: MarketPoint[]): MarketPoint[] {
  return data
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter((point, idx, arr) => {
      // Remove duplicates and ensure prices are reasonable
      const isDuplicate = idx > 0 && arr[idx - 1].timestamp === point.timestamp;
      const isValidPrice = point.price > 0 && point.price < 10000000;
      return !isDuplicate && isValidPrice;
    });
}

/* ============================================================
   BATCH OPERATIONS
============================================================ */

/**
 * Clear market data cache
 */
export function clearMarketCache(): void {
  marketDataCache.clear();
}

/**
 * Clear specific symbol from cache
 */
export function clearSymbolCache(symbol: string): void {
  const keys = Array.from(marketDataCache.keys()).filter((key) =>
    key.startsWith(symbol)
  );
  keys.forEach((key) => marketDataCache.delete(key));
}

/**
 * Get cache statistics
 */
export function getMarketCacheStats() {
  return {
    size: marketDataCache.size,
    entries: Array.from(marketDataCache.keys()),
    totalMemory: `${(marketDataCache.size * 10).toFixed(2)}KB`,
  };
}
