// /app/Shared/LiveProfitTable.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccess } from "@/context/UserAccessContext";
import { coins, fetchMarketData } from "@/lib/market"; // Import dari mesin data kita
import ProfitTableSkeleton from "./ProfitTableSkeleton";
import { ChevronUp, ChevronDown, Lock, Activity, RefreshCw } from "lucide-react";

/* ===================== TYPES ===================== */

export interface ProfitRecord {
  id: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
  status: "open" | "closed";
  riskLevel: "low" | "medium" | "high";
}

type SortKey = keyof Pick<ProfitRecord, "symbol" | "quantity" | "entryPrice" | "currentPrice" | "profit" | "profitPercent">;

export default function LiveProfitTable({ enabled = true }: { enabled?: boolean }) {
  const { access, isLoading: accessLoading } = useAccess();
  const isLocked = access === "guest";

  const [data, setData] = useState<ProfitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("profit");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastUpdate, setLastUpdate] = useState<string>("");

  /* ===================== SYNC ENGINE ===================== */

  useEffect(() => {
    if (isLocked || accessLoading) {
      setLoading(false);
      return;
    }

    const syncTableData = async () => {
      // Mengambil data dari lib/market.ts agar sinkron dengan chart
      const updatedRows = await Promise.all(
        coins.map(async (coin, i) => {
          const market = await fetchMarketData(coin.symbol);
          const entry = coin.price * 0.95; // Simulasi entry 5% dibawah harga market
          const qty = (i + 1) * 0.5;
          const profit = (market.latestPrice - entry) * qty;
          
          return {
            id: coin.symbol,
            symbol: coin.symbol,
            entryPrice: entry,
            currentPrice: market.latestPrice,
            quantity: qty,
            profit: Number(profit.toFixed(2)),
            profitPercent: Number(((market.latestPrice - entry) / entry * 100).toFixed(2)),
            status: "open" as const,
            riskLevel: "medium" as const,
          };
        })
      );

      setData(updatedRows);
      setLoading(false);
      setLastUpdate(new Date().toLocaleTimeString());
    };

    syncTableData();
    const interval = setInterval(syncTableData, 3000); // Sinkron setiap 3 detik
    return () => clearInterval(interval);
  }, [isLocked, accessLoading]);

  /* ===================== LOGIC ===================== */

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }, [data, sortKey, sortOrder]);

  const stats = useMemo(() => {
    const total = data.reduce((s, r) => s + r.profit, 0);
    return {
      total,
      winRate: 85, // AI Performance Target
    };
  }, [data]);

  if (!enabled) return null;
  if (loading || accessLoading) return <ProfitTableSkeleton />;

  /* ===================== RENDER ===================== */

  return (
    <div className="group relative w-full bg-[#0B1220]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* GLOW EFFECT */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">AI Execution Engine</h3>
            <p className="text-[10px] text-slate-500 font-medium">Auto-syncing with global markets • {lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Net P&L</p>
          <p className={`text-lg font-black ${stats.total >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
            ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">AI Accuracy</p>
          <p className="text-lg font-black text-blue-400">{stats.winRate}%</p>
        </div>
      </div>

      {/* LOCKED OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0F1C]/60 backdrop-blur-md">
           <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
             <Lock className="w-5 h-5 text-white" />
           </div>
           <p className="text-sm text-white font-bold italic tracking-tighter">DATA STREAM ENCRYPTED</p>
           <button className="mt-4 text-[10px] font-bold text-blue-400 border border-blue-400/30 px-4 py-2 rounded-full hover:bg-blue-400/10 transition-all">
             CONNECT BROKER TO DECRYPT
           </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase tracking-widest font-bold border-b border-white/5">
              <th className="pb-3 px-2">Asset</th>
              <th className="pb-3 px-2">Size</th>
              <th className="pb-3 px-2">Current</th>
              <th className="pb-3 px-2 text-right">Return</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {sortedData.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group/row">
                <td className="py-4 px-2">
                  <span className="font-bold text-white group-hover/row:text-blue-400 transition-colors">{r.symbol}</span>
                </td>
                <td className="py-4 px-2 text-slate-400 font-medium">{r.quantity}</td>
                <td className="py-4 px-2 text-white font-mono">${r.currentPrice.toLocaleString()}</td>
                <td className={`py-4 px-2 text-right font-bold ${r.profit >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                  <div>{r.profitPercent > 0 ? "+" : ""}{r.profitPercent}%</div>
                  <div className="text-[9px] opacity-60">${r.profit.toLocaleString()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}