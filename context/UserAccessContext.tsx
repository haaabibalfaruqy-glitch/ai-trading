"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

/* ============================================================
   ACCESS CONTROL TYPES
============================================================ */
export type AccessState = "guest" | "broker_connected" | "premium";

export interface UserAccess {
  state: AccessState;
  connectedAt?: number;
  expiresAt?: number;
}

export interface AccessContextType {
  access: AccessState;
  userAccess: UserAccess | null;
  unlockBroker: () => void;
  setPremiumAccess: (expiresAt?: number) => void;
  resetAccess: () => void;
}

export interface AccessProviderProps {
  children: ReactNode;
}

/* ============================================================
   CONTEXT CREATION
============================================================ */
const AccessContext = createContext<AccessContextType | null>(null);

/* ============================================================
   ACCESS PROVIDER
============================================================ */
export function AccessProvider({ children }: AccessProviderProps) {
  const [access, setAccess] = useState<AccessState>("guest");
  const [userAccess, setUserAccess] = useState<UserAccess | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("access_state");
    const savedAccess = localStorage.getItem("user_access");

    if (saved === "broker_connected" || saved === "premium") {
      setAccess(saved as AccessState);
    }

    if (savedAccess) {
      try {
        setUserAccess(JSON.parse(savedAccess));
      } catch (err) {
        console.warn("[Access] Failed to parse stored access:", err);
      }
    }
  }, []);

  // Unlock broker connection
  const unlockBroker = () => {
    const newAccess: UserAccess = {
      state: "broker_connected",
      connectedAt: Date.now(),
    };

    localStorage.setItem("access_state", "broker_connected");
    localStorage.setItem("user_access", JSON.stringify(newAccess));

    setAccess("broker_connected");
    setUserAccess(newAccess);
  };

  // Set premium access with optional expiration
  const setPremiumAccess = (expiresAt?: number) => {
    const newAccess: UserAccess = {
      state: "premium",
      connectedAt: Date.now(),
      expiresAt,
    };

    localStorage.setItem("access_state", "premium");
    localStorage.setItem("user_access", JSON.stringify(newAccess));

    setAccess("premium");
    setUserAccess(newAccess);
  };

  // Reset access to guest
  const resetAccess = () => {
    localStorage.removeItem("access_state");
    localStorage.removeItem("user_access");

    setAccess("guest");
    setUserAccess(null);
  };

  const value: AccessContextType = {
    access,
    userAccess,
    unlockBroker,
    setPremiumAccess,
    resetAccess,
  };

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
}

/* ============================================================
   ACCESS HOOK
============================================================ */
export function useAccess(): AccessContextType {
  const ctx = useContext(AccessContext);

  if (!ctx) {
    throw new Error(
      "[useAccess] Hook must be used inside AccessProvider. " +
      "Ensure AccessProvider wraps your component tree in layout.tsx"
    );
  }

  return ctx;
}

/* ============================================================
   ACCESS UTILITIES
============================================================ */
export function useIsAuthenticated(): boolean {
  const { access } = useAccess();
  return access !== "guest";
}

export function useIsPremium(): boolean {
  const { access } = useAccess();
  return access === "premium";
}
