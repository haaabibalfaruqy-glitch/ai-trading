// components/ExecutionGate.tsx

"use client";

import React, { useState, useEffect } from "react";
import { connectBroker, BROKERS } from "@/lib/brokers";
import { useAccess } from "@/context/UserAccessContext";
import { trackEvent } from "@/lib/events"; // Sinkronisasi Urutan 14

type Props = {
  children?: React.ReactNode;
  onUnlock?: () => void;
};

const ExecutionGate: React.FC<Props> = ({ children, onUnlock }) => {
  const { access, unlockBroker } = useAccess();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Auto-track view saat modal terbuka
  useEffect(() => {
    if (showModal) {
      trackEvent("execution_gate_view");
    }
  }, [showModal]);

  const handleConnect = async () => {
    setLoading(true);
    trackEvent("execution_gate_click");

    try {
      // ✅ Connect default broker logic
      const defaultBrokerKey = Object.keys(BROKERS)[0] as keyof typeof BROKERS;
      await connectBroker(defaultBrokerKey);

      // Sinkronisasi Global State
      unlockBroker();
      trackEvent("execution_unlocked", { broker: defaultBrokerKey });

      // Delay kecil untuk sensasi "Neural Processing"
      setTimeout(() => {
        setLoading(false);
        setShowModal(false);
        onUnlock?.();
      }, 1500);
    } catch (error) {
      setLoading(false);
      trackEvent("execution_blocked", { error: "connection_failed" });
    }
  };

  /* ===============================
      UNLOCKED STATE
  =============================== */
  if (access === "broker_connected" || access === "premium") {
    return <>{children}</>;
  }

  /* ===============================
      LOCKED UI (The "Soft" Gate)
  =============================== */
  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:ring-2 hover:ring-neon-pink/30"
        onClick={() => setShowModal(true)}
      >
        {/* Preview Content dengan Blur bertingkat */}
        <div className="filter blur-[6px] grayscale opacity-40 pointer-events-none select-none transition-all duration-700 group-hover:blur-[4px] group-hover:opacity-50">
          {children}
        </div>

        {/* Floating Locked Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] group-hover:bg-black/20 transition-all duration-500">
          <div className="bg-black/60 border border-white/10 px-4 py-2 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform">
             <span className="text-xs font-bold tracking-widest text-neon-pink uppercase drop-shadow-[0_0_8px_rgba(255,0,128,0.8)]">
                🔒 Neural Context Locked
             </span>
          </div>
          <p className="mt-3 text-[10px] text-gray-400 font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
            CLICK TO INITIALIZE SECURE SESSION
          </p>
        </div>
      </div>

      {/* ===============================
          MODAL INTERFACE
      =============================== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop Ultra-Dark */}
          <div
            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => !loading && setShowModal(false)}
          />

          {/* Modal Container */}
          <div className="relative z-50 w-full max-w-md bg-[#0B1220] border border-neon-green/20 rounded-[2rem] p-8 shadow-[0_0_100px_rgba(34,255,136,0.1)] animate-in zoom-in-95 duration-300">
            
            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-pink/10 border border-neon-pink/20 mb-4 animate-pulse">
                <span className="text-2xl">🧠</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Unlock <span className="text-neon-pink">AI Execution</span>
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Elevate your dashboard with real-time institutional analysis.
              </p>
            </div>

            {/* List Capability with Neon Dots */}
            <div className="space-y-4 mb-8">
              {[
                "Advanced Liquidity Map Access",
                "Context-Aware Neural Strategy",
                "Volatility Risk Suppression",
                "Non-Executive Read-Only Port"
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#22ff88]" />
                  <span className="text-sm text-gray-300 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Main Action */}
            <button
              onClick={handleConnect}
              disabled={loading}
              className="group relative w-full py-4 rounded-2xl bg-white text-black font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">
                {loading ? "ESTABLISHING NEURAL LINK..." : "INITIALIZE BROKER SESSION"}
              </span>
            </button>

            {/* Security Compliance Footer */}
            <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
              <div className="flex justify-center gap-4 opacity-50 mb-4">
                <span className="text-[10px] border border-white/20 px-2 py-0.5 rounded">256-BIT SSL</span>
                <span className="text-[10px] border border-white/20 px-2 py-0.5 rounded">READ ONLY</span>
                <span className="text-[10px] border border-white/20 px-2 py-0.5 rounded">SIPC INSURED</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">
                No trades will be executed without manual confirmation.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ExecutionGate;