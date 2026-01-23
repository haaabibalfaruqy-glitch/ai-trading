// app/portfolio/components/AssetDetailGrid.tsx

"use client";

import React from "react";
import { TrendingUp, TrendingDown, Layers, ArrowRight } from "lucide-react";

interface Asset {
  symbol: string;
  name: string;
  amount: number;
  avgEntry: number;
  currentPrice: number;
  allocation: number;
}

const DUMMY_ASSETS: Asset[] = [
  { symbol: "BTC", name: "Bitcoin", amount: 1.42, avgEntry: 58400, currentPrice: 64205, allocation: 64 },
  { symbol: "ETH", name: "Ethereum", amount: 12.5, avgEntry: 2900, currentPrice: 3450, allocation: 22 },
  { symbol: "SOL", name: "Solana", amount: 150.8, avgEntry: 110, currentPrice: 145.2, allocation: 10 },
  { symbol: "USDT", name: "Tether", amount: 5600, avgEntry: 1, currentPrice: 1, allocation: 4 },
];

export default function AssetDetailGrid() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-neon-green" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detailed Inventory</h3>
        </div>
        <span className="text-[10px] text-gray-600 font-mono italic">Total Assets: {DUMMY_ASSETS.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DUMMY_ASSETS.map((asset) => {
          const totalValue = asset.amount * asset.currentPrice;
          const pnlValue = (asset.currentPrice - asset.avgEntry) * asset.amount;
          const pnlPercent = ((asset.currentPrice - asset.avgEntry) / asset.avgEntry) * 100;
          const isProfit = pnlValue >= 0;

          return (
            <div 
              key={asset.symbol}
              className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-neon-green/30 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              {/* ASSET HEADER */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center font-black text-white group-hover:text-neon-green transition-colors">
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{asset.name}</h4>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
                      {asset.amount.toLocaleString()} {asset.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white font-mono">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-[10px] font-bold text-gray-500">MARKET VALUE</p>
                </div>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-black/20 border border-white/[0.03]">
                  <p className="text-[9px] text-gray-600 font-bold uppercase mb-1">Avg. Entry</p>
                  <p className="text-sm font-mono font-bold text-gray-300">${asset.avgEntry.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/[0.03]">
                  <p className="text-[9px] text-gray-600 font-bold uppercase mb-1">Unrealized PnL</p>
                  <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isProfit ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isProfit ? '+' : ''}{pnlPercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* ALLOCATION BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-600">
                  <span>Portfolio Weight</span>
                  <span className="text-gray-400">{asset.allocation}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-green shadow-[0_0_8px_rgba(34,255,136,0.4)]" 
                    style={{ width: `${asset.allocation}%` }} 
                  />
                </div>
              </div>

              {/* HOVER ACCENT */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} className="text-neon-green" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}