import { NextRequest, NextResponse } from "next/server";

// Simulasi database strategi crypto
const STRATEGIES_DB = [
  { id: '1', symbol: 'BTC/USD', description: 'Bitcoin trading', baseReturn: 27850, risk: 'MEDIUM' },
  { id: '2', symbol: 'ETH/USD', description: 'Ethereum trading', baseReturn: 1845, risk: 'LOW' },
  { id: '3', symbol: 'BNB/USD', description: 'Binance Coin trading', baseReturn: 305, risk: 'LOW' },
  { id: '4', symbol: 'ADA/USD', description: 'Cardano trading', baseReturn: 0.45, risk: 'HIGH' },
  { id: '5', symbol: 'SOL/USD', description: 'Solana trading', baseReturn: 25.8, risk: 'MEDIUM' },
];

// Helper: simulasi harga real-time (±5% fluktuasi)
function simulateMarketPrice(base: number) {
  const fluctuation = 0.95 + Math.random() * 0.1; // 0.95 ~ 1.05
  return +(base * fluctuation).toFixed(2);
}

// Helper: AI-style prediction
function generateAIPrediction(strategy: typeof STRATEGIES_DB[0]) {
  const trend = Math.random() > 0.5 ? 'bullish' : 'bearish';
  const confidence = +(50 + Math.random() * 49).toFixed(1); // 50-99%
  const signal = trend === 'bullish' ? 'BUY' : 'SELL';
  const predictedReturn = +(strategy.baseReturn * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2);
  const volatility = +(Math.random() * 5 + 0.5).toFixed(2); // 0.5% ~ 5.5%
  return { trend, confidence, signal, predictedReturn, volatility };
}

// Endpoint GET
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol")?.toUpperCase(); // filter symbol
  const riskFilter = url.searchParams.get("risk")?.toUpperCase(); // filter risk

  // Filter strategi
  let filtered = STRATEGIES_DB;
  if (symbol) filtered = filtered.filter(s => s.symbol.toUpperCase() === symbol);
  if (riskFilter) filtered = filtered.filter(s => s.risk === riskFilter);

  // Map strategi + harga live + AI prediction
  const enhanced = filtered.map(strategy => {
    const livePrice = simulateMarketPrice(strategy.baseReturn);
    const ai = generateAIPrediction(strategy);
    return {
      ...strategy,
      livePrice,
      ai,
    };
  });

  // Tambah metadata pro-level
  const response = {
    timestamp: Date.now(),
    count: enhanced.length,
    server: {
      version: "1.0.0",
      status: "ok",
    },
    strategies: enhanced,
  };

  return NextResponse.json(response);
}
