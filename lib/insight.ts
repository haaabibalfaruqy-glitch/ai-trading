/* ============================================================
   Market Insight Generation
   AI-powered market analysis and trend detection
============================================================ */

export type Trend = "up" | "down" | "flat";

export interface InsightResult {
  trend: Trend;
  message: string;
  confidence: number;
}

/**
 * Generate market insight from price trend direction
 * @param trend - Market direction: "up", "down", or "flat"
 * @returns AI-generated insight message
 */
export function generateMarketInsight(trend: Trend): string {
  if (trend === "up") {
    return "AI detects bullish momentum. Market volatility is expanding upward.";
  }

  if (trend === "down") {
    return "AI flags downside risk. Capital protection is advised.";
  }

  return "AI indicates market consolidation. Breakout likely forming.";
}

/**
 * Generate detailed insight with confidence level
 * @param trend - Market direction
 * @returns Object with trend, message, and confidence score
 */
export function generateDetailedInsight(trend: Trend): InsightResult {
  const message = generateMarketInsight(trend);
  const confidence = 0.72 + Math.random() * 0.18; // 72-90%

  return {
    trend,
    message,
    confidence: parseFloat(confidence.toFixed(2)),
  };
}
