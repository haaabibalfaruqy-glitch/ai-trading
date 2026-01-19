// Core type definitions for the trading system

export type SystemMode = "idle" | "active" | "error";

export type CapitalMode =
  | "Preservation"
  | "Adaptive Growth"
  | "Aggressive Expansion";

export type RiskLevel = "low" | "medium" | "high";
export type Timeframe = "scalp" | "long";
export type RiskAppetite = "Low" | "Medium" | "High";
export type Trend = "bullish" | "bearish" | "neutral";

export interface MarketSnapshot {
  volatility: number;
  trendStrength: number;
  drawdown: number;
}

export interface Coin {
  name: string;
  short: string;
  risk: RiskLevel;
  timeframe: Timeframe;
  aiPick?: boolean;
}

export interface TradeRow {
  id: string;
  user: string;
  roi: string;
  profit: string;
  status: "WIN" | "LOSS";
}

export interface ObservedCoin {
  coin: Coin;
  values: number[];
}

export type MarketPoint = {
  timestamp: number; // Unix timestamp in milliseconds
  price: number; // Current price
  volume?: number; // Trading volume
  open?: number; // Opening price for period
  high?: number; // Highest price for period
  low?: number; // Lowest price for period
  close?: number; // Closing price for period
};
