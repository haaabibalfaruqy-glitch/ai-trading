// /app/Shared/Gamification.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Award, Trophy, Flame, Star, Zap, ChevronRight, Crown } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  unlocked: boolean;
  progress?: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  streak: number;
  isCurrentUser: boolean;
}

/* ---------------- Badge Card ---------------- */
const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => (
  <div
    className={`relative group rounded-2xl p-4 border transition-all duration-500 overflow-hidden ${
      badge.unlocked
        ? "bg-white/[0.03] border-neon-green/30 hover:border-neon-green shadow-lg shadow-neon-green/5"
        : "bg-black/20 border-white/5 opacity-40 grayscale"
    }`}
  >
    <div className={`text-2xl mb-3 transform transition-transform group-hover:scale-110 duration-500`}>
      {badge.icon}
    </div>
    <h4 className="text-[11px] font-bold text-white tracking-wider uppercase mb-1">{badge.name}</h4>
    <p className="text-[10px] text-gray-500 leading-tight mb-4 h-8">{badge.description}</p>
    
    {!badge.unlocked && badge.progress !== undefined ? (
      <div className="space-y-1.5">
        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
          <div
            className="bg-neon-green h-full transition-all duration-1000 ease-out"
            style={{ width: `${badge.progress}%` }}
          />
        </div>
        <p className="text-[9px] font-mono text-neon-green/70">{badge.progress}% ANALYZED</p>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
        <span className="text-[9px] font-bold text-neon-green uppercase tracking-tighter">Verified Achievement</span>
      </div>
    )}
  </div>
);

export default function Gamification() {
  const [activeTab, setActiveTab] = useState<"badges" | "leaderboard" | "streak">("badges");
  const [totalPoints, setTotalPoints] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setTotalPoints(p => p + Math.floor(Math.random() * 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-green/5 blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-neon-green shadow-inner">
            <Trophy size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Neural Ranking System</h3>
            <p className="text-xs text-gray-500 font-medium">Performance Metrics & Social Authority</p>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/[0.05]">
          {[
            { label: "XP", val: totalPoints, color: "text-neon-green", icon: <Star size={12} /> },
            { label: "STREAK", val: "7D", color: "text-neon-pink", icon: <Flame size={12} /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] rounded-xl border border-white/[0.05]">
              <div className={stat.color}>{stat.icon}</div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold leading-none">{stat.label}</span>
                <span className={`text-sm font-mono font-bold ${stat.color}`}>{stat.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-black/20 p-1 rounded-xl mb-8 border border-white/[0.05] w-fit">
        {(["badges", "leaderboard", "streak"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg ${
              activeTab === tab 
                ? "bg-white text-black shadow-lg" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content with Fade-in Effect */}
      <div className="relative min-h-[320px] animate-in fade-in duration-700">
        {activeTab === "badges" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <BadgeCard badge={{ id: "1", name: "Genesis Execution", icon: <Zap className="text-yellow-400" />, description: "First AI-validated trade entry", unlocked: true }} />
             <BadgeCard badge={{ id: "2", name: "Neural Streak", icon: <Flame className="text-neon-pink" />, description: "Maintain 5 days of profitable sessions", unlocked: true }} />
             <BadgeCard badge={{ id: "3", name: "Risk Architect", icon: <ChevronRight className="text-blue-400" />, description: "Keep Drawdown below 2% for 30 trades", unlocked: false, progress: 65 }} />
             <BadgeCard badge={{ id: "4", name: "Profit Singularity", icon: <Crown className="text-neon-green" />, description: "Accumulate $10k in realized gains", unlocked: false, progress: 42 }} />
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="space-y-3">
            {[1, 2, 3].map((rank) => (
              <div key={rank} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                rank === 3 ? "bg-neon-green/5 border-neon-green/30 shadow-[0_0_20px_rgba(34,255,136,0.05)]" : "bg-white/[0.02] border-white/[0.05]"
              }`}>
                <div className="flex items-center gap-4">
                  <span className={`w-8 font-mono font-bold ${rank === 1 ? "text-yellow-500" : "text-gray-600"}`}>0{rank}</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10" />
                  <div>
                    <p className="text-sm font-bold text-white">{rank === 3 ? "You (Neural_Trader)" : `Operator_0x${rank}f4`}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Level {10 - rank} Commander</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-mono font-bold ${rank === 3 ? "text-neon-green" : "text-white"}`}>
                    {rank === 1 ? "4,850" : rank === 2 ? "4,620" : totalPoints} <span className="text-[10px] text-gray-500">XP</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "streak" && (
           <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-neon-pink/20 blur-3xl animate-pulse" />
                <Flame size={80} className="text-neon-pink relative z-10" />
              </div>
              <h4 className="text-4xl font-mono font-black text-white mb-2">07 <span className="text-xl text-neon-pink">DAYS</span></h4>
              <p className="text-gray-400 max-w-sm text-sm">You are in the top 2% of traders this week. Maintain synchronization to unlock the "Eternal Flame" badge.</p>
           </div>
        )}
      </div>
    </div>
  );
}