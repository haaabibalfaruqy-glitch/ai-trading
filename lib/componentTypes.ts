// C:\ai_trading\lib\componentTypes.ts

import { ReactNode } from "react";

/* ============================================================
    BASE TYPES & ENUMS
   ============================================================ */
export type SystemMode = "active" | "idle" | "maintenance" | (string & {});
export type CapitalMode = "Adaptive Growth" | "Aggressive" | "Conservative" | "Preservation" | (string & {});
export type RiskAppetite = "Low" | "Medium" | "High" | "Moderate" | (string & {});


export interface Coin {
  symbol: string;
  name: string;
  short: string;
  price?: number;
  change?: number;      // <--- Pastikan ini ada
  change24h?: number;   // <--- Pastikan ini ada
}

export interface MarketPoint {
  time: string;
  value: number;
}

export interface TradeRow {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  price: number;
  amount: string;
  status: "completed" | "pending";
}

/* ============================================================
    COMPONENT PROPS (Sesuai Urutan lib/index.ts)
   ============================================================ */

export interface MarketTickerProps {
  pair: string;
  price: number;
  change: number;
  isUp: boolean;
}

export interface FilterBarProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export interface TradeHeroProps {
  title: string;
  subtitle: string;
  status: "online" | "offline";
}

export interface HeroStatsProps {
  totalProfit: string;
  activeUsers: number;
  accuracy: string;
}

export interface HeroVisualProps {
  theme?: "dark" | "light";
  animate?: boolean;
}

export interface SystemStatusProps {
  mode: SystemMode;
  latency: string;
  uptime: string;
}

export interface TrustBarProps {
  label: string;
  partners: string[];
}

export interface AISessionContextProps {
  sessionId: string;
  status: "analyzing" | "idle" | "executing";
}

export interface AITimelineProps {
  events: Array<{
    time: string;
    label: string;
    status: "completed" | "current" | "pending";
  }>;
}

export interface GovernancePanelProps {
  votingPower: number;
  proposals: any[];
}

export interface ExecutionGateProps {
  isOpen: boolean;
  onConfirm: () => void;
  requiredLevel: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface FooterProps {
  version: string;
  links: Array<{ label: string; href: string }>;
}

export interface SessionDepthBarProps {
  depth: number;
  maxDepth: number;
  color?: string;
}

export interface StatItemProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
}

export interface OmegaCardProps {
  coin: Coin;
  values: number[];
  systemMode: SystemMode;
  onView?: () => void;
}

// FIX: Menambahkan OmegaCardSkeletonProps
export interface OmegaCardSkeletonProps {
  count?: number;
}

// FIX: Menambahkan FilterProps (Baris 40 di index.ts)
export interface FilterProps {
  options: Array<{ label: string; value: string }>;
  selected: string;
  onChange: (value: string) => void;
}

/* ============================================================
    DASHBOARD & ANALYTICS PROPS
   ============================================================ */

export interface MarketChartPanelProps {
  data: MarketPoint[];
  symbol: string;
  isLoading?: boolean;
}

export interface LiveProfitTableProps {
  trades: TradeRow[];
  limit?: number;
}

export interface BehaviorAnalysisProps {
  observedCoin: any;
  viralInsight?: string;
  highlightAnalysis?: string;
  shareText?: string;
  slotsLeft?: number;
  setShowExecutionGate?: (value: boolean) => void;
}