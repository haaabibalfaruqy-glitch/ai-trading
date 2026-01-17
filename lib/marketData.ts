import { MarketPoint } from "@/lib/types";

export function convertToMarketPoints(rawData: any[]): MarketPoint[] {
  return rawData.map((item) => ({
    timestamp: item.time || item.timestamp,
    price: item.price || item.close,
  }));
}

// Usage example:
const rawMarketData = [
  { time: 1000, price: 50000 },
  { time: 2000, price: 51000 },
];

const points: MarketPoint[] = convertToMarketPoints(rawMarketData);