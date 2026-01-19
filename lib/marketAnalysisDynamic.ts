/**
 * Dynamic Market Analysis Module
 * Heavy computations with lazy loading and dynamic imports
 */

import dynamic from "next/dynamic";
import { MarketPoint } from "@/lib/types";
import { AccessState } from "@/context/UserAccessContext";

/* ============================================================
   LAZY-LOADED ANALYSIS COMPONENTS
============================================================ */

/**
 * Dynamically import market analysis functions
 * This reduces initial bundle size by deferring heavy computation imports
 */
export const loadMarketAnalysis = () => {
  return import("@/lib/aiPredictions").then((module) => ({
    generateAIPredictions: module.generateAIPredictions,
    generateAIInsights: module.generateAIInsights,
    analyzeMarket: module.analyzeMarket,
    calculateVolatility: module.calculateVolatility,
    calculateRSI: module.calculateRSI,
    calculateMACD: module.calculateMACD,
  }));
};

export const loadMarketDataFetcher = () => {
  return import("@/lib/marketDataFetcher").then((module) => ({
    fetchMarketData: module.fetchMarketData,
    fetchMultipleMarketData: module.fetchMultipleMarketData,
    subscribeToMarketData: module.subscribeToMarketData,
    convertRawToMarketPoints: module.convertRawToMarketPoints,
  }));
};

/* ============================================================
   LAZY-LOADED INSIGHTS GENERATOR
============================================================ */

export interface InsightsLoaderOptions {
  symbol: string;
  access?: AccessState;
  onProgress?: (status: string) => void;
}

/**
 * Load and generate comprehensive market insights
 * Handles access control and lazy loading
 */
export async function loadAndGenerateInsights(
  points: MarketPoint[],
  options: InsightsLoaderOptions
) {
  const { access = "guest", onProgress } = options;
  const locked = access === "guest";

  try {
    onProgress?.("Loading analysis engine...");

    // Dynamically load prediction module
    const predictions = await loadMarketAnalysis();

    onProgress?.("Analyzing market data...");

    // Generate predictions
    const insights = predictions.generateAIInsights(points);

    // For locked users, reduce detail level
    if (locked) {
      return {
        ...insights,
        analysis: {
          ...insights.analysis,
          rsi: undefined, // Hide advanced indicators
          macd: undefined,
        },
        locked: true,
      };
    }

    onProgress?.("Analysis complete");
    return {
      ...insights,
      locked: false,
    };
  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error("Failed to generate market insights");
  }
}

/* ============================================================
   PERFORMANCE OPTIMIZATION HELPERS
============================================================ */

/**
 * Batch process multiple symbols with rate limiting
 */
export async function batchAnalyzeSymbols(
  symbols: string[],
  onAnalyze: (symbol: string, result: any) => void,
  options?: InsightsLoaderOptions & { concurrency?: number }
) {
  const concurrency = options?.concurrency || 3;
  const fetcher = await loadMarketDataFetcher();

  const queue = [...symbols];
  const processing = new Set<string>();

  return new Promise<void>((resolve, reject) => {
    const processNext = async () => {
      if (queue.length === 0 && processing.size === 0) {
        resolve();
        return;
      }

      while (processing.size < concurrency && queue.length > 0) {
        const symbol = queue.shift()!;
        processing.add(symbol);

        try {
          options?.onProgress?.(`Fetching ${symbol}...`);

          const data = await fetcher.fetchMarketData({
            symbol,
            access: options?.access || "guest",
          });

          if (data.data.length > 0) {
            const insights = await loadAndGenerateInsights(data.data, {
              ...options,
              symbol,
            });

            onAnalyze(symbol, insights);
          }
        } catch (error) {
          console.error(`Failed to analyze ${symbol}:`, error);
        } finally {
          processing.delete(symbol);
          processNext();
        }
      }
    };

    processNext();
  });
}

/* ============================================================
   MEMOIZATION & CACHING
============================================================ */

const analysisCache = new Map<string, { result: any; timestamp: number }>();
const ANALYSIS_CACHE_TTL = 300000; // 5 minutes

/**
 * Cached analysis with TTL
 */
export async function cachedAnalyzeSymbol(
  points: MarketPoint[],
  symbol: string,
  options?: InsightsLoaderOptions
) {
  const cacheKey = `${symbol}:${points.length}`;
  const cached = analysisCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < ANALYSIS_CACHE_TTL) {
    return cached.result;
  }

  const result = await loadAndGenerateInsights(points, {
    ...options,
    symbol,
  });

  analysisCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

/**
 * Clear analysis cache
 */
export function clearAnalysisCache() {
  analysisCache.clear();
}

/* ============================================================
   STREAM PROCESSING
============================================================ */

/**
 * Process market data stream with analysis
 * Returns async generator for memory efficiency
 */
export async function* analyzeMarketStream(
  symbols: string[],
  options?: InsightsLoaderOptions & { batchSize?: number }
) {
  const batchSize = options?.batchSize || 1;
  const fetcher = await loadMarketDataFetcher();

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);

    for (const symbol of batch) {
      try {
        const data = await fetcher.fetchMarketData({
          symbol,
          access: options?.access || "guest",
        });

        if (data.data.length > 0) {
          const insights = await loadAndGenerateInsights(data.data, {
            ...options,
            symbol,
          });

          yield {
            symbol,
            insights,
            success: true,
          };
        }
      } catch (error) {
        yield {
          symbol,
          error: String(error),
          success: false,
        };
      }
    }
  }
}

/* ============================================================
   WORKER-FRIENDLY ANALYSIS
============================================================ */

/**
 * Get analysis configuration for potential Worker implementation
 */
export function getWorkerAnalysisConfig() {
  return {
    supportedAnalysis: [
      "generateAIPredictions",
      "analyzeMarket",
      "calculateVolatility",
      "calculateRSI",
      "calculateMACD",
    ],
    cacheable: true,
    cacheSize: analysisCache.size,
    heavyComputations: true,
  };
}
