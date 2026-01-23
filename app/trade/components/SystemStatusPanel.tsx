// C:\ai_trading\app\trade\components\SystemStatusPanel.tsx

"use client";

import React from "react";
import { TrendCalculator } from "@/app/trade/components/TrendCalculator";
import { ShieldCheck, Zap, Activity, Globe } from "lucide-react";

// Local types definition (menghindari error import jika lib belum sinkron)
export type SystemMode = "active" | "idle" | "error";
export type CapitalMode = "Preservation" | "Adaptive Growth" | "Aggressive Expansion";

interface SystemStatusPanelProps {
  systemMode: SystemMode;
  capitalMode: CapitalMode;
  coins?: any[];
  volatility?: number;
}

export default function SystemStatusPanel({
  systemMode,
  capitalMode,
  coins = [],
  volatility = 0,
}: SystemStatusPanelProps) {
  
  const modeThemes = {
    active: { 
      color: "text-neon-green", 
      bg: "bg-neon-green", 
      glow: "shadow-[0_0_15px_rgba(34,255,136,0.4)]",
      label: "System Nominal"
    },
    idle: { 
      color: "text-amber-400", 
      bg: "bg-amber-400", 
      glow: "shadow-[0_0_15px_rgba(251,191,36,0.4)]",
      label: "Standby Mode"
    },
    error: { 
      color: "text-neon-pink", 
      bg: "bg-neon-pink", 
      glow: "shadow-[0_0_15px_rgba(255,0,128,0.4)]",
      label: "Link Severed"
    },
  };

  const currentTheme = modeThemes[systemMode] || modeThemes.idle;

  return (
    <div className="relative group overflow-hidden rounded-[2rem] bg-[#0C1322] border border-white/[0.05] p-6 transition-all duration-500 hover:border-neon-green/30 shadow-2xl">
      {/* HUD Background Decorator */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <Activity size={80} />
      </div>

      {/* HEADER: System Pulse */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-neon-green" />
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Core Infrastructure
            </h4>
          </div>
          <p className="text-lg font-black text-white tracking-tight leading-none">
            {currentTheme.label}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] ${currentTheme.glow}`}>
            <span className={`w-2 h-2 rounded-full ${currentTheme.bg} ${systemMode === 'active' ? 'animate-pulse' : ''}`} />
            <span className={`text-[10px] font-mono font-bold uppercase ${currentTheme.color}`}>
              {systemMode}
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-600 mt-1">LATENCY: 12ms</span>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-white/[0.03]">
        <div className="space-y-1">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter flex items-center gap-1">
            <Zap size={10} /> Strategy Profile
          </p>
          <p className="text-xs font-bold text-white/90">{capitalMode}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter flex items-center justify-end gap-1">
            Global Index <Globe size={10} />
          </p>
          <p className={`text-xs font-mono font-bold ${volatility > 5 ? 'text-neon-pink' : 'text-neon-green'}`}>
            {volatility.toFixed(2)}% <span className="text-gray-500 text-[9px]">VOL</span>
          </p>
        </div>
      </div>

      {/* TREND CALCULATOR SECTION */}
      <div className="relative p-1 rounded-2xl bg-black/40 border border-white/[0.05] overflow-hidden group-hover:border-neon-green/20 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />
        <TrendCalculator coins={coins} />
      </div>

      {/* FOOTER: Integrity Bar */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-neon-green w-[88%] animate-shimmer" />
        </div>
        <span className="text-[8px] font-mono text-gray-600">88% SYNC</span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(150%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </div>
  );
}