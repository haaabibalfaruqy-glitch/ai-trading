"use client";
import { useMemo, useEffect, useState, useCallback } from "react";
import { Coin, SystemMode } from "@/lib/types";
import { scheduler } from "@/lib/scheduler";

const animateNumber = (from: number, to: number, duration: number, onUpdate: (v: number) => void) => {
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * progress;
    onUpdate(value);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

export const OmegaCard = ({ coin, values, search, onView, systemMode }: any) => {
  const roi = (Math.random() * 40 + 1).toFixed(2);
  const [profit, setProfit] = useState(Math.floor(Math.random() * 5000 + 2000));
  const isBullish = Math.random() > 0.5;

  useEffect(() => {
    if (systemMode !== "active") return;
    const id = scheduler.register(() => {
      setProfit(p => p + Math.floor(Math.random() * 120));
    }, 1200 + Math.random() * 800);
    return () => scheduler.clear(id);
  }, [systemMode]);

  return (
    <div className="relative w-full aspect-[16/10] bg-[#0C1322] border border-[#1A2636] rounded-2xl p-6 shadow-[inset_0_1px_0_#ffffff08] transition-all duration-300 ease-out hover:-translate-y-[4px] hover:scale-[1.015] group overflow-hidden will-change-transform">
      {/* ROI */}
      <div className="absolute top-4 right-4 text-right z-10">
        <div className="text-[#22ff88] text-[34px] font-extrabold drop-shadow-[0_0_20px_rgba(34,255,136,0.15)]">
          +{roi}%
        </div>
      </div>

      {/* BUTTON */}
      <button onClick={onView} className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-[12px] font-semibold text-[#22ff88] border border-[#22ff88]/40 hover:bg-[#22ff8820] transition">
        View Behavior
      </button>

      {/* Coin info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#121926] border border-[#1F2C45] flex items-center justify-center text-[#22ff88] font-semibold text-[15px]">
          {coin.short}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-semibold text-[15px]">{coin.name}</span>
          <span className="text-[#6F88A8] text-[11px]">{coin.short}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 pt-4 border-t border-[#1c2b3d] text-center">
        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1">Capital Change</span>
          <span className="text-white text-[16px] font-semibold">+{profit}</span>
        </div>
      </div>
    </div>
  );
};
