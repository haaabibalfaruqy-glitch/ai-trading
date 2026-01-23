// app/trade/hooks/useTradeState.ts

import { useEffect, useState, useCallback } from "react";
// PERBAIKAN: Import tipe global agar sinkron dengan seluruh aplikasi
import { SystemMode, CapitalMode, Coin } from "@/lib/componentTypes";

export function useTradeState() {
  /* ---------------- SYSTEM STATE ---------------- */
  // Menggunakan SystemMode global
  const [systemMode, setSystemMode] = useState<SystemMode>("idle");
  const [executionUnlocked, setExecutionUnlocked] = useState<boolean>(false);

  /* ---------------- USER INTENT ---------------- */
  // Menggunakan CapitalMode global
  const [capitalMode, setCapitalMode] = useState<CapitalMode>("Adaptive Growth");
  const [observedCoin, setObservedCoin] = useState<Coin | null>(null);

  /* ---------------- UI CONTEXT ---------------- */
  const [search, setSearch] = useState<string>("");
  const [risk, setRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [timeframe, setTimeframe] = useState<"all" | "scalp" | "long">("all");

  /* ---------------- AI CONTEXT METRIC ---------------- */
  const [heroProfit, setHeroProfit] = useState<number>(0);

  /* ---------------- AI BOOT SEQUENCE ---------------- */
  useEffect(() => {
    const boot = setTimeout(() => {
      setSystemMode("active");
      console.log("NEURAL_ENGINE: Trade State Synchronized");
    }, 1200);
    return () => clearTimeout(boot);
  }, []);

  /* ---------------- CAPITAL MODE EFFECT ---------------- */
  useEffect(() => {
    // Mapping nilai berdasarkan CapitalMode yang sudah sinkron
    const baseValues: Record<string, number> = {
      "Preservation": 820000,
      "Adaptive Growth": 1120000,
      "Aggressive": 1460000, // PERBAIKAN: Nama disesuaikan dengan global
      "Aggressive Expansion": 1460000
    };
    
    const base = baseValues[capitalMode] || 1000000;
    setHeroProfit(base + Math.floor(Math.random() * 5000));
  }, [capitalMode]);

  /* ---------------- OBSERVATION EFFECT ---------------- */
  useEffect(() => {
    if (!observedCoin) return;
    
    const drift = setInterval(() => {
      setHeroProfit(prev => prev + (Math.random() > 0.5 ? 12 : -8));
    }, 3000);

    return () => clearInterval(drift);
  }, [observedCoin]);

  /* ---------------- EXECUTION RITUAL ---------------- */
  const unlockExecution = useCallback(() => {
    setExecutionUnlocked(true);
  }, []);

  return {
    systemMode,
    setSystemMode,
    executionUnlocked,
    unlockExecution,
    capitalMode,
    setCapitalMode,
    observedCoin,
    setObservedCoin,
    search,
    setSearch,
    risk,
    setRisk,
    timeframe,
    setTimeframe,
    heroProfit,
  };
}