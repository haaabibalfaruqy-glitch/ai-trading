// C:\ai_trading\lib\types.ts

export type SystemMode = "idle" | "active" | "error";

// Kita standarisasi CapitalMode agar sinkron di UI mana pun
export type CapitalMode = "Preservation" | "Adaptive Growth" | "Aggressive Expansion";

export type RiskLevel = "low" | "medium" | "high";
export type Timeframe = "scalp" | "long";
export type RiskAppetite = "Low" | "Medium" | "High";
export type Trend = "bullish" | "bearish" | "neutral";

export interface MarketSnapshot {
  volatility: number;
  trendStrength: number;
  drawdown: number;
}

// C:\ai_trading\lib\componentTypes.ts

export interface Coin {
  symbol: string;
  name: string;
  short: string;
  price?: number;
  change?: number;      // <--- Pastikan ini ada
  change24h?: number;   // <--- Pastikan ini ada
}

export interface TradeRow {
  id: string;
  user: string;
  roi: string; // Misal: "+12.5%"
  profit: string; // Misal: "+$150.00"
  status: "WIN" | "LOSS";
  timestamp: number; // Tambahan agar bisa diurutkan (sinkron)
}

export interface ObservedCoin {
  coin: Coin;
  values: number[]; // Array harga untuk sparkline/chart mini
}

export interface MarketPoint {
  timestamp: number;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}