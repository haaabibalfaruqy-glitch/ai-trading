// app/trade/components/PositionTracker.tsx

"use client";

import React, { useMemo } from "react";
import { Activity, XCircle, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface Position {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
}

// Dummy Data untuk visualisasi awal
const DUMMY_POSITIONS: Position[] = [
  { id: "1", symbol: "BTC/USDT", type: "LONG", entryPrice: 64200, currentPrice: 65120, amount: 0.5, leverage: 10 },
  { id: "2", symbol: "ETH/USDT", type: "SHORT", entryPrice: 3450, currentPrice: 3410, amount: 2.4, leverage: 5 },
];

export default function PositionTracker() {
  const positions = useMemo(() => DUMMY_POSITIONS, []);

  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Header Panel */}
      <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green">
            <Activity size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Active Deployments</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time Position Monitoring</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Unrealized PnL</p>
          <p className="text-xl font-mono font-black text-neon-green">+$1,420.12</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset / Mode</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry / Market</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Size / Lev</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">PnL Result</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {positions.map((pos) => {
              const pnlValue = (pos.currentPrice - pos.entryPrice) * (pos.type === "LONG" ? 1 : -1) * pos.amount;
              const pnlPercent = (pnlValue / (pos.entryPrice * pos.amount)) * 100 * pos.leverage;
              const isProfit = pnlValue >= 0;

              return (
                <tr key={pos.id} className="group hover:bg-white/[0.02] transition-colors">
                  {/* Asset */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md text-[10px] font-black ${pos.type === "LONG" ? "bg-neon-green/10 text-neon-green" : "bg-neon-pink/10 text-neon-pink"}`}>
                        {pos.type}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{pos.symbol}</p>
                        <p className="text-[10px] text-gray-600 font-mono">ID: {pos.id}xf92</p>
                      </div>
                    </div>
                  </td>

                  {/* Prices */}
                  <td className="px-6 py-5 font-mono text-xs">
                    <div className="text-gray-400">E: ${pos.entryPrice.toLocaleString()}</div>
                    <div className="text-white font-bold">M: ${pos.currentPrice.toLocaleString()}</div>
                  </td>

                  {/* Size */}
                  <td className="px-6 py-5 font-mono text-xs">
                    <div className="text-white font-bold">{pos.amount} Units</div>
                    <div className="text-gray-500">{pos.leverage}x Isolated</div>
                  </td>

                  {/* PnL */}
                  <td className="px-6 py-5 text-right">
                    <div className={`text-base font-black font-mono ${isProfit ? "text-neon-green" : "text-neon-pink"}`}>
                      {isProfit ? "+" : ""}${Math.abs(pnlValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center justify-end gap-1 text-[11px] font-bold ${isProfit ? "text-neon-green/60" : "text-neon-pink/60"}`}>
                      {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(pnlPercent).toFixed(2)}%
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5 text-center">
                    <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-neon-pink hover:border-neon-pink/30 hover:bg-neon-pink/5 transition-all">
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-black/40 border-t border-white/[0.05] flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-gray-600">
          <Clock size={12} />
          <span>Last Sync: 0.4s ago</span>
        </div>
        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-neon-green w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}