'use client';

import { memo } from 'react';

interface Props {
  label: string;
  value: string | number;
  live?: boolean;
  icon?: React.ReactNode;
  dot?: boolean;
  highlight?: boolean;
}

function StatItem({
  label,
  value,
  live = false,
  icon,
  dot = false,
  highlight = false,
}: Props) {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${
        highlight ? 'text-[#22ff88]' : 'text-gray-300'
      }`}
    >
      {/* Icon */}
      {icon && <span className="text-sm">{icon}</span>}

      {/* Status Dot */}
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      )}

      {/* Label + Value */}
      <span className="whitespace-nowrap">
        <span className="text-gray-400">{label}</span>
        <span className="mx-1 text-gray-500">:</span>
        <span className="font-semibold">{value}</span>
      </span>

      {/* Live Indicator */}
      {live && (
        <span className="ml-1 text-[#22ff88] animate-pulse text-[10px]">
          LIVE
        </span>
      )}
    </div>
  );
}

export default memo(StatItem);
