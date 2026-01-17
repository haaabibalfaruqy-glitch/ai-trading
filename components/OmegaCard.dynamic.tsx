/**
 * OmegaCard Dynamic Import Wrapper
 *
 * Lazy-loads the OmegaCard component with performance optimization.
 * Reduces initial bundle size by deferring AI prediction calculations
 * until the card is actually needed in the viewport.
 */

import dynamic from "next/dynamic";

const CardSkeleton = () => (
  <div className="w-full aspect-[16/10] bg-[#0C1322] border border-[#1A2636] rounded-2xl p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-xl bg-[#1a2a3a]" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 bg-[#1a2a3a] rounded w-24" />
        <div className="h-3 bg-[#1a2a3a] rounded w-16" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#1a2a3a] rounded-lg" />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#1c2b3d]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 bg-[#1a2a3a] rounded" />
      ))}
    </div>
  </div>
);

const OmegaCardDynamic = dynamic(
  () => import("./OmegaCard").then((mod) => ({ default: mod.OmegaCard })),
  {
    loading: () => <CardSkeleton />,
    ssr: true, // Enable SSR for better initial render
  }
);

export default OmegaCardDynamic;
