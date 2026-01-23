// C:\ai_trading\app\Shared\OmegaCard.dynamic.tsx

import dynamic from "next/dynamic";
import OmegaCardSkeleton from "./OmegaCardSkeleton";

/**
 * FIX: Menangani Type Error 2339 dengan casting 'any' 
 * atau memastikan akses ke Named Export yang benar.
 */
const OmegaCardDynamic = dynamic(
  () =>
    import("./OmegaCard").then((mod) => {
      // Jika kamu menggunakan 'export function OmegaCard', ambil mod.OmegaCard
      // Jika kamu menggunakan 'export default', ambil mod.default
      const Component = mod.OmegaCard || (mod as any).default;
      
      if (!Component) {
        console.error("OmegaCard component not found. Check your exports in OmegaCard.tsx");
      }
      
      return Component;
    }),
  {
    loading: () => <OmegaCardSkeleton />,
    ssr: true,
  }
);

OmegaCardDynamic.displayName = "OmegaCardDynamic";

export default OmegaCardDynamic;