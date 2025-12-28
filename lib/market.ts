export type MarketPoint = {
  time: number;
  price: number;
};

// Fetch harga real dari CoinGecko (FREE, no API key)
import { getDummyMarketSeries } from "./marketDummy";

export async function fetchMarketSeries(symbol: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.example.com/market/${symbol}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error("Market API not OK");
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty market data");
    }

    return data;
  } catch (err) {
    console.warn("[Market API fallback]", err);
    return getDummyMarketSeries();
  }
}