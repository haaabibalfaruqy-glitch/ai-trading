// lib/index.ts

// TYPES
export type {
  SystemMode,
  CapitalMode,
  RiskLevel,
  Timeframe,
  RiskAppetite,
  Trend,
  MarketPoint,
  MarketSnapshot,
  Coin,
  TradeRow,
  ObservedCoin,
} from "./types";

export type {
  MarketChartPanelProps,
  LiveProfitTableProps,
  MarketTickerProps,
  FilterBarProps,
  SearchBarProps,
  TradeHeroProps,
  HeroStatsProps,
  HeroVisualProps,
  SystemStatusProps,
  TrustBarProps,
  AISessionContextProps,
  AITimelineProps,
  BehaviorAnalysisProps,
  GovernancePanelProps,
  ExecutionGateProps,
  ErrorBoundaryProps,
  FooterProps,
  SessionDepthBarProps,
  StatItemProps,
  OmegaCardProps,
  OmegaCardSkeletonProps,
  FilterProps,
} from "./componentTypes";

// CONTEXT
export type { AccessState, UserAccess, AccessContextType, AccessProviderProps } from "./contextTypes";
export { useAccess, useIsAuthenticated, useIsPremium, useIsBrokerUnlocked } from "./contextTypes";

// MARKET DATA & ANALYSIS
export {
  fetchMarketSeries,
  fetchMarketData,
  subscribeToMarketData,
  convertToMarketPoints,
  smoothSeries,
  mapTrendToSignal,
  DUMMY_MARKET_DATA,
} from "./marketData";

export {
  generateCoinInsight,
  analyzeCoinMarket,
  DUMMY_MARKET_DATA as MARKET_DUMMY_DATA,
} from "./market";

export {
  loadMarketAnalysis,
  loadMarketDataFetcher,
  loadAndGenerateInsights,
  cachedAnalyzeSymbol,
  clearAnalysisCache,
} from "./marketAnalysisDynamic";
