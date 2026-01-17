/* Re-export all context types for convenient importing */
export type {
  AccessState,
  UserAccess,
  AccessContextType,
  AccessProviderProps,
} from "@/context/UserAccessContext";

export {
  useAccess,
  useIsAuthenticated,
  useIsPremium,
} from "@/context/UserAccessContext";
