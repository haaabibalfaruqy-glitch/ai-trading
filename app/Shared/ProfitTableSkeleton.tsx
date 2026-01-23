// app/Shared/ProfitTableSkeleton.tsx

"use client";

export const ProfitTableSkeleton = () => {
  return (
    <div className="w-full bg-[#0C1322] border border-[#1A2636] rounded-2xl p-6 overflow-hidden relative">
      {/* Global Shimmer Sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />

      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-5 bg-[#1A2636] rounded-full w-48 animate-pulse" />
          <div className="h-3 bg-[#1A2636]/50 rounded-full w-32 animate-pulse" />
        </div>
        <div className="h-8 bg-[#1A2636] rounded-xl w-28 animate-pulse shadow-inner" />
      </div>

      {/* Table Structure */}
      <div className="space-y-4">
        {/* Table Header Row */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 pb-4 border-b border-[#1A2636]/50">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`h-3 bg-[#1A2636]/70 rounded-full animate-pulse ${i > 3 ? 'hidden md:block' : ''}`} 
            />
          ))}
        </div>

        {/* Dynamic Rows */}
        {[...Array(6)].map((_, rowIdx) => (
          <div 
            key={rowIdx} 
            className="grid grid-cols-4 md:grid-cols-6 gap-4 py-3 items-center border-b border-[#1A2636]/20 last:border-0"
          >
            {/* Asset Column (With Icon Placeholder) */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1A2636] animate-pulse shrink-0" />
              <div className="h-4 bg-[#1A2636] rounded-lg w-full animate-pulse" />
            </div>

            {/* Price & Trend Columns */}
            {[...Array(5)].map((_, colIdx) => (
              <div
                key={colIdx}
                className={`h-4 bg-[#1A2636]/60 rounded-lg animate-pulse ${colIdx > 2 ? 'hidden md:block' : ''}`}
                style={{
                  animationDelay: `${(rowIdx * 100) + (colIdx * 50)}ms`,
                  width: `${Math.random() * (100 - 60) + 60}%` // Variasi lebar agar terlihat natural
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-[#1A2636] flex justify-between items-center opacity-50">
        <div className="h-3 bg-[#1A2636] rounded-full w-40 animate-pulse" />
        <div className="h-3 bg-[#1A2636] rounded-full w-20 animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProfitTableSkeleton;