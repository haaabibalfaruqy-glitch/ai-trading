"use client";

import { useState } from "react";
// Mengambil tipe dari lib/componentTypes sesuai strukturmu
import { CapitalMode, RiskAppetite } from "@/lib/componentTypes";
import { useAccess } from "@/context/UserAccessContext";
import Tooltip from "../../Shared/Tooltip";
import { Lock, Settings, AlertCircle, TrendingUp } from "lucide-react";

interface GovernancePanelProps {
  capitalMode: CapitalMode;
  riskAppetite: RiskAppetite;
  setCapitalMode: (mode: CapitalMode) => void;
  setRiskAppetite?: (risk: RiskAppetite) => void;
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

  // FIX SINKRONISASI: Menggunakan nilai yang sesuai dengan componentTypes.ts (Huruf Kapital)
  const capitalModes: CapitalMode[] = ["Preservation", "Adaptive Growth", "Aggressive"];

  // Mapping label untuk UI
  const modeLabels: Record<string, string> = {
    "Preservation": "Preservation",
    "Adaptive Growth": "Adaptive Growth",
    "Aggressive": "Aggressive Expansion",
    "Conservative": "Conservative"
  };

  const getModeDescription = (mode: string): string => {
    const descriptions: Record<string, string> = {
      "Preservation": "Capital safety prioritized. Lower position sizes, conservative stops.",
      "Adaptive Growth": "Balanced approach. Dynamic position sizing based on market conditions.",
      "Aggressive": "Growth prioritized. Larger positions, optimized for uptrend momentum.",
    };
    return descriptions[mode] || "Standard AI trading parameters.";
  };

  const getRiskDescription = (risk: string): string => {
    const descriptions: Record<string, string> = {
      "Low": "Conservative trading. Max 1-2% risk per trade.",
      "Medium": "Moderate risk. Max 2-3% risk per trade.",
      "High": "Aggressive trading. Max 3-5% risk per trade.",
      "Moderate": "Balanced risk management settings."
    };
    return descriptions[risk] || "Risk assessment active.";
  };

  const getModeColor = (mode: string): string => {
    if (mode.includes("Preservation")) return "border-[#22ff88]/30 text-[#22ff88]";
    if (mode.includes("Growth")) return "border-[#fbbf24]/30 text-[#fbbf24]";
    if (mode.includes("Aggressive")) return "border-[#ff8866]/30 text-[#ff8866]";
    return "border-gray-500/30 text-gray-400";
  };

  const getRiskColor = (risk: string): string => {
    const r = risk.toLowerCase();
    if (r === "low") return "bg-[#22ff88]/10 border-[#22ff88]/30";
    if (r === "medium" || r === "moderate") return "bg-[#fbbf24]/10 border-[#fbbf24]/30";
    if (r === "high") return "bg-[#ff8866]/10 border-[#ff8866]/30";
    return "bg-gray-500/10 border-gray-500/30";
  };

  const getRiskTextColor = (risk: string): string => {
    const r = risk.toLowerCase();
    if (r === "low") return "text-[#22ff88]";
    if (r === "medium" || r === "moderate") return "text-[#fbbf24]";
    if (r === "high") return "text-[#ff8866]";
    return "text-gray-400";
  };

  return (
    <div className="w-full bg-[#0B1220] border border-[#1F2937] rounded-2xl p-4 transition-all hover:border-[#22ff88]/30 group relative overflow-hidden">
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Unlock to configure governance</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isLocked ? "opacity-30 pointer-events-none" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#22ff88]" />
            <h3 className="text-sm font-semibold text-white">Governance Panel</h3>
          </div>
          <Tooltip content="Configure capital management and risk parameters">
            <div className="cursor-help">
              <div className="w-5 h-5 rounded-full bg-[#22ff88]/10 border border-[#22ff88]/30 flex items-center justify-center text-xs text-[#22ff88]">?</div>
            </div>
          </Tooltip>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#22ff88]" />
            <label className="text-[11px] font-semibold text-gray-300">Capital Mode</label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {capitalModes.map((mode) => (
              <Tooltip key={mode} content={getModeDescription(mode)}>
                <button
                  onClick={() => setCapitalMode(mode)}
                  className={`py-2 px-1 rounded-lg border transition-all text-[9px] font-semibold truncate ${
                    capitalMode === mode
                      ? `${getModeColor(mode)} bg-opacity-10 bg-current`
                      : `border-[#1F2937] text-gray-400 hover:border-[#22ff88]/30`
                  }`}
                >
                  {modeLabels[mode] || mode}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#fbbf24]" />
            <label className="text-[11px] font-semibold text-gray-300">Risk Appetite</label>
          </div>
          <div className="flex gap-2">
            {/* Menggunakan casting 'as any' untuk fleksibilitas string */}
            {(["Low", "Medium", "High"] as any[]).map((risk) => (
              <Tooltip key={risk} content={getRiskDescription(risk)}>
                <button
                  onClick={() => setRiskAppetite && setRiskAppetite(risk)}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all text-[10px] font-semibold ${
                    riskAppetite === risk
                      ? `${getRiskColor(risk)} ${getRiskTextColor(risk)}`
                      : `border-[#1F2937] text-gray-400 hover:border-[#22ff88]/30`
                  }`}
                >
                  {risk}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg p-2">
            <div className="text-[9px] text-gray-400 mb-1">Current Mode</div>
            <div className={`text-[11px] font-bold truncate ${getModeColor(capitalMode as string)}`}>
              {modeLabels[capitalMode as string] || capitalMode}
            </div>
          </div>
          <div className={`${getRiskColor(riskAppetite as string)} border rounded-lg p-2`}>
            <div className="text-[9px] text-gray-400 mb-1">Current Risk</div>
            <div className={`text-[11px] font-bold ${getRiskTextColor(riskAppetite as string)}`}>
              {riskAppetite as string} Risk
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-[10px] text-gray-500 hover:text-gray-300 transition-colors py-2 border-t border-[#1F2937] text-left"
        >
          {isExpanded ? "Hide" : "Show"} advanced options ↓
        </button>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-[#1F2937] animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-2 bg-[#1a2a3a]/40 border border-[#1F2937] rounded-lg">
              <span className="text-[10px] text-gray-400">Leverage Limit</span>
              <span className="text-[10px] font-bold text-[#ff8866]">
                {(capitalMode as string).includes("Aggressive") ? "3x" : "1x"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}