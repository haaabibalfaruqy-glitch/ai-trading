"use client";

import React from "react";

export type RiskLevel = "all" | "low" | "medium" | "high";
export type Timeframe = "all" | "scalp" | "long";
export type CoinFilter = "all" | "top";

interface FilterBarProps {
  activeFilter: CoinFilter;
  setActiveFilter: (filter: CoinFilter) => void;

  risk: RiskLevel;
  setRisk: (risk: RiskLevel) => void;

  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

/**
 * FILTER BAR — MARKET CONTEXT CONTROL
 *
 * - Non-executive
 * - No trading action
 * - Affects analytical & visual scope only
 */
const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  setActiveFilter,
  risk,
  setRisk,
  timeframe,
  setTimeframe,
}) => {
  return (
    <div
      className="
        flex flex-wrap items-center gap-2
        rounded-2xl
        border border-[#1F2937]
        bg-[#0B1220]
        px-3 py-2
        shadow-[inset_0_1px_0_#ffffff08]
      "
    >
      {/* COIN FILTER */}
      <Select
        label="Market Scope"
        value={activeFilter}
        onChange={(v) => setActiveFilter(v as CoinFilter)}
        options={[
          { value: "all", label: "All Markets" },
          { value: "top", label: "Top Liquidity" },
        ]}
      />

      {/* RISK FILTER */}
      <Select
        label="Risk Profile"
        value={risk}
        onChange={(v) => setRisk(v as RiskLevel)}
        options={[
          { value: "all", label: "All Risk Levels" },
          { value: "low", label: "Low Risk" },
          { value: "medium", label: "Medium Risk" },
          { value: "high", label: "High Risk" },
        ]}
      />

      {/* TIMEFRAME FILTER */}
      <Select
        label="Time Horizon"
        value={timeframe}
        onChange={(v) => setTimeframe(v as Timeframe)}
        options={[
          { value: "all", label: "All Horizons" },
          { value: "scalp", label: "Scalp / Intraday" },
          { value: "long", label: "Swing / Long" },
        ]}
      />
    </div>
  );
};

export default FilterBar;

/* ===============================
   INTERNAL SELECT COMPONENT
================================ */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 mb-0.5">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          rounded-xl
          bg-[#070B14]
          border border-[#1F2937]
          px-3 py-1.5
          text-[12px] text-gray-200
          focus:outline-none
          focus:border-[#22ff88]
          transition
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
