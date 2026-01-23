// app/trade/[id]/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Zap, Shield, Target, Activity } from "lucide-react";

// Komponen dari folder Shared & Trade
import MarketChartPanel from "@/app/Shared/MarketChartPanel";
import OrderTerminal from "@/app/trade/components/OrderTerminal";
import PositionTracker from "@/app/trade/components/PositionTracker";
import MarketSentimentAI from "@/app/trade/components/MarketSentimentAI";
import { useTradeState } from "@/app/trade/hooks/useTradeState";

// FIX IMPORT: Arahkan ke folder analytics/components karena di sana letak filenya
import BehaviorAnalysis from "@/app/analytics/components/BehaviorAnalysis";
import AITimeline from "@/app/analytics/components/AITimeline";
import GovernancePanel from "@/app/analytics/components/GovernancePanel";

export default function CoinDetailTerminal() {
  const params = useParams();
  const router = useRouter();
  const { systemMode, capitalMode, setCapitalMode } = useTradeState();
  
  const coinId = typeof params?.id === "string" ? params.id.toUpperCase() : "BTC";

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-4 lg:p-8">
      {/* Top Nav */}
      <div className="max-w-[1600px] mx-auto flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest">Back to Matrix</span>
        </button>

        <div className="flex items-center gap-3 bg-neon-green/10 border border-neon-green/20 px-4 py-2 rounded-2xl">
          <Activity size={16} className="text-neon-green animate-pulse" />
          <span className="text-neon-green font-black font-mono tracking-tighter">{coinId}/USDT</span>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Kolom Kiri */}
        <div className="xl:col-span-3 space-y-6">
          <MarketSentimentAI />
          <GovernancePanel 
            capitalMode={capitalMode} 
            riskAppetite="Medium" 
            setCapitalMode={setCapitalMode} 
          />
        </div>

        {/* Kolom Tengah */}
        <div className="xl:col-span-6 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-8 min-h-[500px]">
             <MarketChartPanel symbol={coinId} />
          </div>
          <PositionTracker />
          <BehaviorAnalysis observedCoin={coinId} />
        </div>

        {/* Kolom Kanan */}
        <div className="xl:col-span-3">
          <div className="sticky top-8">
            <div className="bg-gradient-to-b from-[#0F172A] to-[#070B14] border border-neon-green/30 rounded-[2.5rem] p-6 shadow-xl">
               <OrderTerminal 
                  selectedCoin={{ symbol: coinId, name: coinId }} 
                  executionUnlocked={true} 
                  onUnlock={() => {}} 
                  capitalMode={capitalMode} 
               />
            </div>
            <div className="mt-6">
               <AITimeline />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}