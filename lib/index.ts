/* ============================================================
   LIB BARREL EXPORT
   Central export point for all library types and functions
============================================================ */

// Types
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

// Context Types & Hooks
export type {
  AccessState,
  UserAccess,
  AccessContextType,
  AccessProviderProps,
} from "./contextTypes";

export {
  useAccess,
  useIsAuthenticated,
  useIsPremium,
} from "./contextTypes";

// Brokers
export type { BrokerKey } from "./brokers";
export { BROKERS, connectBroker } from "./brokers";

// Premium Access
export {
  hasPremiumAccess,
  unlockPremium,
  getPremiumExpire,
  getPremiumSource,
} from "./premium";

// Market Data
export { 
  fetchMarketSeries, 
  smoothSeries, 
  generateMarketInsight as generateMarketInsightFromSeries,
  mapTrendToSignal,
  DUMMY_MARKET_DATA,
} from "./market";
export { convertToMarketPoints } from "./marketData";
export { getDummyMarketSeries } from "./marketDummy";

// Insights & Share
export type { Trend as InsightTrend } from "./insight";
export { generateMarketInsight } from "./insight";
export { buildShareText } from "./share";

// Events & Tracking
export type { EventType } from "./events";
export { 
  trackEvent, 
  getFunnelState, 
  subscribeFunnel,
  getEvents,
  updateFunnel,
} from "./events";

// Scheduler
export { scheduler } from "./scheduler";

// Utilities
export { seededRandom, resetSeed } from "./seededRandom";

// Membership
export { MEMBERSHIP } from "./membership";
