export function computeTrend(values: number[]): "bullish" | "bearish" | "neutral" {
  if (!values || values.length < 2) return "neutral";

  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;

  if (delta > 0) return "bullish";
  if (delta < 0) return "bearish";
  return "neutral";
}
