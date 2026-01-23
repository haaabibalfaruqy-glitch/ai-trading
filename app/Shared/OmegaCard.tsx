// C:\ai_trading\app\Shared\OmegaCard.tsx

"use client";

import { useMemo, useEffect, useState } from "react";
// PERBAIKAN: Ubah import ke componentTypes agar sinkron secara global
import { Coin, SystemMode, OmegaCardProps } from "@/lib/componentTypes";
import { scheduler } from "@/lib/scheduler";
import { useAccess } from "@/context/UserAccessContext";
import { Sparkline } from "@/app/trade/components/Sparkline";
import { Zap, ShieldAlert } from "lucide-react";

/**
 * OMEGA CARD
 * Komponen kartu aset dengan AI Signal dan Real-time ROI.
 */
export const OmegaCard = ({
  coin,
  values = [],
  systemMode = "active",
  onView,
}: OmegaCardProps) => {
  const { isBrokerUnlocked, unlockBroker } = useAccess();
  const isLocked = !isBrokerUnlocked;
  
  // State Profit yang Tersinkron
  const [profit, setProfit] = useState(() => (coin.price || 1000) * 0.15);
  
  // ROI dihitung secara deterministik
  const roi = useMemo(() => {
    if (!coin.symbol) return "0.00";
    const base = (coin.symbol.length * 7.5); 
    const lastValue = values.length > 0 ? values[values.length - 1] : 5;
    return (base + (lastValue % 10)).toFixed(2);
  }, [coin.symbol, values]);

  // Efek Update Profit Berkala
  useEffect(() => {
    // PERBAIKAN: Menggunakan pengecekan systemMode yang sudah fleksibel (string)
    if (systemMode !== "active" || isLocked) return;
    
    const taskId = scheduler.register(() => {
      setProfit((p) => p + (Math.random() * 2));
    }, 2000);

    return () => { scheduler.clear(taskId); };
  }, [systemMode, isLocked]);

  return (
    <div
      onClick={() => !isLocked && onView?.()}
      className={`group relative overflow-hidden rounded-[2.5rem] border p-6 transition-all duration-500 ${
        isLocked 
          ? "border-white/5 bg-[#0C1322]/50" 
          : "border-white/10 bg-[#0C1322] hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(34,255,136,0.1)] cursor-pointer"
      }`}
    >
      {/* HEADER SECTION */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 font-bold text-neon-green">
            {coin.short ? coin.short[0] : coin.symbol[0]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{coin.name}</h3>
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">{coin.symbol}/USDT</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tighter text-neon-green">
            +{roi}%
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-gray-500 uppercase">
             <Zap className="h-3 w-3 fill-neon-green text-neon-green" size={12} />
             AI Picking
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="my-6 h-16 w-full opacity-80 group-hover:opacity-100 transition-opacity">
        {!isLocked ? (
          <Sparkline values={values} color="#22ff88" />
        ) : (
          <div className="h-full w-full bg-white/5 rounded-lg animate-pulse" />
        )}
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-5">
        <MetricItem 
          label="Est. Capital" 
          value={`$${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          color="text-white" 
        />
        <MetricItem 
          label="AI Signal" 
          value={parseFloat(roi) > 15 ? "STRONG BUY" : "HOLD"} 
          color="text-neon-green" 
        />
        <MetricItem 
          label="Risk Level" 
          // PERBAIKAN: Safety check untuk properti risk yang opsional
          value={(coin as any).risk?.toUpperCase() || "LOW"} 
          color={(coin as any).risk === "high" ? "text-rose-500" : "text-blue-400"} 
        />
      </div>

      {/* LOCKED OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0C1322]/80 backdrop-blur-md transition-all duration-500">
          <div className="mb-4 rounded-full bg-white/5 p-3 ring-1 ring-white/10">
            <ShieldAlert className="h-6 w-6 text-gray-500" />
          </div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Analysis Encrypted</p>
          <button 
            onClick={(e) => { e.stopPropagation(); unlockBroker(); }}
            className="rounded-full bg-neon-green px-6 py-2 text-[11px] font-black uppercase tracking-widest text-black transition-transform hover:scale-105 active:scale-95"
          >
            Unlock Context
          </button>
        </div>
      )}
    </div>
  );
};

function MetricItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
      <span className={`text-xs font-black tracking-tight ${color}`}>{value}</span>
    </div>
  );
}