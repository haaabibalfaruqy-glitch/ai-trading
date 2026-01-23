// C:\ai_trading\lib\componentTypes.ts

// PERBAIKAN: Menambahkan "Preservation" dan string agar tidak bentrok dengan hook/file lain
export type SystemMode = "active" | "idle" | "maintenance" | string;
export type CapitalMode = "Adaptive Growth" | "Aggressive" | "Conservative" | "Preservation" | string;
export type RiskAppetite = "Low" | "Medium" | "High" | "Moderate" | string;

export interface Coin {
  symbol: string;
  name: string;
  short: string;
  price?: number;
  change?: number;
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

export interface MarketChartPanelProps {
  data: MarketPoint[];
  symbol: string;
  isLoading?: boolean;
}

export interface LiveProfitTableProps {
  trades: TradeRow[];
  limit?: number;
}

export interface OmegaCardProps {
  coin: Coin;
  values: number[];
  systemMode: SystemMode; // Merujuk ke SystemMode di atas
  onView?: () => void;
}

// PERBAIKAN: Pastikan ini diekspor untuk digunakan di HeroStats.tsx
export interface HeroStatsProps {
  totalProfit: string;
  activeUsers: number;
  accuracy: string;
}

export interface BehaviorAnalysisProps {
  observedCoin: any;
  viralInsight?: string;
  highlightAnalysis?: string;
  shareText?: string;
  slotsLeft?: number;
  setShowExecutionGate?: (value: boolean) => void;
}