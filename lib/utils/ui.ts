/**
 * UI utility functions for transforming data for display
 */

/**
 * Map trend direction to UI signal direction (for display purposes)
 * This is different from mapTrendToSignal in lib/market.ts which maps to trading actions
 */
export function mapTrendToDirection(
  trend: "bullish" | "bearish" | "neutral"
): "up" | "down" | "flat" {
  if (trend === "bullish") return "up";
  if (trend === "bearish") return "down";
  return "flat";
}
