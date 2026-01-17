# Library Module System

## Overview

The `/lib` directory contains all shared types, utilities, and business logic. All exports are centralized in `lib/index.ts` for easy importing.

## Quick Import Examples

### Import from barrel export (recommended)
```tsx
import { 
  fetchMarketSeries, 
  hasPremiumAccess, 
  trackEvent,
  useAccess,
  type SystemMode,
  type MarketPoint,
} from "@/lib";
```

### Import from specific modules
```tsx
import type { MarketPoint } from "@/lib/types";
import { fetchMarketSeries } from "@/lib/market";
import { hasPremiumAccess } from "@/lib/premium";
```

## Module Organization

### Core Types (`types.ts`)
- `SystemMode` - App state: "idle" | "active" | "error"
- `CapitalMode` - Trading mode: "Preservation" | "Adaptive Growth" | "Aggressive Expansion"
- `MarketPoint` - Market data: `{ timestamp: number; price: number }`
- `Coin`, `TradeRow`, `ObservedCoin`, `MarketSnapshot`
- Type unions: `RiskLevel`, `Timeframe`, `RiskAppetite`, `Trend`

### Market Data (`market.ts`, `marketDummy.ts`, `marketData.ts`)
```tsx
// Fetch real market data
const points = await fetchMarketSeries("bitcoin");

// Get dummy data for testing
const dummy = getDummyMarketSeries();

// Smooth price series
const smoothed = smoothSeries(prices, 0.2);

// Generate insight from price data
const insight = generateMarketInsightFromSeries(prices);
```

### Access Control (`context/UserAccessContext.tsx`, `contextTypes.ts`)
```tsx
// Use in components
const { access, unlockBroker, setPremiumAccess } = useAccess();

// Quick checks
if (useIsAuthenticated()) { /* user logged in */ }
if (useIsPremium()) { /* premium features */ }
```

### Premium Features (`premium.ts`)
```tsx
// Check premium access
if (hasPremiumAccess()) { }

// Unlock trial (24 hours)
unlockPremium();

// Get expiration time
const expires = getPremiumExpire();

// Get source of premium
const source = getPremiumSource();
```

### Event Tracking (`events.ts`)
```tsx
// Track user events
trackEvent("cta_click", { tier: "soft", source: "hero" });

// Get funnel state
const funnel = getFunnelState();

// Subscribe to funnel updates
const unsubscribe = subscribeFunnel(() => {
  console.log("Funnel updated!");
});
```

### Brokers (`brokers.ts`)
```tsx
import { BROKERS, connectBroker, type BrokerKey } from "@/lib";

// List available brokers
console.log(BROKERS.binance.name);

// Connect to broker
connectBroker();

// Get all broker data
const brokerList = Object.values(BROKERS);
```

### Scheduling (`scheduler.ts`)
```tsx
import { scheduler } from "@/lib";

// Register interval
const id = scheduler.register(() => {
  console.log("Tick!");
}, 1000);

// Clear specific interval
scheduler.clear(id);

// Clear all intervals
scheduler.clearAll();
```

### Utilities
```tsx
// Seeded random number generator
import { seededRandom, resetSeed } from "@/lib";
const num = seededRandom(0, 100);
resetSeed(12345);

// Generate share text
import { buildShareText } from "@/lib";
const text = buildShareText({ insight: "Bullish", symbol: "BTC" });

// Market insights
import { generateMarketInsight } from "@/lib";
const msg = generateMarketInsight("up");
```

## Component Props Types (`componentTypes.ts`)

All component props are centrally typed:

```tsx
import { TradeHeroProps, FilterBarProps } from "@/lib";

// Use in component definitions
const MyComponent: React.FC<TradeHeroProps> = (props) => {
  // ...
};
```

## Export Summary

| Category | Count | Examples |
|----------|-------|----------|
| **Types** | 15+ | SystemMode, MarketPoint, CapitalMode |
| **Component Props** | 20+ | TradeHeroProps, FilterBarProps |
| **Functions** | 25+ | fetchMarketSeries, trackEvent, hasPremiumAccess |
| **Hooks** | 3 | useAccess, useIsAuthenticated, useIsPremium |
| **Constants** | 5+ | BROKERS, MEMBERSHIP, DUMMY_MARKET_DATA |

## Best Practices

1. **Always import from barrel export (`@/lib`)** for consistency
2. **Use type imports for TypeScript types**: `import type { MarketPoint } from "@/lib"`
3. **Keep business logic in lib, presentation in components**
4. **Export all public APIs** - don't force others to know internal file structure
5. **Document complex functions** with JSDoc comments
