// app/trade/page.tsx

"use client";

import React from "react";
import TradeDashboard from "@/app/trade/components/TradeDashboard";
import HeroStats from "@/app/Shared/HeroStats";
import HeroVisual from "@/app/Shared/HeroVisual";
import { useTradeState } from "@/app/trade/hooks/useTradeState";

const coins = [
  { symbol: "BTC", name: "Bitcoin", short: "BTC" },
  { symbol: "ETH", name: "Ethereum", short: "ETH" },
  { symbol: "BNB", name: "Binance Coin", short: "BNB" },
  { symbol: "SOL", name: "Solana", short: "SOL" },
  { symbol: "ADA", name: "Cardano", short: "ADA" },
];

export default function TradePage() {
  // Mengambil state pusat dari hook
  const { 
    systemMode, 
    capitalMode, 
    heroProfit 
  } = useTradeState();

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-neon-green/30">
      
      {/* 1. ATMOSPHERIC LAYER (Background Decor) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
        
        {/* 2. HERO SECTION */}
        <div className="mb-10">
          <HeroVisual 
            title="Neural Trading Hub"
            subtitle="AI-Enhanced Market Terminal"
            description="Experience seamless asset management powered by real-time neural analysis. Your gateway to high-frequency insights and automated capital preservation."
          />
        </div>

        {/* 3. CORE STATS: System Vitals */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/[0.05] pb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-neon-green animate-ping" />
                <span className="text-[10px] font-bold text-neon-green uppercase tracking-[0.3em]">Live Matrix Connected</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">
                Total Unrealized <br /> 
                <span className="text-neon-green">
                   +${heroProfit.toLocaleString()}
                </span>
              </h2>
            </div>

            <div className="hidden lg:block text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Prediction Outcome</p>
              <div className="px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-neon-green font-mono font-bold">
                BTC_SWING_CONFIRMED [+12.4%]
              </div>
            </div>
          </div>
          
          {/* PERBAIKAN: Menambahkan props yang dibutuhkan oleh HeroStatsProps */}
          <HeroStats 
            totalProfit={`$${heroProfit.toLocaleString()}`}
            activeUsers={1284}
            accuracy="94.2%"
          />
        </div>

        {/* 4. MAIN INTERFACE: Trade Dashboard */}
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block" />
          
          <TradeDashboard
            coins={coins}
            systemMode={systemMode} // SystemMode sudah otomatis kompatibel sekarang
            capitalMode={capitalMode}
          />
        </div>

      </main>

      <footer className="py-12 px-10 border-t border-white/[0.03] mt-20 text-center">
        <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
          &copy; 2026 Omega AI Trading Ecosystem // Security Protocol v4.2
        </p>
      </footer>
    </div>
  );
}