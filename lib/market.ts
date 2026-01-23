// C:\ai_trading\lib\market.ts

import { Coin, MarketPoint } from "./types";
import { generateAIPredictions, analyzeMarket } from "./aiPredictions";
import { generateDetailedInsight } from "./insight";

/* ====================
    DUMMY COINS (Sync Base)
==================== */
export const coins: Coin[] = [
  { name: "Bitcoin", short: "BTC", symbol: "BTC", price: 65000, change24h: 2.5, change: 2.5 },
  { name: "Ethereum", short: "ETH", symbol: "ETH", price: 3500, change24h: -1.2, change: -1.2 },
  { name: "Solana", short: "SOL", symbol: "SOL", price: 145, change24h: 5.8, change: 5.8 },
  { name: "Cardano", short: "ADA", symbol: "ADA", price: 0.45, change24h: 0.5, change: 0.5 },
];

// Alias untuk memenuhi kebutuhan lib/index.ts (DUMMY_MARKET_DATA)
export const DUMMY_MARKET_DATA = coins;

/* ====================
    INTERNAL CACHE
==================== */
const marketCache = new Map<string, MarketPoint[]>();

/* ====================
    CORE MARKET FUNCTIONS
==================== */

function generatePriceSeries(base: number, length: number = 20): number[] {
  let current = base;
  return Array.from({ length }, () => {
    const change = current * (Math.random() * 0.002 - 0.001);
    current += change;
    return Number(current.toFixed(2));
  });
}

export async function fetchMarketData(symbol: string): Promise<{
  symbol: string;
  points: MarketPoint[];
  latestPrice: number;
}> {
  const coinInfo = coins.find(c => c.symbol === symbol);
  const basePrice = coinInfo?.price || 100;
  let points = marketCache.get(symbol);

  if (!points) {
    const prices = generatePriceSeries(basePrice);
    const now = Date.now();
    points = prices.map((price, i) => ({
      timestamp: now - (prices.length - i) * 60_000,
      price,
    }));
    marketCache.set(symbol, points);
  }

  return {
    symbol,
    points,
    latestPrice: points[points.length - 1].price,
  };
}

export function subscribeToMarketData(
  symbol: string,
  callback: (data: { points: MarketPoint[]; latestPrice: number }) => void,
  intervalMs: number = 3000
) {
  const ticker = setInterval(async () => {
    const data = await fetchMarketData(symbol);
    const lastPoint = data.points[data.points.length - 1];
    const newPrice = lastPoint.price + (lastPoint.price * (Math.random() * 0.001 - 0.0005));
    
    const updatedPoints = [...data.points.slice(1), { 
      timestamp: Date.now(), 
      price: Number(newPrice.toFixed(2)) 
    }];
    
    marketCache.set(symbol, updatedPoints);
    callback({ points: updatedPoints, latestPrice: Number(newPrice.toFixed(2)) });
  }, intervalMs);

  return () => clearInterval(ticker);
}

/* ====================
    ANALYSIS + AI
==================== */

export async function analyzeCoinMarket(symbol: string) {
  const { points, latestPrice } = await fetchMarketData(symbol);
  const analysis = analyzeMarket(points);
  const prediction = generateAIPredictions(points);

  return { 
    symbol, 
    latestPrice, 
    analysis, 
    prediction,
    signal: mapTrendToSignal(prediction.trend)
  };
}

// C:\ai_trading\lib\market.ts

export async function generateCoinInsight(symbol: string) {
  // 1. Ambil data market (points) terlebih dahulu
  const { points } = await fetchMarketData(symbol);
  
  // 2. Buat prediksi berdasarkan points tersebut (menghasilkan tipe AIPrediction)
  const prediction = generateAIPredictions(points);
  
  // 3. Kirim hasil prediksi ke fungsi insight
  return generateDetailedInsight(prediction);
}

export function mapTrendToSignal(trend: "bullish" | "bearish" | "neutral") {
  const signals = { bullish: "BUY", bearish: "SELL", neutral: "HOLD" };
  return signals[trend] || "HOLD";
}