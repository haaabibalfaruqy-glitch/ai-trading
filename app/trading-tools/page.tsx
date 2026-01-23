// app/trading-tools/page.tsx
"use client";

import React from "react";
import TradeSimulator from "./components/TradeSimulator";
import TrustBar from "./components/TrustBar";
import { Wrench, Cpu, Zap } from "lucide-react"; // FIX: Capitalize 'Cpu'

export default function TradingToolsPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <Wrench size={12} /> Optimization Suite
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Strategic Tools</h1>
        </div>

        <TradeSimulator />
        <TrustBar />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-neon-green/10 to-transparent border border-neon-green/20">
            <Zap className="text-neon-green mb-4" />
            <h4 className="text-lg font-bold mb-2">Backtest Engine</h4>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
            {/* FIX: Menggunakan icon Cpu yang benar */}
            <Cpu className="text-blue-400 mb-4" />
            <h4 className="text-lg font-bold mb-2">API Integrator</h4>
          </div>
        </div>
      </div>
    </main>
  );
}