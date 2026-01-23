// C:\ai_trading\lib\insight.ts

import { AIPrediction, Trend as PredictionTrend } from "./aiPredictions";

export type Trend = "up" | "down" | "flat";

export interface InsightResult {
  trend: PredictionTrend;
  message: string;
  confidence: number;
  actionable: string;
}

/**
 * Menerjemahkan status teknikal menjadi narasi manusiawi yang cerdas.
 * Menggabungkan data Volatilitas, RSI, dan Momentum.
 */
export function generateMarketInsight(prediction: AIPrediction): string {
  const { trend, volatility, sessionInsight, newsSentiment } = prediction;

  // Narasi dinamis berdasarkan sentimen berita dan volatilitas
  if (trend === "bullish") {
    if (volatility > 5) {
      return `Neural sensors detect an aggressive bullish breakout. High volatility suggests rapid price discovery. ${sessionInsight}.`;
    }
    return `Steady upward accumulation detected. Market sentiment is ${newsSentiment}. ${sessionInsight}.`;
  }

  if (trend === "bearish") {
    if (volatility > 5) {
      return `Warning: High-intensity sell-off in progress. Neural nodes suggest defensive positioning. ${sessionInsight}.`;
    }
    return `Gradual distribution phase identified. Capital protection prioritized. Sentimen: ${newsSentiment}.`;
  }

  return `Neutral equilibrium maintained. AI is monitoring for institutional volume spikes. ${sessionInsight}.`;
}

/**
 * Generate detailed insight yang terikat langsung dengan mesin prediksi (Urutan 10)
 * Menghilangkan random math untuk sinkronisasi total.
 */
export function generateDetailedInsight(prediction: AIPrediction): InsightResult {
  const message = generateMarketInsight(prediction);
  
  // Memberikan instruksi tindakan berdasarkan Signal Strength
  let actionable = "Monitor market liquidity.";
  if (prediction.signal === "BUY" && prediction.signalStrength > 0.8) {
    actionable = "High-conviction entry signal. Scalp opportunities available.";
  } else if (prediction.signal === "SELL" && prediction.signalStrength > 0.8) {
    actionable = "Strong exit signal. Secure profits or set tight stop-losses.";
  }

  return {
    trend: prediction.trend,
    message,
    confidence: prediction.trendConfidence,
    actionable,
  };
}

/**
 * Utility untuk konversi tipe trend lama ke baru jika diperlukan oleh komponen UI lama
 */
export function mapToLegacyTrend(trend: PredictionTrend): Trend {
  if (trend === "bullish") return "up";
  if (trend === "bearish") return "down";
  return "flat";
}