"use client";

import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

// Lazy load the Copilot Homepage for better performance
const CopilotHomepage = dynamicImport(() => import("@/components/CopilotHomepage"), {
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-b from-[#0A0F1C] via-[#0B1220] to-[#070B14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#22ff88]/30 border-t-[#22ff88] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading AI Copilot...</p>
      </div>
    </div>
  ),
  ssr: true,
});

export default function HomePage() {
  return <CopilotHomepage />;
}
