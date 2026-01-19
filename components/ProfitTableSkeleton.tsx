"use client";

export const ProfitTableSkeleton = () => {
  return (
    <div className="w-full bg-[#0B0F18] border border-[#1F2937] rounded-xl p-4 space-y-3">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-[#1F2937] rounded-lg w-48 animate-pulse" />
        <div className="h-5 bg-[#1F2937] rounded-full w-24 animate-pulse" />
      </div>

      {/* Table header skeleton */}
      <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[#1F2937]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-[#1F2937] rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Table rows skeleton */}
      {[...Array(5)].map((_, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-6 gap-3 py-2">
          {[...Array(6)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-5 bg-[#1F2937] rounded-lg animate-pulse"
              style={{
                animationDelay: `${(rowIdx * 6 + colIdx) * 50}ms`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Footer skeleton */}
      <div className="pt-3 border-t border-[#1F2937]">
        <div className="h-4 bg-[#1F2937] rounded-lg w-32 animate-pulse" />
      </div>
    </div>
  );
};

export default ProfitTableSkeleton;
