"use client";

import { BehaviorAnalysisProps } from "@/lib/componentTypes";

export default function BehaviorAnalysis({
  observedCoin,
  viralInsight,
  highlightAnalysis,
  shareText,
  slotsLeft,
  setShowExecutionGate,
}: BehaviorAnalysisProps) {
  return (
    <div className="container mx-auto mt-6 p-4 bg-[#0B1220] border border-[#1F2937] rounded-2xl">
      <h3 className="text-[#22ff88] font-semibold">{observedCoin.coin.name}</h3>
      <p className="text-gray-400 text-sm">Behavior Analysis over latest cycles</p>

      <button
        onClick={() => setShowExecutionGate(true)}
        className="mt-3 px-4 py-2 border border-[#22ff88] rounded-lg text-[#22ff88] hover:bg-[#22ff8820]"
      >
        Unlock Trade ({slotsLeft} slots left)
      </button>

      {viralInsight && <p className="mt-2 text-gray-300">{viralInsight}</p>}
      {shareText && <p className="mt-1 text-gray-500 text-xs">Share: {shareText}</p>}
    </div>
  );
}
