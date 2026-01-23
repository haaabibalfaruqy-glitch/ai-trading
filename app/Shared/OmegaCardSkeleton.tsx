// C:\ai_trading\app\Shared\OmegaCardSkeleton.tsx

export default function OmegaCardSkeleton() {
  return (
    <div className="relative w-full min-h-[280px] bg-[#0C1322] border border-[#1A2636] rounded-[2rem] p-6 overflow-hidden">
      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Icon/Logo Placeholder */}
          <div className="w-12 h-12 rounded-2xl bg-[#1A2636] border border-white/5 shadow-inner" />
          
          <div className="space-y-2">
            {/* Title Placeholder */}
            <div className="h-4 w-32 bg-[#1A2636] rounded-full" />
            {/* Subtitle Placeholder */}
            <div className="h-3 w-20 bg-[#1A2636]/60 rounded-full" />
          </div>
        </div>
        
        {/* Signal Badge Placeholder */}
        <div className="h-8 w-20 bg-[#1A2636] rounded-xl" />
      </div>

      {/* Hero Content Area (Insight/Graphic) */}
      <div className="relative w-full h-24 bg-gradient-to-b from-[#1A2636]/40 to-transparent rounded-2xl border border-white/[0.02] mb-6 flex items-end p-4">
        {/* Bar-chart like placeholders to mimic activity */}
        <div className="flex items-end gap-1 w-full h-8 opacity-20">
          {[40, 70, 45, 90, 65, 80, 30, 50].map((h, i) => (
            <div 
              key={i} 
              style={{ height: `${h}%` }} 
              className="flex-1 bg-white/20 rounded-t-sm"
            />
          ))}
        </div>
      </div>

      {/* Bottom Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1A2636]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 flex flex-col items-center">
            {/* Label */}
            <div className="h-2 w-12 bg-[#1A2636]/50 rounded-full" />
            {/* Value */}
            <div className="h-5 w-16 bg-[#1A2636] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Global Pulse Animation (Tailwind Config required or inline) */}
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}