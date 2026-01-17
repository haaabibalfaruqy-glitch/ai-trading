"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AccessState = "guest" | "broker_connected";

type AccessContextType = {
  access: AccessState;
  unlockBroker: () => void;
};

const AccessContext = createContext<AccessContextType | null>(null);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useState<AccessState>("guest");

  useEffect(() => {
    const saved = localStorage.getItem("access_state");
    if (saved === "broker_connected") {
      setAccess("broker_connected");
    }
  }, []);

  const unlockBroker = () => {
    localStorage.setItem("access_state", "broker_connected");
    setAccess("broker_connected");
  };

  return (
    <AccessContext.Provider value={{ access, unlockBroker }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error("useAccess must be used inside AccessProvider");
  }
  return ctx;
}
