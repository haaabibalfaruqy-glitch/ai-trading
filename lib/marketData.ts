// lib/marketData.ts
import { MarketPoint } from "@/lib/types";

/* ====================
   SINGLE ITEM CONVERSION
==================== */
export function convertToMarketPoint(item: any): MarketPoint {
  return {
    timestamp: item.time || item.timestamp || Date.now(),
    price: item.price || item.close || 0,
    open: item.open,
    high: item.high,
    low: item.low,
    volume: item.volume,
    close: item.close || item.price,
  };
}

export function convertToMarketPoints(rawData: any[]): MarketPoint[] {
  return rawData.map(convertToMarketPoint);
}

export function convertMultipleMarketData(dataMap: Record<string, any[]>): Record<string, MarketPoint[]> {
  const result: Record<string, MarketPoint[]> = {};
  for (const symbol in dataMap) {
    result[symbol] = convertToMarketPoints(dataMap[symbol]);
  }
  return result;
}

/* ====================
   DUMMY / TEST DATA
==================== */
export const DUMMY_MARKET_DATA: MarketPoint[] = [
  { timestamp: 1000, price: 50000, open: 49500, high: 50500, low: 49000, volume: 12 },
  { timestamp: 2000, price: 51000, open: 50000, high: 51500, low: 50000, volume: 8 },
  { timestamp: 3000, price: 50500, open: 51000, high: 51200, low: 50000, volume: 15 },
];

/* ====================
   FETCH / SUBSCRIBE
==================== */
export async function fetchMarketSeries(symbol?: string): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const base = symbol === "ETH" ? 2000 : symbol === "LTC" ? 150 : 30000;
      const series = Array.from({ length: 20 }, (_, i) =>
        base + Math.round((Math.random() - 0.5) * 500)
      );
      resolve(series);
    }, 300);
  });
}

export async function convertNumberSeriesToMarketPoints(): Promise<MarketPoint[]> {
  const prices = await fetchMarketSeries();
  const now = Date.now();
  return prices.map((price, i) => ({
    timestamp: now - (prices.length - i) * 60_000,
    price,
  }));
}

export async function fetchMarketData(symbol: string) {
  const points = await convertNumberSeriesToMarketPoints();
  return {
    symbol,
    points,
    latestPrice: points[points.length - 1]?.price || 0,
  };
}

export function subscribeToMarketData(symbol: string, callback: (points: MarketPoint[]) => void): () => void {
  const interval = setInterval(async () => {
    const points = await convertNumberSeriesToMarketPoints();
    callback(points);
  }, 5000);
  return () => clearInterval(interval);
}

/* ====================
   UTILITY
==================== */
export function smoothSeries(series: number[], factor: number = 0.2): number[] {
  if (!series.length) return [];
  const smoothed: number[] = [series[0]];
  for (let i = 1; i < series.length; i++) {
    smoothed.push(smoothed[i - 1] * (1 - factor) + series[i] * factor);
  }
  return smoothed;
}

export function mapTrendToSignal(series: number[]): "up" | "down" | "flat" {
  if (series.length < 2) return "flat";
  const delta = series[series.length - 1] - series[0];
  if (delta > 1) return "up";
  if (delta < -1) return "down";
  return "flat";
}
