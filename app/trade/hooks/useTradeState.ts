import { useState } from "react";

export function useTradeState() {
  const [systemMode, setSystemMode] = useState<"active" | "idle">("active");
  const [capitalMode, setCapitalMode] = useState<
    "Preservation" | "Adaptive Growth" | "Aggressive Expansion"
  >("Adaptive Growth");
  const [heroProfit, setHeroProfit] = useState<number>(1284392);
  const [observedCoin, setObservedCoin] = useState<any | null>(null);
  const [search, setSearch] = useState<string>("");
  const [risk, setRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [timeframe, setTimeframe] = useState<"all" | "scalp" | "long">("all");
  const [executionUnlocked, setExecutionUnlocked] = useState<boolean>(false);

  return {
    systemMode,
    setSystemMode,
    capitalMode,
    setCapitalMode,
    heroProfit,
    setHeroProfit,
    observedCoin,
    setObservedCoin,
    search,
    setSearch,
    risk,
    setRisk,
    timeframe,
    setTimeframe,
    executionUnlocked,
    setExecutionUnlocked,
  };
}
