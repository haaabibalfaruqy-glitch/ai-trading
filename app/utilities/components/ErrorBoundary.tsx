"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  moduleName?: string;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Log tetap ada tapi tidak ganggu user
    console.error("[AI MODULE ERROR]", {
      module: this.props.moduleName ?? "unknown",
      error,
      info,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="
              w-full
              rounded-2xl
              border border-[#1F2937]
              bg-[#0B1220]
              px-5 py-6
              text-center
              shadow-[inset_0_1px_0_#ffffff08]
              animate-fade-in
            "
          >
            <div className="flex flex-col items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />

              <p className="text-sm font-medium text-white">
                AI module temporarily recalibrating
              </p>

              <p className="text-[11px] text-gray-500 max-w-sm">
                This section is momentarily unavailable while the system
                re-aligns analytical context. No action is required.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
