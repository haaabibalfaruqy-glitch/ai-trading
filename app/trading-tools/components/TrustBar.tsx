"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccess } from "@/context/UserAccessContext";
import Tooltip from '@/app/Shared/Tooltip';
import { Lock, TrendingUp, Shield, Activity } from "lucide-react";

/* ================= TYPES ================= */

interface TrustMetrics {
  score: number;
  level: "Critical" | "Low" | "Medium" | "High" | "Excellent";
  uptime: number;
  trades_verified: number;
  security_audit: string;
  compliance: "Verified" | "Pending" | "Unverified";
}

/* ================= HELPERS ================= */

const getLevelFromScore = (score: number): TrustMetrics["level"] => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  if (score >= 25) return "Low";
  return "Critical";
};

const levelColor = {
  Excellent: "text-[#22ff88]",
  High: "text-[#22ff88]",
  Medium: "text-[#fbbf24]",
  Low: "text-[#ff8866]",
  Critical: "text-[#ff5577]",
};

const levelBg = {
  Excellent: "bg-[#22ff88]/10",
  High: "bg-[#22ff88]/10",
  Medium: "bg-[#fbbf24]/10",
  Low: "bg-[#ff8866]/10",
  Critical: "bg-[#ff5577]/10",
};

/* ================= COMPONENT ================= */

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

  /* ================= ANIMATION ================= */

  const resetLockedState = useCallback(() => {
    setMetrics({
      score: 0,
      level: "Medium",
      uptime: 0,
      trades_verified: 0,
      security_audit: "2025-12-15",
      compliance: "Unverified",
    });
    setDisplayScore(0);
  }, []);

  useEffect(() => {
    if (isLocked) {
      resetLockedState();
      return;
    }

    const targetScore = Math.floor(Math.random() * 25) + 72;
    const start = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const score = Math.floor(progress * targetScore);

      setDisplayScore(score);
      setMetrics((prev) => ({
        ...prev,
        score,
        level: getLevelFromScore(score),
        uptime: Math.min(98 + progress * 1.9, 99.9),
        trades_verified: Math.floor(progress * (Math.random() * 500 + 100)),
        compliance: "Verified",
      }));

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isLocked, resetLockedState]);

  const levelClass = useMemo(
    () => levelColor[metrics.level],
    [metrics.level]
  );
  const levelBgClass = useMemo(
    () => levelBg[metrics.level],
    [metrics.level]
  );

  /* ================= UI ================= */

  return (
    <div className="relative w-full rounded-2xl bg-[#0B1220] border border-[#1F2937] p-4 transition-all hover:border-[#22ff88]/30">
      {/* LOCKED OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-r from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Lock className="w-4 h-4" />
            Unlock to view trust metrics
          </div>
        </div>
      )}

      <div className={isLocked ? "opacity-30 pointer-events-none" : ""}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#22ff88]" />
            <h3 className="text-sm font-semibold text-white">Trust Pulse</h3>
          </div>

          <Tooltip content="Real-time system trust score and performance metrics">
            <div className="w-5 h-5 rounded-full bg-[#22ff88]/10 border border-[#22ff88]/30 flex items-center justify-center text-xs text-[#22ff88] cursor-help">
              ?
            </div>
          </Tooltip>
        </div>

        {/* SCORE CARD */}
        <div
          className={`${levelBgClass} border border-[#22ff88]/20 rounded-xl p-4 transition-all`}
        >
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] text-gray-400">Trust Score</div>
              <div className={`text-4xl font-bold ${levelClass}`}>
                {displayScore}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {metrics.level}
              </div>
            </div>

            <div className="flex-1 h-16 ml-4">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="60"
                  rx="4"
                  fill="rgba(34,255,136,0.05)"
                />
                <rect
                  x="0"
                  y="0"
                  width={metrics.score}
                  height="60"
                  rx="4"
                  fill="#22ff88"
                  opacity="0.3"
                />
                <line
                  x1={metrics.score}
                  y1="0"
                  x2={metrics.score}
                  y2="60"
                  stroke="#22ff88"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <MetricCard
            icon={<Activity className="w-3 h-3 text-[#22ff88]" />}
            label="Uptime"
            value={`${metrics.uptime.toFixed(1)}%`}
            hint="System uptime this month"
          />

          <MetricCard
            icon={<TrendingUp className="w-3 h-3 text-[#fbbf24]" />}
            label="Verified"
            value={metrics.trades_verified.toString()}
            sub="Trades"
            hint="Number of verified trades executed"
          />

          <MetricCard
            label="Compliance"
            value={metrics.compliance}
            sub={`Audit: ${metrics.security_audit}`}
            verified={metrics.compliance === "Verified"}
            hint="Security & compliance certification"
          />
        </div>

        {/* FOOTER */}
        <div className="pt-3 mt-4 border-t border-[#1F2937] text-[9px] text-gray-500">
          Trust score updates in real-time. Metrics are audited & verified.
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function MetricCard({
  icon,
  label,
  value,
  sub,
  hint,
  verified,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  hint: string;
  verified?: boolean;
}) {
  return (
    <Tooltip content={hint}>
      <div
        className={`rounded-lg p-3 border transition-all cursor-help ${
          verified
            ? "bg-[#22ff88]/10 border-[#22ff88]/30"
            : "bg-[#1a2a3a]/40 border-[#1F2937]"
        }`}
      >
        {icon && (
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        )}

        {!icon && (
          <div className="text-[10px] text-gray-400 mb-1">{label}</div>
        )}

        <div
          className={`text-lg font-bold ${
            verified ? "text-[#22ff88]" : "text-[#fbbf24]"
          }`}
        >
          {value}
        </div>

        {sub && (
          <div className="text-[9px] text-gray-500 mt-1">{sub}</div>
        )}
      </div>
    </Tooltip>
  );
}
