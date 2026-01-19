"use client";

import { useState, useEffect } from "react";
import { CapitalMode, RiskAppetite } from "@/lib/types";
import { useAccess } from "@/context/UserAccessContext";
import { Tooltip } from "./Tooltip";
import { Lock, Settings, AlertCircle, TrendingUp } from "lucide-react";

interface GovernancePanelProps {
  capitalMode: CapitalMode;
  riskAppetite: RiskAppetite;
  setCapitalMode: React.Dispatch<React.SetStateAction<CapitalMode>>;
  setRiskAppetite?: React.Dispatch<React.SetStateAction<RiskAppetite>>;
}

export default function GovernancePanel({
  capitalMode,
  riskAppetite,
  setCapitalMode,
  setRiskAppetite,
}: GovernancePanelProps) {
  const { access } = useAccess();
  const isLocked = access === "guest";

  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredMode, setHoveredMode] = useState<CapitalMode | null>(null);

  const capitalModes: CapitalMode[] = [
    "Preservation",
    "Adaptive Growth",
    "Aggressive Expansion",
  ];

  const riskLevels: RiskAppetite[] = ["Low", "Medium", "High"];

  const getModeDescription = (mode: CapitalMode): string => {
    const descriptions: Record<CapitalMode, string> = {
      Preservation: "Capital safety prioritized. Lower position sizes, conservative stops.",
      "Adaptive Growth":
        "Balanced approach. Dynamic position sizing based on market conditions.",
      "Aggressive Expansion":
        "Growth prioritized. Larger positions, optimized for uptrend momentum.",
    };
    return descriptions[mode];
  };

  const getRiskDescription = (risk: RiskAppetite): string => {
    const descriptions: Record<RiskAppetite, string> = {
      Low: "Conservative trading. Max 1-2% risk per trade.",
      Medium: "Moderate risk. Max 2-3% risk per trade.",
      High: "Aggressive trading. Max 3-5% risk per trade.",
    };
    return descriptions[risk];
  };

  const getModeColor = (mode: CapitalMode): string => {
    switch (mode) {
      case "Preservation":
        return "border-[#22ff88]/30 text-[#22ff88]";
      case "Adaptive Growth":
        return "border-[#fbbf24]/30 text-[#fbbf24]";
      case "Aggressive Expansion":
        return "border-[#ff8866]/30 text-[#ff8866]";
      default:
        return "border-gray-500/30 text-gray-400";
    }
  };

  const getRiskColor = (risk: RiskAppetite): string => {
    switch (risk) {
      case "Low":
        return "bg-[#22ff88]/10 border-[#22ff88]/30";
      case "Medium":
        return "bg-[#fbbf24]/10 border-[#fbbf24]/30";
      case "High":
        return "bg-[#ff8866]/10 border-[#ff8866]/30";
      default:
        return "bg-gray-500/10 border-gray-500/30";
    }
  };

  const getRiskTextColor = (risk: RiskAppetite): string => {
    switch (risk) {
      case "Low":
        return "text-[#22ff88]";
      case "Medium":
        return "text-[#fbbf24]";
      case "High":
        return "text-[#ff8866]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="w-full bg-[#0B1220] border border-[#1F2937] rounded-2xl p-4 transition-all hover:border-[#22ff88]/30 group">
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Unlock to configure governance</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isLocked ? "opacity-30 pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#22ff88]" />
            <h3 className="text-sm font-semibold text-white">Governance Panel</h3>
          </div>
          <Tooltip content="Configure capital management and risk parameters">
            <div className="cursor-help">
              <div className="w-5 h-5 rounded-full bg-[#22ff88]/10 border border-[#22ff88]/30 flex items-center justify-center text-xs text-[#22ff88]">
                ?
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Capital Mode Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#22ff88]" />
            <label className="text-[11px] font-semibold text-gray-300">
              Capital Mode
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {capitalModes.map((mode) => (
              <Tooltip key={mode} content={getModeDescription(mode)}>
                <button
                  onClick={() => {
                    if (!isLocked) setCapitalMode(mode);
                  }}
                  onMouseEnter={() => setHoveredMode(mode)}
                  onMouseLeave={() => setHoveredMode(null)}
                  className={`py-2 px-3 rounded-lg border transition-all text-[10px] font-semibold ${
                    capitalMode === mode
                      ? `${getModeColor(mode)} bg-opacity-10`
                      : `border-[#1F2937] text-gray-400 hover:border-[#22ff88]/30`
                  } ${
                    !isLocked ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  {mode.split(" ")[0]}
                </button>
              </Tooltip>
            ))}
          </div>

          {hoveredMode && (
            <div className="text-[9px] text-gray-500 pl-2 border-l border-[#22ff88]/30 animate-fade-in">
              {getModeDescription(hoveredMode)}
            </div>
          )}
        </div>

        {/* Risk Appetite Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#fbbf24]" />
            <label className="text-[11px] font-semibold text-gray-300">
              Risk Appetite
            </label>
          </div>

          <div className="flex gap-2">
            {riskLevels.map((risk) => (
              <Tooltip key={risk} content={getRiskDescription(risk)}>
                <button
                  onClick={() => {
                    if (!isLocked && setRiskAppetite) setRiskAppetite(risk);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all text-[10px] font-semibold ${
                    riskAppetite === risk
                      ? `${getRiskColor(risk)} ${getRiskTextColor(risk)}`
                      : `border-[#1F2937] text-gray-400 hover:border-[#22ff88]/30`
                  } ${
                    !isLocked ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  {risk}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg p-2">
            <div className="text-[9px] text-gray-400 mb-1">Current Mode</div>
            <div className={`text-sm font-bold ${getModeColor(capitalMode)}`}>
              {capitalMode}
            </div>
          </div>
          <div className={`${getRiskColor(riskAppetite)} border rounded-lg p-2`}>
            <div className="text-[9px] text-gray-400 mb-1">Current Risk</div>
            <div className={`text-sm font-bold ${getRiskTextColor(riskAppetite)}`}>
              {riskAppetite} Risk
            </div>
          </div>
        </div>

        {/* Advanced settings toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-[10px] text-gray-500 hover:text-gray-300 transition-colors py-2 border-t border-[#1F2937] text-left"
        >
          {isExpanded ? "Hide" : "Show"} advanced options ↓
        </button>

        {/* Advanced settings */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-[#1F2937] animate-fade-in">
            <div className="text-[10px] font-semibold text-gray-400 mb-2">
              Advanced Governance
            </div>

            <div className="flex items-center justify-between p-2 bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg">
              <span className="text-[10px] text-gray-400">
                Max Position Size
              </span>
              <span className="text-[10px] font-bold text-[#22ff88]">
                {capitalMode === "Aggressive Expansion"
                  ? "5%"
                  : capitalMode === "Adaptive Growth"
                    ? "2.5%"
                    : "1%"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg">
              <span className="text-[10px] text-gray-400">
                Daily Drawdown Limit
              </span>
              <span className="text-[10px] font-bold text-[#fbbf24]">
                {riskAppetite === "High" ? "10%" : riskAppetite === "Medium" ? "5%" : "2%"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg">
              <span className="text-[10px] text-gray-400">
                Leverage Multiplier
              </span>
              <span className="text-[10px] font-bold text-[#ff8866]">
                {capitalMode === "Aggressive Expansion"
                  ? "3x"
                  : capitalMode === "Adaptive Growth"
                    ? "2x"
                    : "1x"}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-[#1F2937] text-[9px] text-gray-500">
          <p>
            Settings are backend-managed. Changes take effect immediately on new
            trades.
          </p>
        </div>
      </div>
    </div>
  );
}
