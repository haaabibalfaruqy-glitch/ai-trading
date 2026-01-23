// C:\ai_trading\app\Shared\HeroStats.tsx

"use client";

import React from "react";
import { TrendingUp, Cpu, ShieldCheck, Activity, Target, Zap } from "lucide-react";
// PERBAIKAN: Import interface global
import { HeroStatsProps } from "@/lib/componentTypes";

/**
 * HERO STATS (Command Center)
 * Sekarang menerima props: totalProfit, activeUsers, accuracy
 */
const HeroStats = React.memo(({ totalProfit, activeUsers, accuracy }: HeroStatsProps) => {
  const systemMode = "LIVE";

  const StatCard = ({ icon: Icon, label, value, desc, colorClass, highlight = false }: any) => (
    <div className={`
      relative overflow-hidden rounded-[1.5rem] border border-white/[0.05] bg-[#0C1322] p-5
      transition-all duration-500 hover:border-white/10 group
      ${highlight ? `shadow-[0_0_30px_-10px_rgba(34,255,136,0.15)]` : ""}
    `}>
      <Icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.02] -rotate-12 transition-transform group-hover:scale-110" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-lg bg-white/[0.03] ${colorClass}`}>
            <Icon size={16} />
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            {label}
          </span>
        </div>
        
        <div className="flex items-end gap-2">
          <h3 className={`text-2xl font-mono font-black tracking-tighter ${colorClass || "text-white"}`}>
            {value}
          </h3>
          {highlight && (
            <div className="mb-1.5 flex gap-0.5">
              <span className="w-1 h-3 bg-neon-green/20 rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-neon-green/40 rounded-full animate-pulse [animation-delay:0.2s]" />
              <span className="w-1 h-3 bg-neon-green/60 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          )}
        </div>
        
        <p className="text-[10px] text-gray-500 mt-2 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* TOTAL PROFIT - Sekarang menggunakan data asli dari props */}
      <StatCard 
        icon={Target}
        label="Total Realized Profit"
        value={totalProfit}
        desc="Net cumulative gains across all trading pairs."
        colorClass="text-neon-green"
        highlight={true}
      />

      {/* ACTIVE NODES / USERS */}
      <StatCard 
        icon={Activity}
        label="Active Neural Nodes"
        value={activeUsers.toLocaleString()}
        desc="Distributed computing clusters processing trades."
        colorClass="text-blue-400"
      />

      {/* AI ACCURACY */}
      <StatCard 
        icon={Zap}
        label="Model Accuracy"
        value={accuracy}
        desc="Probability of successful pattern prediction."
        colorClass="text-amber-400"
      />
    </section>
  );
});

HeroStats.displayName = "HeroStats";

export default HeroStats;