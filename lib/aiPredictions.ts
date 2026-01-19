/**
 * AI Prediction Helpers
 * Type-safe functions for trend, risk, and signal analysis
 */

import { MarketPoint, Trend } from "@/lib/types";

/* ============================================================
   TYPE DEFINITIONS
============================================================ */

export interface AIPrediction {
  trend: "bullish" | "bearish" | "neutral";
  trendConfidence: number; // 0-1
  signal: "BUY" | "SELL" | "HOLD";
  signalStrength: number; // 0-1
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskScore: number; // 0-1
  profitPrediction: number; // Predicted price target
  profitMargin: number; // Expected profit % (±)
  volatility: number; // % volatility
  sessionInsight: string; // AI-generated insight
  newsSentiment: "Bullish" | "Mixed" | "Bearish";
}

export interface MarketAnalysis {
  prices: number[];
  volatility: number;
  trendStrength: number;
  momentum: number;
  supportLevel: number;
  resistanceLevel: number;
  movingAverage20: number;
  movingAverage50: number;
  rsi: number; // Relative Strength Index
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
}

/* ============================================================
   UTILITY FUNCTIONS
============================================================ */

/**
 * Calculate simple moving average
 */
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/**
 * Calculate volatility (standard deviation)
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  return (stdDev / avg) * 100; // As percentage
}

/**
 * Calculate RSI (Relative Strength Index)
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains = changes
    .slice(-period)
    .filter((c) => c > 0)
    .reduce((a, b) => a + b, 0);
  const losses = Math.abs(
    changes
      .slice(-period)
      .filter((c) => c < 0)
      .reduce((a, b) => a + b, 0)
  );

  const rs = (gains / period) / (losses / period);
  return 100 - 100 / (1 + rs);
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) {
  const ema12 = calculateEMA(prices, fastPeriod);
  const ema26 = calculateEMA(prices, slowPeriod);
  const macdLine = ema12 - ema26;

  const macdValues = [];
  for (let i = 0; i < prices.length; i++) {
    const e12 = calculateEMA(prices.slice(0, i + 1), fastPeriod);
    const e26 = calculateEMA(prices.slice(0, i + 1), slowPeriod);
    macdValues.push(e12 - e26);
  }

  const signalLine = calculateEMA(macdValues, signalPeriod);
  return {
    value: macdLine,
    signal: signalLine,
    histogram: macdLine - signalLine,
  };
}

/**
 * Calculate EMA (Exponential Moving Average)
 */
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }

  return ema;
}

/**
 * Calculate support and resistance levels
 */
export function calculateSupportResistance(
  prices: number[]
): { support: number; resistance: number } {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  return {
    support: min + range * 0.25,
    resistance: max - range * 0.25,
  };
}

/* ============================================================
   MARKET ANALYSIS
============================================================ */

/**
 * Perform comprehensive market analysis on price data
 */
export function analyzeMarket(points: MarketPoint[]): MarketAnalysis {
  const prices = points.map((p) => p.price);

  const volatility = calculateVolatility(prices);
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const { support, resistance } = calculateSupportResistance(prices);

  // Calculate trend strength
  const trendStrength = Math.abs((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;

  // Calculate momentum
  const momentum =
    ((prices[prices.length - 1] - prices[Math.max(0, prices.length - 10)]) /
      prices[Math.max(0, prices.length - 10)]) *
    100;

  return {
    prices,
    volatility,
    trendStrength,
    momentum,
    supportLevel: support,
    resistanceLevel: resistance,
    movingAverage20: sma20,
    movingAverage50: sma50,
    rsi,
    macd,
  };
}

/* ============================================================
   AI PREDICTIONS
============================================================ */

/**
 * Generate AI predictions from market data
 */
export function generateAIPredictions(
  points: MarketPoint[],
  baseValues?: number[]
): AIPrediction {
  const prices = baseValues || points.map((p) => p.price);

  if (prices.length === 0) {
    return {
      trend: "neutral",
      trendConfidence: 0,
      signal: "HOLD",
      signalStrength: 0,
      riskLevel: "MEDIUM",
      riskScore: 0.5,
      profitPrediction: 0,
      profitMargin: 0,
      volatility: 0,
      sessionInsight: "Insufficient data",
      newsSentiment: "Mixed",
    };
  }

  const analysis = analyzeMarket(points);

  // Determine trend
  const priceChange = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
  const trend: "bullish" | "bearish" | "neutral" =
    priceChange > 2 ? "bullish" : priceChange < -2 ? "bearish" : "neutral";

  // Trend confidence based on price change and RSI
  const trendConfidence = Math.min(
    Math.abs(priceChange) / 10 + 0.3 + (Math.abs(analysis.rsi - 50) / 100) * 0.2,
    0.95
  );

  // Generate signal
  const signal: "BUY" | "SELL" | "HOLD" =
    priceChange > 2 ? "BUY" : priceChange < -2 ? "SELL" : "HOLD";

  // Signal strength
  const signalStrength = Math.min(Math.abs(priceChange) / 15 + 0.4, 0.98);

  // Risk level and score
  const riskLevel: "LOW" | "MEDIUM" | "HIGH" =
    analysis.volatility > 5 ? "HIGH" : analysis.volatility > 3 ? "MEDIUM" : "LOW";
  const riskScore = Math.min(analysis.volatility / 10, 0.99);

  // Profit prediction
  const lastPrice = prices[prices.length - 1];
  const profitPrediction = lastPrice * (1 + priceChange / 100 + (Math.random() - 0.5) * 0.05);
  const profitMargin = Math.min(Math.abs(priceChange) + Math.random() * 8, 25);

  // Session insight
  const sessionInsight =
    analysis.volatility > 5
      ? "Volatile momentum detected"
      : analysis.trendStrength > 5
        ? "Strong directional move"
        : "Steady accumulation phase";

  // News sentiment
  const newsSentiment = trend === "bullish" ? "Bullish" : trend === "bearish" ? "Bearish" : "Mixed";

  return {
    trend,
    trendConfidence,
    signal,
    signalStrength,
    riskLevel,
    riskScore,
    profitPrediction,
    profitMargin,
    volatility: Number(analysis.volatility.toFixed(1)),
    sessionInsight,
    newsSentiment,
  };
}

/**
 * Generate multiple AI insights from a symbol
 */
export function generateAIInsights(points: MarketPoint[]) {
  const predictions = generateAIPredictions(points);

  return {
    ...predictions,
    analysis: analyzeMarket(points),
    timestamp: Date.now(),
  };
}
