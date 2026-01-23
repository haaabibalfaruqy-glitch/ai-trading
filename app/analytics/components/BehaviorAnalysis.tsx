"use client";

import { BehaviorAnalysisProps } from "@/lib/componentTypes";

export default function BehaviorAnalysis({
  observedCoin,
  viralInsight,
  highlightAnalysis,
  shareText,
  slotsLeft = 0,
  setShowExecutionGate,
}: BehaviorAnalysisProps) {
  if (!observedCoin) return null;

  return (
    <div
      className="
        container mx-auto mt-6
        p-5
        bg-gradient-to-br from-[#0B1220] to-[#070B14]
        border border-[#1F2937]
        rounded-2xl
        shadow-[inset_0_1px_0_#ffffff08]
        animate-fade-in
        hover:scale-[1.01] transition-transform
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[#22ff88] font-semibold leading-tight text-lg sm:text-xl">
            {observedCoin.coin.name} ({observedCoin.coin.symbol})
          </h3>
          <p className="text-gray-400 text-[12px] sm:text-[13px]">
            AI Behavioral Pattern Analysis (non-executive)
          </p>
        </div>

        <span className="bg-[#22ff88]/20 text-[#22ff88] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">
          Observed
        </span>
      </div>

      {/* MAIN ANALYSIS */}
      <div className="mt-3 space-y-2">
        {highlightAnalysis && (
          <p className="text-sm text-gray-300 leading-relaxed">
            {highlightAnalysis}
          </p>
        )}

        {viralInsight && (
          <p className="text-[13px] text-gray-400 italic animate-pulse">
            “{viralInsight}”
          </p>
        )}
      </div>

      {/* CTA BUTTON + SHARE */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        {setShowExecutionGate && (
          <button
            onClick={() => setShowExecutionGate(true)}
            className="
              px-4 py-2
              border border-[#22ff88]
              rounded-xl
              text-[#22ff88]
              text-sm font-medium
              hover:bg-[#22ff8820]
              transition-all
              shadow-md hover:shadow-[#22ff8820]
            "
          >
            Unlock Full Context
            <span className="ml-2 text-[10px] opacity-70">
              ({slotsLeft} slots left)
            </span>
          </button>
        )}

        {shareText && (
          <p className="text-[10px] text-gray-500">
            Share insight: {shareText}
          </p>
        )}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-3 pt-2 border-t border-[#1F2937] text-[10px] text-gray-500">
        <p>
          This module provides behavioral context only. No trade execution,
          entry, or exit decisions are generated.
        </p>
      </div>
    </div>
  );
}
