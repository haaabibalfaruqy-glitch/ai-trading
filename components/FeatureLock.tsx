"use client";

import React, { ReactNode } from "react";
import { useAccess } from "@/context/UserAccessContext";

type FeatureLockLevel = "basic" | "advanced" | "premium";

interface FeatureLockProps {
  children: ReactNode;
  level?: FeatureLockLevel;
  preview?: ReactNode; // blurred preview shown when locked
  showPreview?: boolean; // whether to show preview at all
  onInteract?: () => void; // called when locked user tries to interact
}

/**
 * GLOBAL FEATURE LOCK SYSTEM
 *
 * Wraps premium AI features with:
 * - Locked preview rendering (blurred)
 * - Interaction prevention
 * - SaaS-style unlock CTA
 *
 * Rules:
 * - Locked users can SEE but NOT INTERACT
 * - Any interaction triggers BrokerUnlockCTA
 * - NO affiliate/referral/IB language
 */
export const FeatureLock: React.FC<FeatureLockProps> = ({
  children,
  level = "advanced",
  preview,
  showPreview = true,
  onInteract,
}) => {
  const { access } = useAccess();

  // Determine if feature is locked
  const isLocked =
    (level === "basic" && access === "guest") ||
    (level === "advanced" && access !== "premium") ||
    (level === "premium" && access === "guest");

  // If unlocked, show children normally
  if (!isLocked) {
    return <>{children}</>;
  }

  // If locked and no preview requested, show nothing
  if (!showPreview) {
    return null;
  }

  // Locked state: show blurred preview with overlay
  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
        onInteract?.();
      }}
    >
      {/* BLURRED PREVIEW */}
      <div className="pointer-events-none blur-sm opacity-50">
        {preview || children}
      </div>

      {/* LOCKED OVERLAY */}
      <div
        className="
          absolute inset-0
          flex items-center justify-center
          bg-black/30 backdrop-blur-sm
          rounded-xl
          cursor-not-allowed
          hover:bg-black/40
          transition
        "
      >
        <div className="text-center">
          <div className="text-sm font-semibold text-white mb-1">
            🔒 Locked
          </div>
          <div className="text-xs text-gray-300">
            Connect broker to unlock
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureLock;
