// app/trade/components/TrendCalculator.ts
export type Trend = "bullish" | "bearish" | "neutral";

export function calculateTrend(values: number[]): Trend {
  if (values.length < 2) return "neutral";
  const delta = values[values.length - 1] - values[0];
  return delta > 0 ? "bullish" : delta < 0 ? "bearish" : "neutral";
}
