/* Component Props Type Definitions */
import { ReactNode } from "react";
import { CapitalMode, SystemMode, Trend, MarketPoint } from "@/lib/types";

/* ============================================================
   MARKET & DATA COMPONENTS
============================================================ */
export interface MarketChartPanelProps {
  symbol: "bitcoin" | "ethereum";
  onTrendChange?: (trend: "up" | "down" | "flat") => void;
}

export interface LiveProfitTableProps {
  enabled?: boolean;
  onRefresh?: () => void;
}

export interface MarketTickerProps {
  symbol?: string;
}

/* ============================================================
   FILTER & SEARCH COMPONENTS
============================================================ */
export interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  setRisk: (v: "all" | "low" | "medium" | "high") => void;
  setTimeframe: (v: "all" | "scalp" | "long") => void;
}

export interface SearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  filteredCoins: Array<{ name: string; short: string }>;
}

/* ============================================================
   HERO & STATUS COMPONENTS
============================================================ */
export interface TradeHeroProps {
  heroProfit: number;
  heartbeat: number;
  capitalMode: CapitalMode;
  setCapitalMode: React.Dispatch<React.SetStateAction<CapitalMode>>;
  riskAppetite: string;
  accessGranted: boolean;
  setShowExecutionGate: (v: boolean) => void;
  activeCTACopy: { primary: string; sub: string };
  isMobile: boolean;
}

export interface HeroStatsProps {
  systemMode: SystemMode;
  capitalMode: CapitalMode;
}

export interface HeroVisualProps {
  systemMode: SystemMode;
}

export interface SystemStatusProps {
  systemMode: SystemMode;
}

export interface TrustBarProps {
  trustLevel: number;
  isPulsing: boolean;
}

/* ============================================================
   AI & ANALYSIS COMPONENTS
============================================================ */
export interface AISessionContextProps {
  level: "partial" | "full";
}

export interface AITimelineProps {
  events?: Array<{ time: string; label: string }>;
}

export interface BehaviorAnalysisProps {
  observedCoin: { coin: any; values: number[] };
  viralInsight: string | null;
  highlightAnalysis: boolean;
  shareText: string | null;
  slotsLeft: number;
  setShowExecutionGate: (v: boolean) => void;
}

export interface GovernancePanelProps {
  systemMode: SystemMode;
}

/* ============================================================
   UTILITY & LAYOUT COMPONENTS
============================================================ */
export interface ExecutionGateProps {
  children?: ReactNode;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface FooterProps {
  /* No required props */
}

export interface SessionDepthBarProps {
  onReady?: () => void;
}

/* ============================================================
   STAT & CARD COMPONENTS
============================================================ */
export interface StatItemProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export interface OmegaCardProps {
  coin: { name: string; short: string; risk: "low" | "medium" | "high"; timeframe: "scalp" | "long" };
  values: number[];
  search: string;
  onView: () => void;
  systemMode: SystemMode;
}

export interface OmegaCardSkeletonProps {
  count?: number;
}

/* ============================================================
   FILTER & COMPONENT SELECTION
============================================================ */
export interface FilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
