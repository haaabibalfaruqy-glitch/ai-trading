// /app/Shared/FeatureLock.tsx

"use client";

import React, { ReactNode, useCallback, useMemo } from "react";
import { useAccess } from "@/context/UserAccessContext";
import { Lock } from "lucide-react"; // Tambahkan icon lucide untuk kesan profesional

export type FeatureLockLevel = "basic" | "advanced" | "premium";

interface FeatureLockProps {
  children: ReactNode;
  level?: FeatureLockLevel;
  preview?: ReactNode;
  showPreview?: boolean;
  onInteract?: () => void;
  label?: string;
  description?: string;
}

const FeatureLock: React.FC<FeatureLockProps> = ({
  children,
  level = "advanced",
  preview,
  showPreview = true,
  onInteract,
  label = "SYSTEM LOCKED",
  description = "AI execution context required to activate this module."
}) => {
  const { access, isLoading } = useAccess();

  const isLocked = useMemo(() => {
    // Jika masih loading, kita anggap terkunci dulu agar tidak bocor (flicker)
    if (isLoading) return true;

    switch (level) {
      case "basic":
        return access === "guest";
      case "advanced":
        return access === "guest"; // Butuh minimal broker_connected
      case "premium":
        return access !== "premium"; // Wajib premium
      default:
        return true;
    }
  }, [access, level, isLoading]);

  const handleInteract = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onInteract?.();
    },
    [onInteract]
  );

  // Jika tidak terkunci, tampilkan konten asli dengan transisi halus
  if (!isLocked) return <div className="animate-in fade-in duration-700">{children}</div>;

  if (!showPreview) return null;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-white/5 bg-[#0B1220]/50 backdrop-blur-md transition-all duration-500 hover:border-blue-500/30"
      onClick={handleInteract}
      role="button"
      aria-disabled="true"
    >
      {/* PREVIEW CONTENT (Blurred) */}
      <div className="pointer-events-none select-none blur-md opacity-40 grayscale-[50%] transition-all duration-700 group-hover:blur-sm">
        {preview ?? children}
      </div>

      {/* OVERLAY GLASS EFFECT */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#0A0F1C]/40 transition-colors duration-500 group-hover:bg-[#0A0F1C]/20">
        <div className="text-center px-6">
          <div className="flex flex-col items-center gap-3">
            {/* Lock Icon with Glow */}
            <div className="relative">
               <div className="absolute inset-0 blur-lg bg-blue-500/20 animate-pulse rounded-full" />
               <Lock className="w-5 h-5 text-blue-400 relative z-10" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                {label}
              </span>
              <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-relaxed font-medium">
                {description}
              </p>
            </div>

            {/* Micro-CTA (Optional Visual) */}
            <div className="mt-2 text-[9px] font-bold text-blue-400/80 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to Unlock
            </div>
          </div>
        </div>
      </div>

      {/* SCANLINE EFFECT (Upgrade Visual) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default FeatureLock;