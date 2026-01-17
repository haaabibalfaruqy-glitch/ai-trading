"use client";

import React, { useState } from "react";
import { connectBroker } from "@/lib/brokers";
import { useAccess } from "@/context/UserAccessContext";

type Props = {
  children?: React.ReactNode;
};

const ExecutionGate: React.FC<Props> = ({ children }) => {
  const { access, unlockBroker } = useAccess();
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);

    // stealth broker session
    connectBroker();

    // unlock global access
    unlockBroker();

    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // already unlocked → just render children
  if (access === "broker_connected") {
    return <>{children}</>;
  }

  // locked view
  return (
    <div className="relative rounded-xl border border-[#1F2937] bg-[#0B1220] p-5">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl" />

      <div className="relative z-10">
        <h3 className="text-white font-semibold mb-2">
          Execution Layer Locked
        </h3>

        <p className="text-sm text-gray-400 mb-4">
          Connect an execution-capable account to unlock full AI context
          and advanced decision paths.
        </p>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="
            bg-[#22ff88]
            text-black
            font-semibold
            px-4 py-2
            rounded-md
            hover:opacity-90
            transition
            disabled:opacity-60
          "
        >
          {loading ? "Initializing..." : "Enable Execution"}
        </button>
      </div>
    </div>
  );
};

export default ExecutionGate;
