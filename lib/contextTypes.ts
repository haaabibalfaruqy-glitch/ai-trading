// C:\ai_trading\lib\contextTypes.ts

import { ReactNode } from "react";
// Import tipe asli dari context
import { AccessState as OriginalAccessState, UserAccess as OriginalUserAccess } from "@/context/UserAccessContext";

/* ============================================================
    RE-EXPORTS & TYPES SINKRONISASI
   ============================================================ */

// Re-export hooks agar komponen bisa import dari satu pintu (lib)
export { 
  useAccess, 
  useIsAuthenticated, 
  useIsPremium, 
  useIsBrokerUnlocked 
} from "@/context/UserAccessContext";

// Export kembali tipe datanya agar dikenali oleh lib/index.ts
export type AccessState = OriginalAccessState;
export type UserAccess = OriginalUserAccess;

export interface AccessContextType {
  access: AccessState;
  userAccess: UserAccess | null;
  unlockBroker: () => void;
  setPremiumAccess: (expiresAt?: number) => void;
  resetAccess: () => void;
  isAuthenticated: boolean;
  isPremium: boolean;
  isBrokerUnlocked: boolean;
  isLoading: boolean;
}

export interface AccessProviderProps {
  children: ReactNode;
}

// Tambahan interface pembantu
export interface AppAccessState {
  access: AccessState;
  userAccess: UserAccess | null;
  isLoading: boolean;
}