// lib/contextTypes.ts
import { ReactNode } from "react";
import { AccessState, UserAccess, AccessContextType } from "@/context/UserAccessContext";

export type { AccessState, UserAccess, AccessContextType };

export interface AccessProviderProps {
  children: ReactNode;
}

export { useAccess, useIsAuthenticated, useIsPremium, useIsBrokerUnlocked } from "@/context/UserAccessContext";
