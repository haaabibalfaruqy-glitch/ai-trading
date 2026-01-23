// C:\ai_trading\lib\marketAnalysisDynamic.ts

import { MarketPoint } from "@/lib/types";
import { AccessState } from "@/context/UserAccessContext";

/* ============================================================
    TYPES
============================================================ */
export interface InsightsLoaderOptions {
  symbol: string;
  access?: AccessState;
  onProgress?: (status: string) => void;
  signal?: AbortSignal; // Tambahan untuk penghentian proses
}

export interface InsightsResult {
  trend: string;
  signal: string;
  analysis: any;
  prediction?: any;
  locked: boolean;
  timestamp: number;
}

/* ============================================================
    DYNAMIC LOADERS (Optimized with Caching)
============================================================ */
let analysisModuleCache: any = null;

export const loadMarketAnalysis = async () => {
  if (analysisModuleCache) return analysisModuleCache;
  const module = await import("@/lib/aiPredictions");
  analysisModuleCache = {
    generateAIPredictions: module.generateAIPredictions,
    generateAIInsights: module.generateAIInsights,
    analyzeMarket: module.analyzeMarket,
  };
  return analysisModuleCache;
};

export const loadMarketDataFetcher = async () => {
  const module = await import("@/lib/marketDataFetcher");
  return module;
};

/* ============================================================
    INSIGHTS GENERATOR (Secure & Synchronized)
============================================================ */
export async function loadAndGenerateInsights(
  points: MarketPoint[],
  options: InsightsLoaderOptions
): Promise<InsightsResult> {
  const { access = "guest", onProgress, signal } = options;
  const isPremium = access === "premium";

  try {
    if (signal?.aborted) throw new Error("Analysis aborted");

    onProgress?.("Syncing Neural Engine...");
    const engine = await loadMarketAnalysis();

    if (signal?.aborted) throw new Error("Analysis aborted");
    
    onProgress?.("Calculating Market Vectors...");
    const insights = engine.generateAIInsights(points);

    // SINKRONISASI KEAMANAN: Jika bukan premium, sembunyikan data sensitif
    if (!isPremium) {
      return {
        ...insights,
        analysis: {
          ...insights.analysis,
          rsi: 50, // Data palsu untuk guest
          macd: { value: 0, signal: 0, histogram: 0 },
          supportLevel: "Locked",
          resistanceLevel: "Locked"
        },
        locked: true,
        timestamp: Date.now(),
      };
    }

    onProgress?.("Intelligence Ready");
    return { ...insights, locked: false, timestamp: Date.now() };
  } catch (err) {
    console.error("[Neural-Orchestrator] Error:", err);
    throw err;
  }
}

/* ============================================================
    SMART CACHE SYSTEM
============================================================ */
const analysisCache = new Map<string, { result: InsightsResult; timestamp: number }>();
const CACHE_TTL = 30_000; // Dikurangi ke 30 detik agar tetap "Real-Time"

export async function cachedAnalyzeSymbol(
  points: MarketPoint[],
  symbol: string,
  options?: InsightsLoaderOptions
): Promise<InsightsResult> {
  const key = `${symbol}:${points.length}`;
  const cached = analysisCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const result = await loadAndGenerateInsights(points, { ...options, symbol });
  analysisCache.set(key, { result, timestamp: Date.now() });
  return result;
}

/* ============================================================
    BATCH CONCURRENCY (Premium Trading Desk Style)
============================================================ */
export async function batchAnalyzeSymbols(
  symbols: string[],
  onAnalyze: (symbol: string, result: InsightsResult) => void,
  options?: InsightsLoaderOptions & { concurrency?: number }
): Promise<void> {
  const concurrency = options?.concurrency || 2;
  const queue = [...symbols];
  const activeTasks: Promise<void>[] = [];

  const runTask = async (symbol: string) => {
    try {
      const fetcher = await loadMarketDataFetcher();
      const data = await fetcher.fetchMarketData({ symbol, access: options?.access || "guest" });
      
      if (data.data) {
        const result = await cachedAnalyzeSymbol(data.data, symbol, options);
        onAnalyze(symbol, result);
      }
    } catch (e) {
      console.warn(`Skipping ${symbol} due to error`);
    }
  };

  while (queue.length > 0) {
    while (activeTasks.length < concurrency && queue.length > 0) {
      const symbol = queue.shift()!;
      const task = runTask(symbol).then(() => {
        activeTasks.splice(activeTasks.indexOf(task), 1);
      });
      activeTasks.push(task);
    }
    await Promise.race(activeTasks);
  }
  await Promise.all(activeTasks);
}

export function clearAnalysisCache() {
  analysisCache.clear();
}