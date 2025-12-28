"use client";

import { hasPremiumAccess } from "@/lib/premium";

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-white/10">
  © {new Date().getFullYear()} CryptoAI. All rights reserved.

  {hasPremiumAccess() && (
    <div className="text-xs text-[#22ff88] mt-2">
      Premium member connected
    </div>
  )}
</footer>
  );
}
