"use client";

import React, { useEffect, useState } from "react";
import BehaviorAnalysis from "./components/BehaviorAnalysis";
import AITimeline from "./components/AITimeline";
import GovernancePanel from "./components/GovernancePanel";
import { BrainCircuit, History } from "lucide-react";
import { useTradeState } from "@/app/trade/hooks/useTradeState";

export default function AnalyticsPage() {
  const { capitalMode, setCapitalMode } = useTradeState();
  const [mounted, setMounted] = useState(false);

  // Mencegah hydration mismatch pada elemen dinamis (bar chart)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#070B14]" />;

  return (
    <main className="min-h-screen bg-[#070B14] text-white p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#22ff88]">
            <BrainCircuit size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Neural Intelligence Report</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Market Analytics</h1>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Safe observedCoin pass */}
            <BehaviorAnalysis observedCoin="BTC" />
            <AITimeline />
          </div>
          
          <div className="space-y-8">
            <GovernancePanel 
              capitalMode={capitalMode || "Conservative"} 
              riskAppetite="Moderate" 
              setCapitalMode={setCapitalMode} 
            />

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                <History size={16} /> Session Depth
              </h3>
              <div className="h-40 flex items-end justify-between gap-2 px-2">
                {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-[#22ff88]/20 rounded-t-lg transition-all hover:bg-[#22ff88]/50" 
                    style={{ height: `${h}%` }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}