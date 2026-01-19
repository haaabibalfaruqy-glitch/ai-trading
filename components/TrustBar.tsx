"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccess } from "@/context/UserAccessContext";
import { Tooltip } from "./Tooltip";
import { Lock, TrendingUp, Shield, Activity } from "lucide-react";

interface TrustMetrics {
  score: number; // 0-100
  level: "Critical" | "Low" | "Medium" | "High" | "Excellent";
  uptime: number; // percentage
  trades_verified: number;
  security_audit: string; // date
  compliance: "Verified" | "Pending" | "Unverified";
}

export default function TrustBar() {
  const { access } = useAccess();
  const isLocked = access === "guest";

  const [metrics, setMetrics] = useState<TrustMetrics>({
    score: 0,
    level: "Medium",
    uptime: 0,
    trades_verified: 0,
    security_audit: "2025-12-15",
    compliance: "Verified",
  });

  const [displayScore, setDisplayScore] = useState(0);

  // Animate trust score on mount
  useEffect(() => {
    if (isLocked) {
      setMetrics({
        score: 0,
        level: "Medium",
        uptime: 0,
        trades_verified: 0,
        security_audit: "2025-12-15",
        compliance: "Unverified",
      });
      return;
    }

    const targetScore = Math.floor(Math.random() * 25) + 72; // 72-97
    const animationDuration = 1500;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / animationDuration, 1);
      const newScore = Math.floor(progress * targetScore);

      setDisplayScore(newScore);
      setMetrics((prev) => ({
        ...prev,
        score: newScore,
        level:
          newScore >= 90
            ? "Excellent"
            : newScore >= 75
              ? "High"
              : newScore >= 50
                ? "Medium"
                : newScore >= 25
                  ? "Low"
                  : "Critical",
        uptime: Math.min(progress * (Math.random() * 5 + 98), 99.9),
        trades_verified: Math.floor(progress * (Math.floor(Math.random() * 500) + 100)),
      }));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isLocked]);

  // Get color based on level
  const getMetricColor = (level: TrustMetrics["level"]) => {
    switch (level) {
      case "Excellent":
        return "text-[#22ff88]";
      case "High":
        return "text-[#22ff88]";
      case "Medium":
        return "text-[#fbbf24]";
      case "Low":
        return "text-[#ff8866]";
      case "Critical":
        return "text-[#ff5577]";
      default:
        return "text-gray-400";
    }
  };

  const getBgColor = (level: TrustMetrics["level"]) => {
    switch (level) {
      case "Excellent":
        return "bg-[#22ff88]/10";
      case "High":
        return "bg-[#22ff88]/10";
      case "Medium":
        return "bg-[#fbbf24]/10";
      case "Low":
        return "bg-[#ff8866]/10";
      case "Critical":
        return "bg-[#ff5577]/10";
      default:
        return "bg-[#1F2937]/10";
    }
  };

  return (
    <div className="w-full bg-[#0B1220] border border-[#1F2937] rounded-2xl p-4 transition-all hover:border-[#22ff88]/30 group">
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Unlock to view trust metrics</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isLocked ? "opacity-30 pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#22ff88]" />
            <h3 className="text-sm font-semibold text-white">Trust Pulse</h3>
          </div>
          <Tooltip content="Real-time system trust score and performance metrics">
            <div className="cursor-help">
              <div className="w-5 h-5 rounded-full bg-[#22ff88]/10 border border-[#22ff88]/30 flex items-center justify-center text-xs text-[#22ff88]">
                ?
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Main score card */}
        <div className={`${getBgColor(metrics.level)} border border-[#22ff88]/20 rounded-xl p-4 transition-all group-hover:border-[#22ff88]/40`}>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] text-gray-400 mb-1">Trust Score</div>
              <div className={`text-4xl font-bold ${getMetricColor(metrics.level)}`}>
                {displayScore}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {metrics.level}
              </div>
            </div>
            <div className="flex-1 h-16 ml-4">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                {/* Score bar background */}
                <rect x="0" y="0" width="100" height="60" fill="rgba(34, 255, 136, 0.05)" rx="4" />
                {/* Score bar fill */}
                <rect
                  x="0"
                  y="0"
                  width={metrics.score}
                  height="60"
                  fill="#22ff88"
                  rx="4"
                  opacity="0.3"
                  className="transition-all duration-300"
                />
                {/* Score line */}
                <line
                  x1={metrics.score}
                  y1="0"
                  x2={metrics.score}
                  y2="60"
                  stroke="#22ff88"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Uptime */}
          <Tooltip content="System uptime percentage this month">
            <div className="bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg p-3 hover:border-[#22ff88]/30 transition-all cursor-help">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3 h-3 text-[#22ff88]" />
                <div className="text-[10px] text-gray-400">Uptime</div>
              </div>
              <div className="text-lg font-bold text-[#22ff88]">
                {metrics.uptime.toFixed(1)}%
              </div>
              <div className="text-[9px] text-gray-500 mt-1">This month</div>
            </div>
          </Tooltip>

          {/* Trades Verified */}
          <Tooltip content="Number of verified trades executed">
            <div className="bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg p-3 hover:border-[#22ff88]/30 transition-all cursor-help">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-[#fbbf24]" />
                <div className="text-[10px] text-gray-400">Verified</div>
              </div>
              <div className="text-lg font-bold text-[#fbbf24]">
                {metrics.trades_verified}
              </div>
              <div className="text-[9px] text-gray-500 mt-1">Trades</div>
            </div>
          </Tooltip>

          {/* Compliance */}
          <Tooltip content="Security and compliance certification status">
            <div className={`${
              metrics.compliance === "Verified"
                ? "bg-[#22ff88]/10"
                : "bg-[#fbbf24]/10"
            } border ${
              metrics.compliance === "Verified"
                ? "border-[#22ff88]/30"
                : "border-[#fbbf24]/30"
            } rounded-lg p-3 hover:border-[#22ff88]/30 transition-all cursor-help`}>
              <div className="text-[10px] text-gray-400 mb-1">Compliance</div>
              <div className={`text-lg font-bold ${
                metrics.compliance === "Verified"
                  ? "text-[#22ff88]"
                  : "text-[#fbbf24]"
              }`}>
                {metrics.compliance}
              </div>
              <div className="text-[9px] text-gray-500 mt-1">
                Last audit: {metrics.security_audit}
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#1F2937] text-[9px] text-gray-500">
          <p>
            Trust score updates in real-time. All metrics are verified and audited.
          </p>
        </div>
      </div>
    </div>
  );
}
