// C:\ai_trading\app\trade\components\TrendCalculator.tsx

"use client";

import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";

// Fallback interface jika lib belum sinkron
interface Coin {
  symbol: string;
  name: string;
  price?: number;
}

interface TrendCalculatorProps {
  coins: Coin[];
  predictions?: Record<string, {
    trend: "bullish" | "bearish";
    trendConfidence: number; // 0 to 1
    signal: "BUY" | "SELL" | "HOLD";
  }>;
}

export function TrendCalculator({ coins, predictions = {} }: TrendCalculatorProps) {
  const trendCards = useMemo(() => {
    if (!coins.length) return (
      <div className="col-span-full py-4 text-center text-[10px] text-gray-600 font-mono tracking-widest">
        NO_ASSETS_DETECTED_IN_SCOPE
      </div>
    );

    return coins.map((coin) => {
      const pred = predictions[coin.symbol];
      const isBullish = pred?.trend === "bullish";
      const isBearish = pred?.trend === "bearish";
      
      const themeColor = isBullish ? "text-neon-green" : isBearish ? "text-neon-pink" : "text-gray-400";
      const themeBg = isBullish ? "bg-neon-green" : isBearish ? "bg-neon-pink" : "bg-gray-500";
      const themeGlow = isBullish ? "shadow-[0_0_10px_rgba(34,255,136,0.2)]" : isBearish ? "shadow-[0_0_10px_rgba(255,0,128,0.2)]" : "";

      return (
        <div
          key={coin.symbol}
          className="relative group p-4 rounded-xl border border-white/[0.03] bg-black/40 hover:border-white/10 transition-all duration-300"
        >
          {/* Header: Asset & Trend Icon */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h5 className="text-[11px] font-bold text-white leading-none">{coin.name}</h5>
              <span className="text-[9px] font-mono text-gray-600 uppercase">{coin.symbol}</span>
            </div>
            <div className={`p-1.5 rounded-lg bg-white/[0.02] ${themeColor}`}>
              {isBullish ? <TrendingUp size={14} /> : isBearish ? <TrendingDown size={14} /> : <Minus size={14} />}
            </div>
          </div>

          {/* Stats: Price & Signal */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.02]">
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Market Price</p>
              <p className="text-[11px] font-mono font-bold text-white">
                ${coin.price?.toLocaleString() || "0.00"}
              </p>
            </div>
            <div className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.02]">
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">AI Signal</p>
              <p className={`text-[11px] font-bold ${themeColor}`}>
                {pred?.signal || "WAIT"}
              </p>
            </div>
          </div>

          {/* Confidence Indicator */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-600">
              <span className="flex items-center gap-1"><Target size={8} /> Confidence</span>
              <span className={themeColor}>{Math.round((pred?.trendConfidence || 0) * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${themeBg} ${themeGlow}`}
                style={{ width: `${(pred?.trendConfidence ?? 0) * 100}%` }}
              />
            </div>
          </div>

          {/* Background Highlight on Hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none rounded-xl ${themeBg}`} />
        </div>
      );
    });
  }, [coins, predictions]);

  return (
    <div className="trend-calculator grid grid-cols-1 md:grid-cols-2 gap-3">
      {trendCards}
    </div>
  );
}