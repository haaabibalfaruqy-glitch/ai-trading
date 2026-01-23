// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamic import agar homepage lebih ringan
const CopilotHomepage = dynamic(
  () => import("@/app/Shared/CopilotHomepage"),
  { ssr: false } // hanya render di client
);

/**
 * Homepage utama
 * Menampilkan teaser AI trading melalui CopilotHomepage
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start transition-all duration-500">
      <CopilotHomepage />
    </main>
  );
}
