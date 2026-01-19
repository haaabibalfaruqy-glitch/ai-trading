"use client";

import { useState } from "react";
import { Info, Lock } from "lucide-react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({
  content,
  children,
  position = "top",
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {showTooltip && (
        <div
          className={`absolute z-50 px-3 py-2 text-xs bg-[#1a2a3a] border border-[#22ff88]/30 rounded-lg text-gray-100 whitespace-nowrap pointer-events-none animate-fade-in ${
            positionClasses[position]
          }`}
        >
          {content}
          <div className="absolute w-2 h-2 bg-[#1a2a3a] border border-[#22ff88]/30 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
