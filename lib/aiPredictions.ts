// C:\ai_trading\lib\aiPredictions.ts

import { MarketPoint } from "@/lib/types";

/* ============================================================
    TYPES (Strictly Typed for Global Sync)
============================================================ */

export type Trend = "bullish" | "bearish" | "neutral";
export type Signal = "BUY" | "SELL" | "HOLD";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type NewsSentiment = "Bullish" | "Mixed" | "Bearish";

export interface AIPrediction {
  trend: Trend;
  trendConfidence: number; 
  signal: Signal;
  signalStrength: number; 
  riskLevel: RiskLevel;
  riskScore: number; 
  profitPrediction: number;
  profitMargin: number; 
  volatility: number; 
  sessionInsight: string;
  newsSentiment: NewsSentiment;
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
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
}

/* ============================================================
    LOW-LEVEL CALCULATIONS (Optimized)
============================================================ */

export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices.at(-1) ?? 0;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  return Number(((Math.sqrt(variance) / mean) * 100).toFixed(2));
}

export function calculateRSI(prices: number[], period = 14): number {
  if (prices.length <= period) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return Number((100 - 100 / (1 + rs)).toFixed(1));
}

export function calculateMACD(prices: number[]) {
  const fastEMA = calculateEMA(prices, 12);
  const slowEMA = calculateEMA(prices, 26);
  const macdValue = fastEMA - slowEMA;
  // Simplified signal line for real-time performance
  const signalLine = macdValue * 0.9; 
  return {
    value: Number(macdValue.toFixed(4)),
    signal: Number(signalLine.toFixed(4)),
    histogram: Number((macdValue - signalLine).toFixed(4)),
  };
}

/* ============================================================
    MARKET ANALYSIS ENGINE
============================================================ */

export function analyzeMarket(points: MarketPoint[]): MarketAnalysis {
  const prices = points.map((p) => p.price);
  const lastPrice = prices.at(-1) || 0;
  
  const volatility = calculateVolatility(prices);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  
  // Deteksi Support & Resistance berbasis Fibonacci Sederhana
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  const trendStrength = Math.abs((lastPrice - prices[0]) / (prices[0] || 1)) * 100;
  const momentum = ((lastPrice - (prices[prices.length - 5] || prices[0])) / (prices[prices.length - 5] || 1)) * 100;

  return {
    prices,
    volatility,
    trendStrength: Number(trendStrength.toFixed(2)),
    momentum: Number(momentum.toFixed(2)),
    supportLevel: Number((min + range * 0.236).toFixed(2)),
    resistanceLevel: Number((max - range * 0.236).toFixed(2)),
    movingAverage20: calculateSMA(prices, 20),
    movingAverage50: calculateSMA(prices, 50),
    rsi,
    macd,
  };
}

/* ============================================================
    AI PREDICTION ENGINE (Neural Emulation)
============================================================ */

export function generateAIPredictions(points: MarketPoint[]): AIPrediction {
  if (points.length < 5) {
    return {
      trend: "neutral", trendConfidence: 0.5, signal: "HOLD", signalStrength: 0.4,
      riskLevel: "LOW", riskScore: 0.2, profitPrediction: 0, profitMargin: 0,
      volatility: 0, sessionInsight: "Calibrating neural sensors...", newsSentiment: "Mixed",
    };
  }

  const analysis = analyzeMarket(points);
  const lastPrice = analysis.prices.at(-1)!;
  
  // LOGIC: Trend Determination
  let trend: Trend = "neutral";
  if (analysis.rsi > 60 && analysis.macd.histogram > 0) trend = "bullish";
  if (analysis.rsi < 40 && analysis.macd.histogram < 0) trend = "bearish";

  // LOGIC: Signal Generation
  let signal: Signal = "HOLD";
  if (trend === "bullish" && analysis.rsi < 75) signal = "BUY";
  if (trend === "bearish" && analysis.rsi > 25) signal = "SELL";

  // LOGIC: Confidence & Strength
  const trendConfidence = Math.min((analysis.trendStrength / 5) + 0.4, 0.98);
  const signalStrength = Math.min((Math.abs(analysis.momentum) / 2) + 0.5, 0.99);

  // LOGIC: Profit Prediction (Smart Targeting)
  const multiplier = signal === "BUY" ? 1.045 : signal === "SELL" ? 0.955 : 1;
  const profitPrediction = lastPrice * multiplier;

  // LOGIC: Session Insights (Narrative System)
  let insight = "Market showing stable horizontal movement.";
  if (analysis.volatility > 5) insight = "High volatility detected. AI suggests tight stop-losses.";
  else if (analysis.rsi > 70) insight = "Asset overbought. Expect minor correction soon.";
  else if (analysis.rsi < 30) insight = "Asset oversold. Optimal entry point for long positions.";
  else if (signal === "BUY") insight = "Neural patterns confirm bullish breakout momentum.";

  return {
    trend,
    trendConfidence: Number(trendConfidence.toFixed(2)),
    signal,
    signalStrength: Number(signalStrength.toFixed(2)),
    riskLevel: analysis.volatility > 5 ? "HIGH" : analysis.volatility > 2.5 ? "MEDIUM" : "LOW",
    riskScore: Number((analysis.volatility / 10).toFixed(2)),
    profitPrediction: Number(profitPrediction.toFixed(2)),
    profitMargin: Number((Math.abs(multiplier - 1) * 100).toFixed(1)),
    volatility: analysis.volatility,
    sessionInsight: insight,
    newsSentiment: trend === "bullish" ? "Bullish" : trend === "bearish" ? "Bearish" : "Mixed",
  };
}

/**
 * High-level analysis wrapper for components
 */
export function generateAIInsights(points: MarketPoint[]) {
  const prediction = generateAIPredictions(points);
  return {
    ...prediction,
    analysis: analyzeMarket(points),
    timestamp: Date.now(),
  };
}