import { MarketPoint } from "./types";
import { getDummyMarketSeries } from "./marketDummy";

// Re-export MarketPoint type for convenient importing
export type { MarketPoint };

export async function fetchMarketSeries(symbol: string): Promise<MarketPoint[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://api.example.com/market/${symbol}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Market API not OK");
    const data = await res.json();
    
    // ✅ CONVERT raw data to MarketPoint[]
    if (Array.isArray(data) && data.length) {
      return data.map((item: any) => ({
        timestamp: item.time || item.timestamp,
        price: item.price || item.close,
      }));
    }
    
    return getDummyMarketSeries();
  } catch (err) {
    console.warn("[Market API fallback]", err);
    return getDummyMarketSeries();
  }
}

export function smoothSeries(series: number[], factor = 0.2): number[] {
  const result: number[] = [];
  series.forEach((v, i) => result.push(i === 0 ? v : result[i-1]*(1-factor) + v*factor));
  return result;
}

export function generateMarketInsight(series: number[]): string {
  const last = series[series.length-1];
  const first = series[0];
  const diff = last - first;
  if (diff > 50) return "Market is bullish 🚀";
  if (diff < -50) return "Market is bearish 📉";
  return "Market is neutral ⚖️";
}

export function mapTrendToSignal(trend: string): "buy" | "sell" | "hold" {
  if(trend === "bullish") return "buy";
  if(trend === "bearish") return "sell";
  return "hold";
}

// ✅ REMOVE or FIX the incomplete data declaration at the bottom
// If you need test data, use this:
export const DUMMY_MARKET_DATA: MarketPoint[] = [
  { timestamp: 1000, price: 100 },
  { timestamp: 2000, price: 105 },
];
