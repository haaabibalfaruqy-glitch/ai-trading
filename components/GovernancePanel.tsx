"use client";
import { CapitalMode, SystemMode } from "@/lib/types";

interface GovernancePanelProps {
  capitalMode: CapitalMode;
  riskAppetite: string;
  setCapitalMode: React.Dispatch<React.SetStateAction<CapitalMode>>;
}

export default function GovernancePanel({ capitalMode, riskAppetite, setCapitalMode }: GovernancePanelProps) {
  return (
    <div className="container mx-auto mt-6 p-4 bg-[#0B1220] border border-[#1F2937] rounded-2xl">
      <h3 className="text-[#22ff88] font-semibold">Governance Panel</h3>
      <p className="text-gray-400 text-sm">Capital Mode: {capitalMode}</p>
      <p className="text-gray-400 text-sm">Risk Appetite: {riskAppetite}</p>
    </div>
  );
}
