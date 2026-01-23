// app/trade/components/TradeHistory.tsx

"use client";

import React from "react";
import { History, ExternalLink, Calendar, CheckCircle2, XCircle } from "lucide-react";

interface PastTrade {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  outcome: "WIN" | "LOSS";
  pnl: string;
  pnlPercent: string;
  date: string;
  duration: string;
}

const DUMMY_HISTORY: PastTrade[] = [
  {
    id: "TX-9021",
    symbol: "SOL/USDT",
    type: "LONG",
    outcome: "WIN",
    pnl: "+$420.50",
    pnlPercent: "+12.4%",
    date: "2024-05-20",
    duration: "4h 20m",
  },
  {
    id: "TX-8842",
    symbol: "BTC/USDT",
    type: "SHORT",
    outcome: "LOSS",
    pnl: "-$120.20",
    pnlPercent: "-2.1%",
    date: "2024-05-19",
    duration: "12h 05m",
  },
  {
    id: "TX-7731",
    symbol: "LINK/USDT",
    type: "LONG",
    outcome: "WIN",
    pnl: "+$85.00",
    pnlPercent: "+5.2%",
    date: "2024-05-18",
    duration: "1h 45m",
  },
];

export default function TradeHistory() {
  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-400">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Execution Archive</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Historical Performance Logs</p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-neon-green uppercase tracking-widest hover:underline flex items-center gap-1">
          Export CSV <ExternalLink size={12} />
        </button>
      </div>

      {/* List Section */}
      <div className="p-2">
        <div className="space-y-1">
          {DUMMY_HISTORY.map((trade) => (
            <div 
              key={trade.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/[0.05] group"
            >
              {/* Asset Info */}
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className={`p-2 rounded-lg ${trade.outcome === "WIN" ? "bg-neon-green/10 text-neon-green" : "bg-neon-pink/10 text-neon-pink"}`}>
                  {trade.outcome === "WIN" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm">{trade.symbol}</p>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase">
                      {trade.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-600 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {trade.date}</span>
                    <span className="font-mono">{trade.id}</span>
                  </div>
                </div>
              </div>

              {/* Result Metrics */}
              <div className="flex items-center justify-between sm:justify-end gap-8">
                <div className="text-right sm:text-left">
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Hold Time</p>
                  <p className="text-xs text-gray-300 font-mono">{trade.duration}</p>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className={`text-sm font-black font-mono ${trade.outcome === "WIN" ? "text-neon-green" : "text-neon-pink"}`}>
                    {trade.pnl}
                  </p>
                  <p className={`text-[10px] font-bold ${trade.outcome === "WIN" ? "text-neon-green/50" : "text-neon-pink/50"}`}>
                    {trade.pnlPercent}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State / Footer */}
      <div className="p-4 bg-black/20 border-t border-white/[0.05] text-center">
        <p className="text-[10px] text-gray-600 font-medium italic uppercase tracking-widest">
          End of synchronized records
        </p>
      </div>
    </div>
  );
}