"use client";

import React, { useState } from "react";
import { connectBroker } from "@/lib/brokers";
import { useAccess } from "@/context/UserAccessContext";

type Props = {
  children?: React.ReactNode;
  onUnlock?: () => void;
};

/**
 * EXECUTION GATE – PROFESSIONAL SAAS UNLOCK
 *
 * - Shows locked overlay with blurred preview
 * - Triggers broker connection on user interaction
 * - NO affiliate/referral language
 * - Professional tone throughout
 */
const ExecutionGate: React.FC<Props> = ({ children, onUnlock }) => {
  const { access, unlockBroker } = useAccess();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConnect = () => {
    setLoading(true);

    // Connect broker session
    connectBroker();

    // Unlock access
    unlockBroker();

    // Notify parent
    onUnlock?.();

    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
    }, 800);
  };

  // Already unlocked → render children normally
  if (access === "broker_connected" || access === "premium") {
    return <>{children}</>;
  }

  // Locked state: show blurred content + overlay
  return (
    <>
      {/* BLURRED PREVIEW WITH OVERLAY */}
      <div
        className="relative rounded-xl overflow-hidden"
        onClick={() => setShowModal(true)}
      >
        {/* Blurred content */}
        <div className="blur-sm opacity-40 pointer-events-none">
          {children}
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl hover:bg-black/30 transition cursor-pointer">
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-2">
              🔒 AI System Locked
            </div>
            <div className="text-sm text-gray-300">
              Connect broker to unlock advanced AI features
            </div>
          </div>
        </div>
      </div>

      {/* UNLOCK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !loading && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative z-50 w-full max-w-md bg-[#0B1220] border border-[#22ff88]/30 rounded-2xl p-6 shadow-[0_0_60px_rgba(34,255,136,0.25)]">
            {/* Close button */}
            <button
              onClick={() => !loading && setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              disabled={loading}
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-3">
                Connect Broker to Unlock AI
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Authorize a secure read-only connection to unlock advanced AI market analysis, 
                strategy recommendations, and real-time portfolio insights. Your trading decisions 
                remain fully in your control.
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-3 mb-8">
              {[
                "AI-powered market analysis & signals",
                "Behavior-based strategy recommendations",
                "Real-time portfolio risk assessment",
                "Institutional-grade signal detection",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-gray-300"
                >
                  <span className="text-[#22ff88] font-bold mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={handleConnect}
              disabled={loading}
              className="
                w-full
                py-3 rounded-xl
                bg-gradient-to-r from-[#22ff88] to-[#3cffaa]
                text-black font-bold text-sm
                shadow-[0_10px_30px_rgba(34,255,136,0.45)]
                hover:shadow-[0_15px_40px_rgba(34,255,136,0.55)]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
              "
            >
              {loading ? "Connecting..." : "Connect Broker"}
            </button>

            {/* Security & privacy info */}
            <div className="mt-5 p-3 rounded-lg bg-[#0A0F1C] border border-[#1F2937]">
              <p className="text-xs text-gray-400 mb-2">
                <span className="text-[#22ff88] font-semibold">Secure • Read-only • No trading permission</span>
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your API key is encrypted. We never execute trades or access your funds. 
                AI analysis remains advisory only.
              </p>
            </div>

            {/* Trust line */}
            <p className="mt-4 text-xs text-center text-gray-500">
              No credit card required • Instant unlock • Cancel anytime
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ExecutionGate;
