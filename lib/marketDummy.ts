import { MarketPoint } from "./types";

export function getDummyMarketSeries(): MarketPoint[] {
  const now = Date.now();

  return Array.from({ length: 60 }).map((_, i) => ({
    timestamp: now - (60 - i) * 60_000,
    price: 42000 + Math.sin(i / 5) * 800 + i * 12,
  }));
}
