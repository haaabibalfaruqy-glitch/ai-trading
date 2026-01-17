export type Trend = "up" | "down" | "flat";

export function generateMarketInsight(trend: Trend): string {
  if (trend === "up") {
    return "AI detects bullish momentum. Market volatility is expanding upward.";
  }

  if (trend === "down") {
    return "AI flags downside risk. Capital protection is advised.";
  }

  return "AI indicates market consolidation. Breakout likely forming.";
}
