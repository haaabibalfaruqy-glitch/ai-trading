// app/trade/components/PatternRecognition.tsx

"use client";

import React from "react";
import { Scan, ChevronRight, Triangle, Square, Activity, AlertCircle } from "lucide-react";

interface Pattern {
  id: string;
  name: string;
  type: "BULLISH" | "BEARISH";
  confidence: number;
  status: "FORMING" | "BREAKOUT";
  timeframe: string;
}

const DETECTED_PATTERNS: Pattern[] = [
  { id: "p1", name: "Double Bottom", type: "BULLISH", confidence: 0.88, status: "BREAKOUT", timeframe: "1H" },
  { id: "p2", name: "Descending Triangle", type: "BEARISH", confidence: 0.72, status: "FORMING", timeframe: "4H" },
  { id: "p3", name: "Bullish Flag", type: "BULLISH", confidence: 0.94, status: "BREAKOUT", timeframe: "15M" },
];

export default function PatternRecognition() {
  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Scan size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Pattern Recognition</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Automated Structure Analysis</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-mono text-gray-400">
          SCANNING_LIVE...
        </div>
      </div>

      {/* Pattern Grid */}
      <div className="space-y-3">
        {DETECTED_PATTERNS.map((pattern) => {
          const isBullish = pattern.type === "BULLISH";
          const themeColor = isBullish ? "text-neon-green" : "text-neon-pink";
          const themeBg = isBullish ? "bg-neon-green/10" : "bg-neon-pink/10";

          return (
            <div 
              key={pattern.id}
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${themeBg} ${themeColor}`}>
                  {isBullish ? <Triangle size={18} className="rotate-0" /> : <Triangle size={18} className="rotate-180" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{pattern.name}</p>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${pattern.status === 'BREAKOUT' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {pattern.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1 font-mono uppercase tracking-tighter">
                      <Activity size={10} /> {pattern.timeframe}
                    </span>
                    <span>Confidence: {Math.round(pattern.confidence * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${themeColor}`}>
                    {pattern.type}
                  </p>
                  <div className="h-1 w-16 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full ${isBullish ? 'bg-neon-green' : 'bg-neon-pink'}`}
                      style={{ width: `${pattern.confidence * 100}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Footer */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-400/5 border border-amber-400/10">
        <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Patterns are probabilistic. AI detection works best when combined with <span className="text-amber-400">Market Sentiment</span> and <span className="text-amber-400">Volume Analysis</span>.
        </p>
      </div>
    </div>
  );
}