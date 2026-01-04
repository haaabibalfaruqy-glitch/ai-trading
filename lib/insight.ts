export type Trend = "up" | "down" | "flat";

export interface Candle {
  time: string;
  price: number;
  broker: string;
  volume: number;
}

export function generateMarketInsight(trend: Trend) {
  if (trend === "up") {
    return "AI detects bullish momentum. Market volatility is expanding upward.";
  }
  if (trend === "down") {
    return "AI flags downside risk. Capital protection is advised.";
  }
  return "AI indicates market consolidation. Breakout likely forming.";
}

// helper untuk array candles
export function generateMarketInsightSeries(candles: Candle[]) {
  return candles.map(c => {
    const trend: Trend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "flat";
    return generateMarketInsight(trend);
  });
}

// generateTradeSignal
export function generateTradeSignal(candle: Candle): "BUY" | "SELL" | "HOLD" {
  if (candle.price % 2 === 0) return "BUY";
  if (candle.price % 2 === 1) return "SELL";
  return "HOLD";
}

// predictMarket placeholder
export function predictMarket(candles: Candle[]): number[] {
  return candles.map(c => c.price + Math.random());
}
