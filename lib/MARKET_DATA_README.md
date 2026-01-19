# Copilot Market Data System

Comprehensive, type-safe market data infrastructure with AI predictions, real-time fetching, and access control.

## 📦 Modules

### 1. **aiPredictions.ts** - AI Analysis Engine
Type-safe AI prediction helpers for trend, risk, and signal analysis.

```typescript
import { generateAIPredictions, analyzeMarket } from "@/lib";

const predictions = generateAIPredictions(marketPoints);
// Returns: { trend, signal, riskLevel, profitMargin, volatility, ... }

const analysis = analyzeMarket(marketPoints);
// Returns: { volatility, RSI, MACD, supportLevel, resistanceLevel, ... }
```

**Key Functions:**
- `generateAIPredictions()` - Generate trading signals and predictions
- `analyzeMarket()` - Comprehensive technical analysis
- `calculateVolatility()` - Volatility (std deviation)
- `calculateRSI()` - Relative Strength Index
- `calculateMACD()` - Moving Average Convergence Divergence
- `calculateSMA()` - Simple Moving Average
- `calculateEMA()` - Exponential Moving Average

### 2. **marketDataFetcher.ts** - Real-Time Data Fetcher
Real-time market data fetching with access control and caching.

```typescript
import { fetchMarketData, subscribeToMarketData } from "@/lib";

// Single fetch with access control
const response = await fetchMarketData({
  symbol: "BTC",
  access: "broker_connected", // Controls data resolution
  timeframe: "1h",
  limit: 100,
});

// Real-time subscription
const unsubscribe = subscribeToMarketData("ETH", (data) => {
  console.log("New data:", data);
}, { access: "premium" });

// Cleanup
unsubscribe();
```

**Features:**
- ✅ **Access Control**: Guest users see masked (lower-resolution) data
- ✅ **Caching**: Automatic 60s cache for duplicate requests
- ✅ **Fallback**: API → Dummy data on failure
- ✅ **Type-Safe**: Full TypeScript support

### 3. **marketAnalysisDynamic.ts** - Heavy Computations (Lazy Load)
Dynamic import wrapper for analysis with lazy loading and optimization.

```typescript
import { loadAndGenerateInsights, batchAnalyzeSymbols } from "@/lib";

// Load and analyze with progress
const insights = await loadAndGenerateInsights(points, {
  symbol: "BTC",
  access: "broker_connected",
  onProgress: (status) => console.log(status),
});

// Batch analyze multiple symbols with rate limiting
await batchAnalyzeSymbols(
  ["BTC", "ETH", "DOGE"],
  (symbol, result) => console.log(symbol, result),
  { concurrency: 3, access: "premium" }
);

// Stream processing (memory efficient)
for await (const item of analyzeMarketStream(["BTC", "ETH"])) {
  if (item.success) {
    console.log(item.symbol, item.insights);
  }
}
```

## 🔐 Access Control

All market data respects access levels:

```
┌─────────────────────────────────────────┐
│         Access Control Levels           │
├─────────────────────────────────────────┤
│ guest:           RESTRICTED             │
│  - Masked data (every 5th candle)      │
│  - Limited indicators                   │
│  - No advanced analysis                 │
│                                         │
│ broker_connected: FULL                  │
│  - Real-time data                       │
│  - All indicators                       │
│  - Full analysis                        │
│                                         │
│ premium:         FULL + PRIORITY        │
│  - All of above                         │
│  - Priority API calls                   │
│  - Extended history                     │
└─────────────────────────────────────────┘
```

## 📊 Market Data Types

```typescript
// Core market point with optional fields
interface MarketPoint {
  timestamp: number;    // Unix ms
  price: number;        // Current price
  volume?: number;      // Trading volume
  open?: number;        // Period open
  high?: number;        // Period high
  low?: number;         // Period low
  close?: number;       // Period close
}

// AI predictions
interface AIPrediction {
  trend: "bullish" | "bearish" | "neutral";
  trendConfidence: number; // 0-1
  signal: "BUY" | "SELL" | "HOLD";
  signalStrength: number; // 0-1
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskScore: number; // 0-1
  profitPrediction: number;
  profitMargin: number;
  volatility: number; // %
  sessionInsight: string;
  newsSentiment: "Bullish" | "Mixed" | "Bearish";
}

// Market analysis
interface MarketAnalysis {
  prices: number[];
  volatility: number;
  trendStrength: number;
  momentum: number;
  supportLevel: number;
  resistanceLevel: number;
  movingAverage20: number;
  movingAverage50: number;
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
}
```

## ⚡ Performance Optimization

### Dynamic Imports
Heavy computations are lazily loaded:

```typescript
// Only imported when needed (not in initial bundle)
const analysis = await loadMarketAnalysis();
const predictions = analysis.generateAIPredictions(points);
```

### Caching
- **Data Cache**: 60s TTL per symbol/timeframe
- **Analysis Cache**: 5min TTL per analysis
- `clearAnalysisCache()` - Manual cache clear

```typescript
// Automatic cache hit for duplicate requests
const result1 = await cachedAnalyzeSymbol(points, "BTC");
const result2 = await cachedAnalyzeSymbol(points, "BTC"); // From cache
```

### Batch Processing
- Rate limiting with configurable concurrency
- Automatic queue management

```typescript
await batchAnalyzeSymbols(
  symbols,
  callback,
  { concurrency: 3 } // Max 3 concurrent API calls
);
```

### Stream Processing
- Memory-efficient async generator
- Process large datasets without loading all in memory

```typescript
for await (const item of analyzeMarketStream(symbols)) {
  // Process one at a time
}
```

## 🚀 Usage Examples

### Basic Data Fetch
```typescript
import { fetchMarketData } from "@/lib";

const data = await fetchMarketData({
  symbol: "BTC",
  access: "broker_connected",
});

console.log(data.data); // MarketPoint[]
console.log(data.locked); // Is guest?
```

### Real-Time Predictions
```typescript
import { generateAIPredictions } from "@/lib";

const points = await fetchMarketSeries("ETH");
const pred = generateAIPredictions(points);

if (pred.signal === "BUY" && pred.signalStrength > 0.7) {
  console.log("Strong buy signal!");
}
```

### Advanced Analysis with Progress
```typescript
import { loadAndGenerateInsights } from "@/lib";

const insights = await loadAndGenerateInsights(
  marketPoints,
  {
    symbol: "BTC",
    access: "premium",
    onProgress: (status) => {
      console.log(`📊 ${status}`);
    },
  }
);

console.log(insights.trend);
console.log(insights.analysis.rsi);
```

### Batch Processing
```typescript
import { batchAnalyzeSymbols } from "@/lib";

const results = {};

await batchAnalyzeSymbols(
  ["BTC", "ETH", "DOGE", "XRP"],
  (symbol, analysis) => {
    results[symbol] = analysis;
  },
  {
    concurrency: 2,
    access: "premium",
    onProgress: (status) => console.log(status),
  }
);
```

## 🔧 Backend Integration Points

The system is designed for backend handling of:

1. **Sensitive Data**: Broker credentials, API keys (never in frontend)
2. **Real API Calls**: Actual broker/market APIs (behind proxy)
3. **Advanced Indicators**: GPU-accelerated computations (Node.js)
4. **Historical Analysis**: Long-term trend calculations (heavy)
5. **IB/Affiliate Tracking**: Backend-only logging

## 📝 Cache Management

```typescript
import { getMarketCacheStats, clearSymbolCache } from "@/lib";

// Check cache stats
const stats = getMarketCacheStats();
console.log(`${stats.size} symbols cached`);

// Clear specific symbol
clearSymbolCache("BTC");

// Clear all
clearMarketCache();
```

## 🎯 Best Practices

1. **Always check access level**:
   ```typescript
   if (response.locked) {
     // Show limited UI for guests
   }
   ```

2. **Use caching for repeated analysis**:
   ```typescript
   const cached = await cachedAnalyzeSymbol(points, symbol);
   ```

3. **Lazy load heavy computations**:
   ```typescript
   const analysis = await loadAndGenerateInsights(...);
   ```

4. **Implement rate limiting for batch**:
   ```typescript
   { concurrency: 2 } // Not 100 concurrent!
   ```

5. **Handle errors gracefully**:
   ```typescript
   try {
     const data = await fetchMarketData(...);
   } catch (error) {
     // Falls back to dummy data automatically
   }
   ```

## 📦 Exports

Everything is exported from `@/lib/index.ts`:

```typescript
export {
  // Fetching
  fetchMarketData,
  subscribeToMarketData,
  
  // Analysis
  generateAIPredictions,
  analyzeMarket,
  
  // Dynamic imports
  loadMarketAnalysis,
  loadAndGenerateInsights,
  
  // Types
  MarketPoint,
  AIPrediction,
  MarketAnalysis,
};
```

---

**System**: Copilot Market Data v1.0  
**Status**: Production Ready  
**Access Control**: ✅ Enforced  
**Performance**: ✅ Optimized  
**Type Safety**: ✅ Full TypeScript
