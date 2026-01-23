// app/trade/components/TradeDashboard.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, LayoutGrid, Info } from "lucide-react";
import { useRouter } from "next/navigation"; // Import router untuk navigasi

// Components
import OmegaCardWrapper from "@/app/trade/components/OmegaCardWrapper";
import SystemStatusPanel from "@/app/trade/components/SystemStatusPanel";
import LoadingTrade from "@/app/trade/loading";
import MarketSentimentAI from "@/app/trade/components/MarketSentimentAI";
import PatternRecognition from "@/app/trade/components/PatternRecognition";

// Types
import { Coin, SystemMode, CapitalMode } from "@/lib/componentTypes";

interface TradeDashboardProps {
  coins?: Coin[];
  systemMode?: SystemMode;
  capitalMode?: CapitalMode;
}

export default function TradeDashboard({
  coins = [],
  systemMode = "active",
  capitalMode = "Adaptive Growth",
}: TradeDashboardProps) {
  const router = useRouter();
  const [liveData, setLiveData] = useState<number[][]>([]);
  const [realSeries, setRealSeries] = useState<number[][]>([]);
  const [search, setSearch] = useState("");

  // 1. Initialize Data Matrix
  useEffect(() => {
    if (coins && coins.length > 0) {
      const initValues = () => Array.from({ length: 30 }, () => 40000 + Math.random() * 5000);
      setLiveData(coins.map(initValues));
      setRealSeries(coins.map(initValues));
    }
  }, [coins]);

  // 2. High-Frequency Streaming Simulation
  useEffect(() => {
    if (!coins || coins.length === 0) return;

    const interval = setInterval(() => {
      setLiveData((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((series) => {
          const last = series[series.length - 1] ?? 40000;
          const volatility = last * 0.002; 
          const nextVal = last + (Math.random() * (volatility * 2) - volatility);
          return [...series.slice(-29), Math.max(nextVal, 0)];
        });
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [coins]);

  // 3. Search Logic
  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [coins, search]);

  // 4. Handle Navigation (Pindah Halaman)
  const handleCoinClick = (coin: Coin) => {
    // Navigasi ke halaman detail koin, misal: /trade/btc
    router.push(`/trade/${coin.symbol.toLowerCase()}`);
  };

  if (!coins || coins.length === 0) return <LoadingTrade />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* SECTION 1: AI ANALYTICS LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketSentimentAI />
        <PatternRecognition />
      </div>

      {/* SECTION 2: SYSTEM HEALTH */}
<SystemStatusPanel 
  systemMode={systemMode as any} 
  capitalMode={capitalMode as any} 
  coins={coins} 
  volatility={1.24} 
/>

      {/* SECTION 3: SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/[0.05] p-4 rounded-[2rem] backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search neural assets..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition-all font-mono text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-white/10">
            <Filter size={18} />
          </button>
          <button className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/20 text-neon-green">
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* SECTION 4: ASSET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoins.length ? (
          filteredCoins.map((coin, idx) => (
            <OmegaCardWrapper
              key={coin.symbol}
              coin={coin}
              idx={idx}
              realSeries={realSeries[idx] ?? []}
              liveData={liveData}
              N={30}
              systemMode={systemMode}
              search={search}
              // TRIGGER: Sekarang memicu navigasi halaman
              onView={() => handleCoinClick(coin)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center py-20 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/10">
            <Info className="text-gray-600 mb-2" size={32} />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No_Assets_In_Registry</p>
          </div>
        )}
      </div>
    </div>
  );
}