// app/portfolio/components/PerformanceMatrix.tsx

"use client";

import React from "react";
import { Calendar, Zap, Target, Award } from "lucide-react";

export default function PerformanceMatrix() {
  // Simulasi data 31 hari (Profit/Loss dalam USD)
  // 0 = No trade, positif = Profit, negatif = Loss
  const monthlyData = [
    120, -50, 200, 0, 450, -100, 300, 
    -20, 0, 150, 600, -300, 0, 80,
    110, 240, -40, 0, 50, 90, 400,
    -150, 0, 0, 310, 520, -10, 100,
    200, 0, 150
  ];

  const winRate = ((monthlyData.filter(v => v > 0).length / monthlyData.filter(v => v !== 0).length) * 100).toFixed(1);
  const totalProfit = monthlyData.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-neon-green">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Monthly Matrix</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Efficiency Heatmap</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/[0.05]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Win Rate</p>
            <p className="text-sm font-mono font-bold text-neon-green">{winRate}%</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/[0.05]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Net PnL</p>
            <p className="text-sm font-mono font-bold text-white">${totalProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Heatmap Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-7 gap-2">
            {/* Day Labels */}
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} className="text-[9px] text-gray-600 font-bold text-center mb-2">{day}</div>
            ))}
            
            {/* The Matrix */}
            {monthlyData.map((value, i) => {
              let bgColor = "bg-white/[0.02]";
              let opacity = "opacity-100";

              if (value > 0) {
                if (value > 300) bgColor = "bg-neon-green shadow-[0_0_15px_rgba(34,255,136,0.3)]";
                else if (value > 150) bgColor = "bg-neon-green/60";
                else bgColor = "bg-neon-green/20";
              } else if (value < 0) {
                bgColor = "bg-neon-pink/40";
              }

              return (
                <div 
                  key={i}
                  className={`aspect-square rounded-lg ${bgColor} ${opacity} transition-all duration-300 hover:scale-110 cursor-help group relative`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none z-20 whitespace-nowrap font-mono">
                    Day {i + 1}: {value >= 0 ? '+' : ''}${value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Insights */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3">
            <Target size={16} className="text-blue-400 mt-1" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Best Streak</p>
              <p className="text-xs text-gray-300 font-medium">5 Consecutive Days</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3">
            <Zap size={16} className="text-amber-400 mt-1" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Avg. Daily Yield</p>
              <p className="text-xs text-gray-300 font-medium">$124.50 / Day</p>
            </div>
          </div>
          <div className="p-4 rounded-[1.5rem] bg-neon-green/5 border border-neon-green/10 flex items-start gap-3">
            <Award size={16} className="text-neon-green mt-1" />
            <div>
              <p className="text-[10px] text-neon-green font-bold uppercase tracking-widest">AI Status</p>
              <p className="text-xs text-white font-medium">OPTIMAL_PERFORMANCE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}