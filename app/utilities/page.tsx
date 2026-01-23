"use client";

import React from "react";
import MarketHeatmap from "./components/MarketHeatmap";
import ExecutionGate from "./components/ExecutionGate";
import { Layers, Activity } from "lucide-react";

export default function UtilitiesPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Layers className="text-neon-green" /> System Utilities
            </h1>
            <p className="text-gray-500 text-xs mt-1 font-mono">NODE_OPERATOR_V4 // GLOBAL_MARKET_HEAT</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
             <div className="flex flex-col px-4 border-r border-white/10">
               <span className="text-[8px] text-gray-500 uppercase">Latency</span>
               <span className="text-xs font-mono text-neon-green">14ms</span>
             </div>
             <Activity size={20} className="text-neon-green mx-2" />
          </div>
        </div>

        <div className="space-y-8">
          <MarketHeatmap />
          <div className="max-w-md">
            <ExecutionGate />
          </div>
        </div>
      </div>
    </main>
  );
}