// /app/Shared/MarketTicker.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

interface TickerItem {
  pair: string;
  change: number;
}

const BASE_ITEMS: TickerItem[] = [
  { pair: "BTC/USDT", change: 1.83 },
  { pair: "ETH/USDT", change: 0.95 },
  { pair: "SOL/USDT", change: 3.12 },
  { pair: "BNB/USDT", change: -0.41 },
  { pair: "XRP/USDT", change: 2.27 },
  { pair: "ADA/USDT", change: -1.01 },
  { pair: "LINK/USDT", change: 4.50 },
  { pair: "DOT/USDT", change: -0.15 },
];

export default function MarketTicker() {
  const [data, setData] = useState<TickerItem[]>(BASE_ITEMS);

  // 🔹 Realtime micro-simulation
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev =>
        prev.map(item => ({
          ...item,
          change: +(item.change + (Math.random() - 0.5) * 0.1).toFixed(2), 
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Triple data for super-smooth seamless loop
  const items = useMemo(() => [...data, ...data, ...data], [data]);

  return (
    <div className="group relative py-4 border-y border-white/[0.03] bg-black/20 backdrop-blur-sm overflow-hidden w-full">
      {/* Glossy Edge Fading Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0F18] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0F18] to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="flex gap-8 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused]">
        {items.map((item, i) => {
          const isBull = item.change >= 0;
          
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] transition-all hover:bg-white/[0.05] hover:border-white/[0.1]"
            >
              <span className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">
                {item.pair}
              </span>
              <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
                isBull ? "text-neon-green" : "text-neon-pink"
              }`}>
                <span className={`w-1 h-1 rounded-full ${isBull ? "bg-neon-green animate-pulse" : "bg-neon-pink"}`} />
                {isBull ? "+" : ""}{item.change.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker {
          display: inline-flex;
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}