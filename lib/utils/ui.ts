/* =========================================
   UI Utilities
   ========================================= */

/* -----------------------------------------
   Trend Types
------------------------------------------ */

export type Trend = "bullish" | "bearish" | "neutral";
export type TrendDirection = "up" | "down" | "flat";

/* -----------------------------------------
   Core Mapping
------------------------------------------ */

const TREND_DIRECTION_MAP: Record<Trend, TrendDirection> = {
  bullish: "up",
  bearish: "down",
  neutral: "flat",
};

/**
 * Map market trend to UI direction
 * (Backward compatible)
 */
export function mapTrendToDirection(trend: Trend): TrendDirection {
  return TREND_DIRECTION_MAP[trend];
}

/* -----------------------------------------
   UI Helpers (Optional but Powerful)
------------------------------------------ */

/**
 * Trend → color (Tailwind-safe)
 */
export function mapTrendToColor(trend: Trend): string {
  switch (trend) {
    case "bullish":
      return "text-green-400";
    case "bearish":
      return "text-red-400";
    case "neutral":
    default:
      return "text-gray-400";
  }
}

/**
 * Trend → background glow
 */
export function mapTrendToGlow(trend: Trend): string {
  switch (trend) {
    case "bullish":
      return "bg-green-400/10";
    case "bearish":
      return "bg-red-400/10";
    case "neutral":
    default:
      return "bg-gray-400/10";
  }
}

/**
 * Trend → icon (string-based, lucide-ready)
 */
export function mapTrendToIcon(trend: Trend): string {
  switch (trend) {
    case "bullish":
      return "arrow-up";
    case "bearish":
      return "arrow-down";
    case "neutral":
    default:
      return "minus";
  }
}

/**
 * Trend → human readable label
 */
export function mapTrendToLabel(trend: Trend): string {
  switch (trend) {
    case "bullish":
      return "Bullish";
    case "bearish":
      return "Bearish";
    case "neutral":
    default:
      return "Neutral";
  }
}
