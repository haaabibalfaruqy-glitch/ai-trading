// app/trade/components/MarketSentimentAI.tsx

"use client";

import React, { useMemo } from "react";
import { BrainCircuit, Info, MessageSquare, Newspaper, Twitter } from "lucide-react";

export default function MarketSentimentAI() {
  // Simulasi data dari AI Engine
  const sentimentScore = 68; // 0 (Extreme Fear) - 100 (Extreme Greed)
  
  const sentimentData = useMemo(() => {
    if (sentimentScore > 75) return { label: "EXTREME GREED", color: "text-neon-green", bg: "bg-neon-green/20" };
    if (sentimentScore > 55) return { label: "GREED", color: "text-emerald-400", bg: "bg-emerald-400/20" };
    if (sentimentScore > 45) return { label: "NEUTRAL", color: "text-gray-400", bg: "bg-gray-400/20" };
    if (sentimentScore > 25) return { label: "FEAR", color: "text-neon-pink", bg: "bg-neon-pink/20" };
    return { label: "EXTREME FEAR", color: "text-red-600", bg: "bg-red-600/20" };
  }, [sentimentScore]);

  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon-green/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Market Sentiment AI</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Behavioral Pattern Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Gauge Visualization */}
        <div className="relative flex flex-col items-center">
          <svg className="w-48 h-24" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#1F2937"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#sentimentGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 - (125.6 * sentimentScore) / 100}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2244" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#22ff88" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="text-center -mt-4">
            <p className={`text-2xl font-black font-mono ${sentimentData.color}`}>
              {sentimentScore}
            </p>
            <p className={`text-[10px] font-bold tracking-[0.2em] ${sentimentData.color}`}>
              {sentimentData.label}
            </p>
          </div>
        </div>

        {/* AI Key Insights Tags */}
        <div className="space-y-4">
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <Info size={12} className="text-neon-green" /> Analysis Hot-Spots
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Twitter size={10} />, tag: "Bullish Tweets ↑", color: "border-blue-500/30 text-blue-400" },
              { icon: <Newspaper size={10} />, tag: "Institutional Inflow", color: "border-neon-green/30 text-neon-green" },
              { icon: <MessageSquare size={10} />, tag: "Whale Alert 🐋", color: "border-purple-500/30 text-purple-400" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/[0.02] text-[10px] font-medium ${item.color}`}>
                {item.icon}
                {item.tag}
              </div>
            ))}
          </div>
          
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.03]">
            <p className="text-[10px] text-gray-400 leading-relaxed italic">
              "AI suggests a temporary local top as retail greed enters the 70-score zone. High probability of a healthy correction before further expansion."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}