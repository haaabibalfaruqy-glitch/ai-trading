// app/trade/loading.tsx

"use client";

import React from "react";

export default function LoadingTrade() {
  return (
    <div className="w-full min-h-screen bg-[#070B14] text-white pb-20 relative overflow-hidden">
      
      {/* 1. ATMOSPHERIC BACKDROP */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-green/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="pt-10 px-6 max-w-[1440px] mx-auto relative z-10">
        
        {/* STATUS INDICATOR */}
        <div className="mb-10 flex items-center gap-3 text-[10px] font-bold text-neon-green uppercase tracking-[0.3em]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green/60 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green" />
          </span>
          Neural_Core_Initializing...
        </div>

        {/* 2. TOP STATS SKELETON (HeroStats Mimic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-6 relative overflow-hidden">
              <div className="h-2 bg-white/5 rounded w-1/3 mb-4" />
              <div className="h-8 bg-white/10 rounded-xl w-2/3" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
            </div>
          ))}
        </div>

        {/* 3. MAIN VISUAL SKELETON (Chart/HeroVisual Mimic) */}
        <div className="mb-12 p-1 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[2.5rem]">
          <div className="bg-[#0C1322] rounded-[2.4rem] p-8 h-[400px] relative overflow-hidden">
             <div className="flex justify-between mb-8">
                <div className="space-y-3">
                  <div className="h-10 bg-white/10 rounded-2xl w-64" />
                  <div className="h-4 bg-white/5 rounded-lg w-96" />
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-full" />
             </div>
             {/* Fake Waveform Line */}
             <div className="absolute bottom-20 left-10 right-10 h-[2px] bg-white/[0.03]" />
             <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-neon-green/5 to-transparent opacity-50" />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer" />
          </div>
        </div>

        {/* 4. ASSET LIST SKELETON (TradeDashboard Mimic) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 bg-white/10 rounded w-40" />
            <div className="h-4 bg-white/10 rounded w-20" />
          </div>
          
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="group p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-white/5 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-32" />
                    <div className="h-3 bg-white/5 rounded w-20" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-24 bg-white/5 rounded-xl" />
                  <div className="h-10 w-24 bg-white/5 rounded-xl" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}