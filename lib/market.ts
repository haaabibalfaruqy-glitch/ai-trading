// C:\ai_trading\lib\market.ts

import { Coin, MarketPoint } from "./types";
import { generateAIPredictions, analyzeMarket } from "./aiPredictions";
import { generateDetailedInsight } from "./insight";

/* ====================
   DUMMY COINS (Sync Base)
==================== */
export const coins: Coin[] = [
  { name: "Bitcoin", short: "BTC", symbol: "BTC", price: 65000, change24h: 2.5 },
  { name: "Ethereum", short: "ETH", symbol: "ETH", price: 3500, change24h: -1.2 },
  { name: "Solana", short: "SOL", symbol: "SOL", price: 145, change24h: 5.8 },
  { name: "Cardano", short: "ADA", symbol: "ADA", price: 0.45, change24h: 0.5 },
];

/* ====================
   INTERNAL CACHE (Kunci Sinkronisasi)
==================== */
// Menyimpan data market terakhir agar Homepage & Dashboard ambil dari 'ember' yang sama
const marketCache = new Map<string, MarketPoint[]>();

/* ====================
   CORE MARKET FUNCTIONS
==================== */

/**
 * Simulasi pergerakan harga yang lebih realistis (Walk Algorithm)
 */
function generatePriceSeries(base: number, length: number = 20): number[] {
  let current = base;
  return Array.from({ length }, () => {
    const change = current * (Math.random() * 0.002 - 0.001); // Max 0.1% per titik
    current += change;
    return Number(current.toFixed(2));
  });
}

/**
 * Fetch Market Data dengan Sinkronisasi Cache
 */
export async function fetchMarketData(symbol: string): Promise<{
  symbol: string;
  points: MarketPoint[];
  latestPrice: number;
}> {
  // Ambil harga dasar dari list coins
  const coinInfo = coins.find(c => c.symbol === symbol);
  const basePrice = coinInfo?.price || 100;

  // Cek apakah sudah ada di cache (untuk menghindari angka loncat-loncat)
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

/**
 * Fungsi Live Update untuk Dashboard & Homepage (Real-time Sync)
 */
export function subscribeToMarketData(
  symbol: string,
  callback: (data: { points: MarketPoint[]; latestPrice: number }) => void,
  intervalMs: number = 3000
) {
  const ticker = setInterval(async () => {
    const data = await fetchMarketData(symbol);
    
    // Simulasi update harga terakhir (Tick)
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
   ANALYSIS + AI (Ready for Production)
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

export function mapTrendToSignal(trend: "bullish" | "bearish" | "neutral") {
  const signals = { bullish: "BUY", bearish: "SELL", neutral: "HOLD" };
  return signals[trend] || "HOLD";
}