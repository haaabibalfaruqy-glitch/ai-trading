"use client";

import { HeroStatsProps } from "@/lib/componentTypes";

export default function HeroStats({ systemMode, capitalMode }: HeroStatsProps) {
  return (
    <div className="w-full bg-[#0B1220] border border-[#1F2937] rounded-2xl px-5 py-4 shadow-[inset_0_1px_0_#ffffff08] mt-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-widest text-gray-500">Capital Behavior Status</span>
        <span className="flex items-center gap-1 text-[11px] text-[#22ff88]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22ff88] animate-pulse" /> Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[12px]">
        <div className="flex flex-col">
          <span className="text-gray-400">Execution Engine</span>
          <span className="text-white font-semibold">{systemMode === "active" ? "Active" : "Idle"}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Active Behavior Modules</span>
          <span className="text-white font-semibold">284</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Execution Responsiveness</span>
          <span className="text-white font-semibold">&lt; 20ms</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Capital Oversight</span>
          <span className="text-white font-semibold">24/7</span>
        </div>
      </div>
    </div>
  );
}
