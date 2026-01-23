"use client";

import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-[9999] px-2 py-1 text-[10px] text-white bg-[#1F2937] rounded shadow-xl -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[#22ff88]/20 pointer-events-none animate-in fade-in zoom-in duration-200">
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1F2937] rotate-45 border-r border-b border-[#22ff88]/20" />
        </div>
      )}
    </div>
  );
}