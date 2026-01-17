"use client";

export default function LoadingTrade() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0A0F1C] via-[#0B1220] to-[#070B14] text-white pb-20">
      {/* SKELETON HERO STATS */}
      <div className="pt-8 px-4 container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#0B1220] border border-[#1F2937] rounded-2xl p-4 animate-pulse"
            >
              <div className="h-3 bg-[#1F2937] rounded w-1/2 mb-2" />
              <div className="h-6 bg-[#1F2937] rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* SKELETON CHART */}
        <div className="mb-8 p-6 bg-[#0B1220] border border-[#1F2937] rounded-3xl animate-pulse">
          <div className="h-4 bg-[#1F2937] rounded w-1/3 mb-4" />
          <div className="h-80 bg-[#1c2b3d] rounded-xl" />
        </div>

        {/* SKELETON FILTER BAR */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 min-w-[120px] bg-[#0B1220] border border-[#1F2937] rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* SKELETON TABLE ROWS */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 bg-[#0B1220] border border-[#1F2937] rounded-2xl animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 bg-[#1F2937] rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-[#1F2937] rounded w-2/3 mb-2" />
                    <div className="h-3 bg-[#1F2937] rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-[#1F2937] rounded" />
                  <div className="h-6 w-16 bg-[#1F2937] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATED LOADING INDICATOR */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
