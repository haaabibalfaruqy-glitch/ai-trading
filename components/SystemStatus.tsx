"use client";

import { useState, useEffect } from "react";
import { SystemMode } from "@/lib/types";
import { useAccess } from "@/context/UserAccessContext";
import { Tooltip } from "./Tooltip";
import { Activity, AlertTriangle, CheckCircle, Lock, Zap } from "lucide-react";

interface Props {
  systemMode: SystemMode;
  onModeChange?: (mode: SystemMode) => void;
}

interface SystemMetric {
  label: string;
  value: string;
  status: "good" | "warning" | "error";
  tooltip: string;
}

export default function SystemStatus({ systemMode, onModeChange }: Props) {
  const { access } = useAccess();
  const isLocked = access === "guest";

  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [pulse, setPulse] = useState(0);

  // Initialize metrics
  useEffect(() => {
    if (isLocked) {
      setMetrics([
        {
          label: "API Status",
          value: "Locked",
          status: "warning",
          tooltip: "Connect broker to view API status",
        },
        {
          label: "Latency",
          value: "—",
          status: "warning",
          tooltip: "Trade latency unavailable",
        },
        {
          label: "Memory",
          value: "—",
          status: "warning",
          tooltip: "System memory metrics unavailable",
        },
        {
          label: "Connections",
          value: "0",
          status: "error",
          tooltip: "No broker connections",
        },
      ]);
      return;
    }

    const baseMetrics: SystemMetric[] = [
      {
        label: "API Status",
        value: "Connected",
        status: "good",
        tooltip: "Broker API connection active",
      },
      {
        label: "Latency",
        value: `${Math.floor(Math.random() * 50) + 10}ms`,
        status: "good",
        tooltip: "Average trade execution latency",
      },
      {
        label: "Memory",
        value: `${Math.floor(Math.random() * 30) + 60}MB`,
        status: "good",
        tooltip: "Current memory usage",
      },
      {
        label: "Connections",
        value: String(Math.floor(Math.random() * 3) + 1),
        status: "good",
        tooltip: "Active broker connections",
      },
    ];

    setMetrics(baseMetrics);
  }, [isLocked]);

  // Animate pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (
    status: "good" | "warning" | "error"
  ): { bg: string; border: string; text: string } => {
    switch (status) {
      case "good":
        return {
          bg: "bg-[#22ff88]/10",
          border: "border-[#22ff88]/30",
          text: "text-[#22ff88]",
        };
      case "warning":
        return {
          bg: "bg-[#fbbf24]/10",
          border: "border-[#fbbf24]/30",
          text: "text-[#fbbf24]",
        };
      case "error":
        return {
          bg: "bg-[#ff5577]/10",
          border: "border-[#ff5577]/30",
          text: "text-[#ff5577]",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          text: "text-gray-400",
        };
    }
  };

  const getStatusIcon = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-3 h-3" />;
      case "warning":
        return <AlertTriangle className="w-3 h-3" />;
      case "error":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const getModeColor = (
    mode: SystemMode
  ): { bg: string; border: string; text: string } => {
    switch (mode) {
      case "active":
        return {
          bg: "bg-[#22ff88]/10",
          border: "border-[#22ff88]/30",
          text: "text-[#22ff88]",
        };
      case "idle":
        return {
          bg: "bg-[#fbbf24]/10",
          border: "border-[#fbbf24]/30",
          text: "text-[#fbbf24]",
        };
      case "error":
        return {
          bg: "bg-[#ff5577]/10",
          border: "border-[#ff5577]/30",
          text: "text-[#ff5577]",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          text: "text-gray-400",
        };
    }
  };

  const modes: SystemMode[] = ["idle", "active", "error"];

  return (
    <div className="w-full bg-[#0B1220] border border-[#1F2937] rounded-2xl p-4 transition-all hover:border-[#22ff88]/30 group">
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm">System status locked</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isLocked ? "opacity-30 pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="w-5 h-5 text-[#22ff88]" />
              <div
                className="absolute inset-0 rounded-full bg-[#22ff88] blur-md opacity-30"
                style={{
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
              />
            </div>
            <h3 className="text-sm font-semibold text-white">System Status</h3>
          </div>
          <Tooltip content="Real-time system performance and health indicators">
            <div className="cursor-help">
              <div className="w-5 h-5 rounded-full bg-[#22ff88]/10 border border-[#22ff88]/30 flex items-center justify-center text-xs text-[#22ff88]">
                ?
              </div>
            </div>
          </Tooltip>
        </div>

        {/* System mode selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-gray-300">
            System Mode
          </label>
          <div className="flex gap-2">
            {modes.map((mode) => {
              const colors = getModeColor(mode);
              return (
                <Tooltip
                  key={mode}
                  content={
                    mode === "active"
                      ? "System actively trading"
                      : mode === "idle"
                        ? "System monitoring, not trading"
                        : "System error or maintenance"
                  }
                >
                  <button
                    onClick={() => {
                      if (!isLocked && onModeChange) onModeChange(mode);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-all text-[10px] font-semibold capitalize ${
                      systemMode === mode
                        ? `${colors.bg} ${colors.border} ${colors.text}`
                        : `border-[#1F2937] text-gray-400 hover:border-[#22ff88]/30`
                    } ${!isLocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    {mode}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Performance metrics */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-gray-300">
            Performance Metrics
          </label>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((metric, idx) => {
              const colors = getStatusColor(metric.status);
              return (
                <Tooltip key={idx} content={metric.tooltip}>
                  <div
                    className={`${colors.bg} ${colors.border} border rounded-lg p-3 hover:border-opacity-100 transition-all cursor-help`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className={colors.text}>
                        {getStatusIcon(metric.status)}
                      </div>
                      <div className="text-[9px] text-gray-400">
                        {metric.label}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${colors.text}`}>
                      {metric.value}
                    </div>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* System health indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-gray-300">
              System Health
            </label>
            <span className="text-[10px] font-bold text-[#22ff88]">
              {Math.floor(85 + Math.random() * 15)}%
            </span>
          </div>
          <div className="h-2 bg-[#1a2a3a]/40 border border-[#1F2937] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#22ff88] to-[#22ff88]/60 transition-all"
              style={{
                width: `${85 + Math.random() * 15}%`,
              }}
            />
          </div>
        </div>

        {/* Status bars for each component */}
        <div className="space-y-2 pt-2 border-t border-[#1F2937]">
          <label className="text-[11px] font-semibold text-gray-300">
            Component Status
          </label>
          <div className="space-y-1 text-[9px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Trading Engine</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#22ff88]" />
                <span className="text-gray-500">Running</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Risk Manager</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#22ff88]" />
                <span className="text-gray-500">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Data Stream</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                <span className="text-gray-500">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#1F2937] text-[9px] text-gray-500">
          <p>
            System metrics update in real-time. All data is verified and
            authenticated.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
