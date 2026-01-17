"use client";

import { FilterBarProps } from "@/lib/componentTypes";

export default function FilterBar({ activeFilter, setActiveFilter, setRisk, setTimeframe }: FilterBarProps) {
  return (
    <div className="container mx-auto mt-4 flex gap-3">
      <button
        className={`px-3 py-1 rounded ${activeFilter === "All" ? "bg-[#22ff88]" : "bg-[#0B1220] border border-[#1F2937]"}`}
        onClick={() => setActiveFilter("All")}
      >
        All
      </button>
      <button
        className="px-3 py-1 rounded bg-[#0B1220] border border-[#1F2937]"
        onClick={() => setRisk("low")}
      >
        Low Risk
      </button>
      <button
        className="px-3 py-1 rounded bg-[#0B1220] border border-[#1F2937]"
        onClick={() => setRisk("medium")}
      >
        Medium Risk
      </button>
      <button
        className="px-3 py-1 rounded bg-[#0B1220] border border-[#1F2937]"
        onClick={() => setTimeframe("scalp")}
      >
        Scalp
      </button>
      <button
        className="px-3 py-1 rounded bg-[#0B1220] border border-[#1F2937]"
        onClick={() => setTimeframe("long")}
      >
        Long
      </button>
    </div>
  );
}
