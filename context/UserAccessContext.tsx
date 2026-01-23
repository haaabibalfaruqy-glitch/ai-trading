// C:\ai_trading\context\UserAccessContext.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

/* ================= TYPES ================= */

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
  isAuthenticated: boolean;
  isPremium: boolean;
  isBrokerUnlocked: boolean;
  isLoading: boolean; // Tambahan untuk handle loading state
}

/* ================= CONSTANTS ================= */

const STORAGE_KEY = "ai_trading_access_vault"; // Key unik agar tidak bentrok

const AccessContext = createContext<AccessContextType | null>(null);

/* ================= PROVIDER ================= */

export function AccessProvider({ children }: { children: ReactNode }) {
  const [access, setAccess] = useState<AccessState>("guest");
  const [userAccess, setUserAccess] = useState<UserAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi Reset (dibuat hoisting agar bisa dipanggil di useEffect)
  const resetAccess = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAccess("guest");
    setUserAccess(null);
  }, []);

  /* ===== LOAD & SYNC DATA ===== */
  useEffect(() => {
    const syncAccess = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: UserAccess = JSON.parse(saved);

          // Cek Expiry
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            resetAccess();
          } else {
            setAccess(parsed.state);
            setUserAccess(parsed);
          }
        }
      } catch (err) {
        console.error("[Access] Sync Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Jalankan saat pertama load
    syncAccess();

    // Listener untuk sinkronisasi antar TAB browser
    window.addEventListener("storage", syncAccess);
    return () => window.removeEventListener("storage", syncAccess);
  }, [resetAccess]);

  /* ===== ACTIONS ===== */

  const updateAccess = useCallback((newAccess: UserAccess) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAccess));
    setAccess(newAccess.state);
    setUserAccess(newAccess);
  }, []);

  const unlockBroker = useCallback(() => {
    updateAccess({
      state: "broker_connected",
      connectedAt: Date.now(),
    });
  }, [updateAccess]);

  const setPremiumAccess = useCallback((expiresAt?: number) => {
    updateAccess({
      state: "premium",
      connectedAt: Date.now(),
      expiresAt: expiresAt || Date.now() + 30 * 24 * 60 * 60 * 1000, // Default 30 hari
    });
  }, [updateAccess]);

  /* ===== DERIVED VALUES ===== */
  // useMemo memastikan komponen tidak re-render kecuali data ini berubah
  const value = useMemo(() => ({
    access,
    userAccess,
    unlockBroker,
    setPremiumAccess,
    resetAccess,
    isAuthenticated: access !== "guest",
    isPremium: access === "premium",
    isBrokerUnlocked: access === "broker_connected" || access === "premium",
    isLoading,
  }), [access, userAccess, unlockBroker, setPremiumAccess, resetAccess, isLoading]);

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
}

/* ================= HOOKS ================= */

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessProvider");
  return ctx;
}