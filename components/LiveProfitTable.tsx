"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAccess } from "@/context/UserAccessContext";
import ProfitTableSkeleton from "./ProfitTableSkeleton";
import { ChevronUp, ChevronDown, Lock } from "lucide-react";

export interface ProfitRecord {
  id: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
  status: "open" | "closed";
  timestamp: number;
  riskLevel: "low" | "medium" | "high";
}

type SortKey = keyof ProfitRecord;
type SortOrder = "asc" | "desc";

export interface LiveProfitTableProps {
  enabled?: boolean;
  onRefresh?: () => void;
}

export default function LiveProfitTable({ enabled = true, onRefresh }: LiveProfitTableProps) {
  const { access } = useAccess();
  const isLocked = access === "guest";

  // State management
  const [data, setData] = useState<ProfitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("profit");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all");
  const [filterRisk, setFilterRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  // Generate mock data for demo
  const generateMockData = useCallback(() => {
    const symbols = ["BTC", "ETH", "DOGE", "XRP", "SOL"];
    return symbols.map((symbol, idx) => ({
      id: `${symbol}-${idx}`,
      symbol,
      entryPrice: Math.random() * 50000 + 10000,
      currentPrice: Math.random() * 50000 + 10000,
      quantity: Math.floor(Math.random() * 10) + 0.5,
      profit: Math.floor(Math.random() * 5000 - 2000),
      profitPercent: Math.random() * 40 - 10,
      status: (Math.random() > 0.3 ? "open" : "closed") as "open" | "closed",
      timestamp: Date.now() - Math.random() * 86400000,
      riskLevel: (["low", "medium", "high"] as const)[Math.floor(Math.random() * 3)],
    }));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (isLocked) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLocked, generateMockData]);

  // Real-time value updates with animation
  useEffect(() => {
    if (isLocked || data.length === 0) return;

    const updateInterval = setInterval(() => {
      setData((prevData) =>
        prevData.map((record) => {
          const newPrice = record.currentPrice * (1 + (Math.random() - 0.5) * 0.02);
          const newProfit = (newPrice - record.entryPrice) * record.quantity;
          const newProfitPercent = ((newPrice - record.entryPrice) / record.entryPrice) * 100;

          // Trigger animation
          if (record.id && !animatingIds.has(record.id)) {
            setAnimatingIds((prev) => new Set(prev).add(record.id));
            setTimeout(() => {
              setAnimatingIds((prev) => {
                const next = new Set(prev);
                next.delete(record.id);
                return next;
              });
            }, 500);
          }

          return {
            ...record,
            currentPrice: newPrice,
            profit: Math.floor(newProfit),
            profitPercent: Math.round(newProfitPercent * 100) / 100,
          };
        })
      );
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(updateInterval);
  }, [isLocked, data.length, animatingIds]);

  // Sorting logic
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // Filtering and sorting
  const filteredData = useMemo(() => {
    let result = [...data];

    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }

    if (filterRisk !== "all") {
      result = result.filter((r) => r.riskLevel === filterRisk);
    }

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [data, sortKey, sortOrder, filterStatus, filterRisk]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProfit = data.reduce((sum, r) => sum + r.profit, 0);
    const winCount = data.filter((r) => r.profit > 0).length;
    const lossCount = data.filter((r) => r.profit < 0).length;
    const winRate = data.length > 0 ? (winCount / data.length) * 100 : 0;

    return { totalProfit, winCount, lossCount, winRate };
  }, [data]);

  if (!enabled) return null;

  // Locked overlay
  if (isLocked) {
    return (
      <div className="w-full bg-[#0B0F18] border border-[#1F2937] rounded-xl p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-xl">
          <Lock className="w-12 h-12 text-gray-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Profit Table Locked</h3>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            Connect a broker to unlock real-time profit tracking and performance analytics
          </p>
        </div>

        <div className="opacity-30 pointer-events-none">
          <div className="h-6 bg-[#1F2937] rounded-lg w-48 mb-4" />
          <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[#1F2937]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-[#1F2937] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <ProfitTableSkeleton />;
  }

  return (
    <div className="w-full bg-[#0B0F18] border border-[#1F2937] rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Live Profit & Loss</h3>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400">
            {data.length} Positions
          </span>
          <button
            onClick={onRefresh}
            className="px-2 py-1 text-xs rounded-lg bg-[#1F2937] hover:bg-[#2A3847] text-gray-300 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-1 text-xs bg-[#1F2937] border border-[#2A3847] rounded-lg text-gray-300 cursor-pointer hover:border-[#22ff88]/30 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value as any)}
          className="px-3 py-1 text-xs bg-[#1F2937] border border-[#2A3847] rounded-lg text-gray-300 cursor-pointer hover:border-[#22ff88]/30 transition-colors"
        >
          <option value="all">All Risk</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2 mb-4 text-[11px]">
        <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
          <div className="text-[#9ca3af]">Total P&L</div>
          <div className={`font-bold ${stats.totalProfit >= 0 ? "text-[#22ff88]" : "text-[#ff5577]"}`}>
            +${stats.totalProfit.toLocaleString()}
          </div>
        </div>
        <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
          <div className="text-[#9ca3af]">Wins</div>
          <div className="font-bold text-[#22ff88]">{stats.winCount}</div>
        </div>
        <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
          <div className="text-[#9ca3af]">Losses</div>
          <div className="font-bold text-[#ff5577]">{stats.lossCount}</div>
        </div>
        <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
          <div className="text-[#9ca3af]">Win Rate</div>
          <div className="font-bold text-[#fbbf24]">{stats.winRate.toFixed(0)}%</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[#1F2937]">
              {[
                { key: "symbol", label: "Symbol" },
                { key: "quantity", label: "Qty" },
                { key: "entryPrice", label: "Entry" },
                { key: "currentPrice", label: "Current" },
                { key: "profitPercent", label: "%", },
                { key: "profit", label: "P&L" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-3 py-2 text-left font-semibold text-gray-400 cursor-pointer hover:text-[#22ff88] transition-colors"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortKey === key && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record) => (
                <tr
                  key={record.id}
                  className={`border-b border-[#1F2937] hover:bg-[#1a2a3a]/20 transition-all ${
                    animatingIds.has(record.id) ? "animate-pulse" : ""
                  }`}
                >
                  <td className="px-3 py-2 font-semibold text-white">{record.symbol}</td>
                  <td className="px-3 py-2 text-gray-300">{record.quantity.toFixed(3)}</td>
                  <td className="px-3 py-2 text-gray-400">${record.entryPrice.toFixed(2)}</td>
                  <td className={`px-3 py-2 font-semibold ${
                    record.currentPrice >= record.entryPrice ? "text-[#22ff88]" : "text-[#ff5577]"
                  }`}>
                    ${record.currentPrice.toFixed(2)}
                  </td>
                  <td className={`px-3 py-2 font-bold ${
                    record.profitPercent >= 0 ? "text-[#22ff88]" : "text-[#ff5577]"
                  }`}>
                    {record.profitPercent > 0 ? "+" : ""}{record.profitPercent.toFixed(2)}%
                  </td>
                  <td className={`px-3 py-2 font-bold ${
                    record.profit >= 0 ? "text-[#22ff88]" : "text-[#ff5577]"
                  }`}>
                    {record.profit > 0 ? "+" : ""}${record.profit.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  No positions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#1F2937] text-[10px] text-gray-500">
        <p>
          Figures are simulated and for demonstration. Not real trading results. Do not represent realized profit.
        </p>
      </div>
    </div>
  );
}
