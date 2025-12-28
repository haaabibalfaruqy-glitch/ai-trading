"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/events";
import { hasPremiumAccess, unlockPremium } from "@/lib/premium";

export default function ExecutionGate({
  onConnect,
}: {
  onConnect: () => void;
}) {

  if (hasPremiumAccess()) {
  return null;
}

  // STEP 5C — view tracking
  useEffect(() => {
  trackEvent("execution_gate_view", {
    source: "trade_page",
  });

  trackEvent("execution_blocked", {
    reason: "no_connected_account",
  });
}, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#0B1220] border border-[#1F2937] rounded-2xl p-6 max-w-md w-full mx-4">

        <h2 className="text-white text-xl font-bold mb-2">
          Execution Required
        </h2>

        <p className="text-gray-400 text-sm mb-4">
          To activate live AI execution, a connected trading account is required.
        </p>

        <ul className="text-sm text-gray-300 space-y-1 mb-4">
          <li>✅ Market analyzed</li>
          <li>✅ Strategy selected</li>
          <li>⚠️ Execution not enabled</li>
        </ul>

        <p className="text-gray-400 text-xs mb-4">
          This system does not custody funds or place trades on your behalf.
          Execution happens directly on your connected trading account.
        </p>

        <button
  className="w-full py-3 rounded-xl bg-[#22ff88] text-black font-semibold mb-2"
onClick={() => {
  trackEvent("execution_unlocked", {
    source: "execution_gate",
  });

  unlockPremium("execution_gate"); // 🔓 PREMIUM UNLOCK

  sessionStorage.setItem("executionUnlocked", "true");

  onConnect();
}}
>
  Connect Trading Account
</button>

        <p className="text-xs text-gray-500 text-center">
          Supported platforms: Binance · Bybit · OKX
        </p>

        <p className="text-xs text-gray-500 text-center mt-1">
          No access to withdrawals. You remain in full control of your funds.
        </p>
      </div>
    </div>
  );
}
