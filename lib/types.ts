// C:\ai_trading\lib\types.ts

export type SystemMode = "idle" | "active" | "error";

export type CapitalMode = "preservation" | "growth" | "aggressive";

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
  symbol: string;
  short: string;
  price?: number;
  risk?: RiskLevel;
  timeframe?: Timeframe;
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
  timestamp: number;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
};
