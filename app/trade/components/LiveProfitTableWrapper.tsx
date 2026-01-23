// app/trade/components/LiveProfitTableWrapper.tsx

"use client";

import React, { useMemo } from "react";
import { TrendingUp, DollarSign, Clock } from "lucide-react";

export interface LiveProfitTableWrapperProps {
  profits: number[];
  highlightThreshold?: number;
  maxRows?: number;
}

export default function LiveProfitTableWrapper({
  profits,
  highlightThreshold = 5000, // Default ke angka psikologis yang tinggi
  maxRows = 10,
}: LiveProfitTableWrapperProps) {
  
  const displayedProfits = useMemo(() => {
    return profits.slice(0, maxRows);
  }, [profits, maxRows]);

  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] p-6 shadow-2xl overflow-hidden relative">
      {/* Decorative Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
            <DollarSign size={16} />
          </div>
          <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Neural Profit Stream</h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-gray-600 font-mono">
          <Clock size={10} /> LIVE_FEED
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.03]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-[9px] font-bold text-gray-500 uppercase tracking-widest">Rank</th>
              <th className="px-4 py-3 text-right text-[9px] font-bold text-gray-500 uppercase tracking-widest">Yield Output</th>
              <th className="px-4 py-3 text-right text-[9px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {displayedProfits.map((profit, idx) => {
              const isHigh = profit >= highlightThreshold;
              
              return (
                <tr
                  key={idx}
                  className={`group transition-all duration-500 hover:bg-white/[0.04] ${
                    isHigh ? "bg-neon-green/[0.03]" : ""
                  }`}
                >
                  {/* RANK */}
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono font-bold text-gray-600">
                      #{idx + 1}
                    </span>
                  </td>

                  {/* PROFIT VALUE */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`text-xs font-mono font-black ${
                        isHigh ? "text-neon-green drop-shadow-[0_0_8px_rgba(34,255,136,0.5)]" : "text-gray-300"
                      }`}>
                        +${profit.toLocaleString()}
                      </span>
                      {isHigh && <TrendingUp size={12} className="text-neon-green animate-bounce" />}
                    </div>
                  </td>

                  {/* STATUS LABEL */}
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                      isHigh ? "bg-neon-green text-black" : "bg-white/5 text-gray-500"
                    }`}>
                      {isHigh ? "EXCEPTIONAL" : "NOMINAL"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between items-center text-[9px] font-mono text-gray-600">
        <span>TOTAL_SAMPLES: {profits.length}</span>
        <span className="text-neon-green animate-pulse">● DATA_SYNCHRONIZED</span>
      </div>
    </div>
  );
}