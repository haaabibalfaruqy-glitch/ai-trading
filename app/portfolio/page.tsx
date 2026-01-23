// app/portfolio/page.tsx

"use client";

import React from "react";
// PERBAIKAN: Mengganti 'barChart as BarChart' menjadi 'BarChart' yang benar
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  BarChart, 
  Globe 
} from "lucide-react";
import HeroVisual from "@/app/Shared/HeroVisual";
import HeroStats from "@/app/Shared/HeroStats";

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-[#070B14] text-white">
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
        
        {/* HEADER SECTION */}
        <div className="mb-12">
          <HeroVisual 
            title="Asset Intelligence"
            subtitle="Global Portfolio Overview"
            description="Detailed breakdown of your neural-managed assets, equity growth curves, and cross-chain liquidity distribution."
          />
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">Net Liquidity Value</p>
              <h2 className="text-5xl font-black text-white mb-6">$142,080.45</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-green/10 text-neon-green text-xs font-bold">
                  <ArrowUpRight size={14} /> +12.5% <span className="text-[10px] opacity-60 ml-1">MTD</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-gray-400 text-xs font-bold font-mono">
                  EST_DAILY_YIELD: ~$124.00
                </div>
              </div>
            </div>
            {/* Background Icon Decor */}
            <Wallet size={180} className="absolute -bottom-10 -right-10 text-white/[0.02] group-hover:text-neon-green/[0.03] transition-colors duration-700" />
          </div>

          {/* Secondary Stats Cluster */}
          <div className="grid grid-cols-1 gap-6">
            <div className="p-6 rounded-[2rem] bg-black/40 border border-white/[0.05] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Deposits</p>
                <p className="text-xl font-mono font-bold text-white">$98,500.00</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Globe size={20} /></div>
            </div>
            <div className="p-6 rounded-[2rem] bg-black/40 border border-white/[0.05] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">AI Performance Score</p>
                <p className="text-xl font-mono font-bold text-neon-green">94.2/100</p>
              </div>
              {/* PERBAIKAN: Memanggil BarChart dengan benar */}
              <div className="p-3 rounded-xl bg-neon-green/10 text-neon-green"><BarChart size={20} /></div>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Charts & Allocation */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Equity Growth Placeholder */}
          <div className="p-8 rounded-[2.5rem] bg-[#0C1322] border border-white/[0.05] min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              {/* PERBAIKAN: Memanggil BarChart dengan benar */}
              <h3 className="font-bold flex items-center gap-2"><BarChart size={18} className="text-neon-green" /> Equity Growth</h3>
              <select className="bg-black/40 border border-white/10 rounded-lg text-[10px] px-3 py-1 text-gray-400 font-bold focus:outline-none">
                <option>LAST_30_DAYS</option>
                <option>ALL_TIME</option>
              </select>
            </div>
            <div className="h-64 w-full flex items-center justify-center border border-dashed border-white/5 rounded-3xl text-gray-700 font-mono text-xs uppercase tracking-widest">
              [ Equity_Curve_Module_Loading... ]
            </div>
          </div>

          {/* Asset Allocation Placeholder */}
          <div className="p-8 rounded-[2.5rem] bg-[#0C1322] border border-white/[0.05] min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold flex items-center gap-2"><PieChart size={18} className="text-blue-400" /> Asset Distribution</h3>
              <span className="text-[10px] text-gray-600 font-mono">DIVERSIFICATION: HIGH</span>
            </div>
            <div className="space-y-6">
              {[
                { label: "Bitcoin (BTC)", value: 64, color: "bg-[#F7931A]" },
                { label: "Ethereum (ETH)", value: 22, color: "bg-[#627EEA]" },
                { label: "Stablecoins (USDT)", value: 14, color: "bg-[#26A17B]" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-tighter">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8">
          <HeroStats 
            totalProfit="$14,250.00" 
            activeUsers={1240} 
            accuracy="94.2%" 
          />
        </div>

      </main>
    </div>
  );
}