/**
 * Feature State Manager
 * Handles lock/unlock state for cards and features with event integration
 */

import { AccessState } from "@/context/UserAccessContext";

/* ============================================================
   TYPES & INTERFACES
============================================================ */

export type FeatureName =
  | "ai_predictions"
  | "market_data"
  | "profit_table"
  | "trust_metrics"
  | "governance"
  | "system_status"
  | "advanced_charts"
  | "real_time_alerts"
  | "broker_connection"
  | "affiliate_link";

export type LockStatus = "locked" | "unlocking" | "unlocked";

export interface FeatureState {
  name: FeatureName;
  status: LockStatus;
  accessLevel: AccessState;
  unlockedAt?: number; // Timestamp when unlocked
  expiresAt?: number; // For time-based unlocks (premium expiry)
  canUnlock: boolean;
  errorMessage?: string;
}

export type FeatureStateMap = {
  [key in FeatureName]?: FeatureState;
};

export interface UnlockRequest {
  feature: FeatureName;
  accessLevel: AccessState;
  metadata?: Record<string, any>;
}

export interface UnlockResponse {
  success: boolean;
  feature: FeatureName;
  status: LockStatus;
  message?: string;
  expiresAt?: number;
}

/* ============================================================
   LISTENERS & CALLBACKS
============================================================ */

type StateListener = (state: FeatureState) => void;
type StateChangeListener = (previous: FeatureState, current: FeatureState) => void;

/* ============================================================
   FEATURE STATE MANAGER
============================================================ */

class FeatureStateManager {
  private features = new Map<FeatureName, FeatureState>();
  private listeners = new Map<FeatureName, Set<StateListener>>();
  private changeListeners = new Map<FeatureName, Set<StateChangeListener>>();
  private globalListeners = new Set<(feature: FeatureName) => void>();

  constructor() {
    this.initializeFeatures();
  }

  /**
   * Initialize all features with locked state
   */
  private initializeFeatures(): void {
    const featureNames: FeatureName[] = [
      "ai_predictions",
      "market_data",
      "profit_table",
      "trust_metrics",
      "governance",
      "system_status",
      "advanced_charts",
      "real_time_alerts",
      "broker_connection",
      "affiliate_link",
    ];

    featureNames.forEach((name) => {
      this.features.set(name, {
        name,
        status: "locked",
        accessLevel: "guest",
        canUnlock: false,
      });
      this.listeners.set(name, new Set());
      this.changeListeners.set(name, new Set());
    });

    this.loadFromStorage();
  }

  /**
   * Get feature state
   */
  getFeature(name: FeatureName): FeatureState {
    return (
      this.features.get(name) || {
        name,
        status: "locked",
        accessLevel: "guest",
        canUnlock: false,
      }
    );
  }

  /**
   * Get all features
   */
  getAllFeatures(): FeatureState[] {
    return Array.from(this.features.values());
  }

  /**
   * Check if feature is unlocked
   */
  isUnlocked(name: FeatureName): boolean {
    return this.getFeature(name).status === "unlocked";
  }

  /**
   * Check if feature can be unlocked
   */
  canUnlock(name: FeatureName): boolean {
    return this.getFeature(name).canUnlock;
  }

  /**
   * Unlock a feature
   */
  async unlockFeature(request: UnlockRequest): Promise<UnlockResponse> {
    const feature = this.getFeature(request.feature);

    // Validate unlock request
    if (!this.validateUnlockRequest(request)) {
      return {
        success: false,
        feature: request.feature,
        status: feature.status,
        message: "Unlock request validation failed",
      };
    }

    try {
      // Update to unlocking state
      this.setFeatureState(request.feature, {
        ...feature,
        status: "unlocking",
        accessLevel: request.accessLevel,
      });

      // Simulate unlock process
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get expiry time based on access level
      const expiresAt = this.getExpiryTime(request.accessLevel);

      // Update to unlocked
      const newState: FeatureState = {
        ...feature,
        name: request.feature,
        status: "unlocked",
        accessLevel: request.accessLevel,
        unlockedAt: Date.now(),
        expiresAt,
        canUnlock: true,
      };

      this.setFeatureState(request.feature, newState);
      this.saveToStorage();

      // Emit event
      this.emitGlobalEvent(request.feature);

      return {
        success: true,
        feature: request.feature,
        status: "unlocked",
        expiresAt,
      };
    } catch (error) {
      return {
        success: false,
        feature: request.feature,
        status: feature.status,
        message: String(error),
      };
    }
  }

  /**
   * Lock a feature (admin/system)
   */
  lockFeature(name: FeatureName, reason?: string): void {
    const feature = this.getFeature(name);
    this.setFeatureState(name, {
      ...feature,
      status: "locked",
      canUnlock: false,
      errorMessage: reason,
    });
    this.saveToStorage();
  }

  /**
   * Unlock multiple features at once
   */
  async unlockMultiple(
    requests: UnlockRequest[]
  ): Promise<Map<FeatureName, UnlockResponse>> {
    const results = new Map<FeatureName, UnlockResponse>();

    for (const request of requests) {
      const response = await this.unlockFeature(request);
      results.set(request.feature, response);
    }

    return results;
  }

  /**
   * Validate unlock request
   */
  private validateUnlockRequest(request: UnlockRequest): boolean {
    // Guest cannot unlock anything
    if (request.accessLevel === "guest") {
      return false;
    }

    // Broker connected or premium can unlock
    if (request.accessLevel === "broker_connected" || request.accessLevel === "premium") {
      return true;
    }

    return false;
  }

  /**
   * Get expiry time based on access level
   */
  private getExpiryTime(accessLevel: AccessState): number | undefined {
    if (accessLevel === "premium") {
      // Premium expires in 30 days
      return Date.now() + 30 * 24 * 60 * 60 * 1000;
    }

    if (accessLevel === "broker_connected") {
      // Broker connected expires in 90 days
      return Date.now() + 90 * 24 * 60 * 60 * 1000;
    }

    return undefined;
  }

  /**
   * Check and expire features
   */
  checkExpiry(): void {
    const now = Date.now();

    this.features.forEach((feature) => {
      if (
        feature.expiresAt &&
        feature.expiresAt < now &&
        feature.status === "unlocked"
      ) {
        this.lockFeature(feature.name, "Access expired");
      }
    });
  }

  /**
   * Subscribe to feature state changes
   */
  subscribe(name: FeatureName, listener: StateListener): () => void {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }

    this.listeners.get(name)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(name)?.delete(listener);
    };
  }

  /**
   * Subscribe to feature state transitions
   */
  onStateChange(
    name: FeatureName,
    listener: StateChangeListener
  ): () => void {
    if (!this.changeListeners.has(name)) {
      this.changeListeners.set(name, new Set());
    }

    this.changeListeners.get(name)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.changeListeners.get(name)?.delete(listener);
    };
  }

  /**
   * Subscribe to any feature change
   */
  onAnyChange(listener: (feature: FeatureName) => void): () => void {
    this.globalListeners.add(listener);
    return () => this.globalListeners.delete(listener);
  }

  /**
   * Emit state change
   */
  private setFeatureState(name: FeatureName, newState: FeatureState): void {
    const oldState = this.features.get(name);

    this.features.set(name, newState);

    // Notify state listeners
    this.listeners.get(name)?.forEach((listener) => listener(newState));

    // Notify change listeners
    if (oldState) {
      this.changeListeners.get(name)?.forEach((listener) => listener(oldState, newState));
    }

    // Notify global listeners
    this.emitGlobalEvent(name);
  }

  /**
   * Emit global event
   */
  private emitGlobalEvent(feature: FeatureName): void {
    this.globalListeners.forEach((listener) => listener(feature));
  }

  /**
   * Persist to storage
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const state: FeatureStateMap = {};
      this.features.forEach((feature) => {
        state[feature.name] = feature;
      });
      localStorage.setItem("feature_states", JSON.stringify(state));
    } catch (error) {
      console.warn("[FeatureStateManager] Failed to save to storage:", error);
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("feature_states");
      if (stored) {
        const state: FeatureStateMap = JSON.parse(stored);
        Object.entries(state).forEach(([name, feature]) => {
          if (name in this.features) {
            this.features.set(name as FeatureName, feature);
          }
        });
      }
    } catch (error) {
      console.warn("[FeatureStateManager] Failed to load from storage:", error);
    }
  }

  /**
   * Reset all features to locked state
   */
  resetAll(): void {
    this.features.forEach((feature) => {
      feature.status = "locked";
      feature.canUnlock = false;
      feature.unlockedAt = undefined;
      feature.expiresAt = undefined;
    });
    this.saveToStorage();
  }

  /**
   * Get feature statistics
   */
  getStats(): {
    total: number;
    unlocked: number;
    locked: number;
    unlocking: number;
    expiringSoon: number;
  } {
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    let unlocked = 0;
    let locked = 0;
    let unlocking = 0;
    let expiringSoon = 0;

    this.features.forEach((feature) => {
      if (feature.status === "unlocked") unlocked++;
      else if (feature.status === "locked") locked++;
      else if (feature.status === "unlocking") unlocking++;

      if (
        feature.expiresAt &&
        feature.expiresAt - now < thirtyDaysMs &&
        feature.expiresAt > now
      ) {
        expiringSoon++;
      }
    });

    return {
      total: this.features.size,
      unlocked,
      locked,
      unlocking,
      expiringSoon,
    };
  }

  /**
   * Debug: Print all feature states
   */
  debug(): void {
    console.group("[FeatureStateManager]");
    console.log("Feature States:");
    this.features.forEach((feature) => {
      console.log(`  ${feature.name}: ${feature.status} (${feature.accessLevel})`);
    });
    console.log("Stats:", this.getStats());
    console.groupEnd();
  }
}

/* ============================================================
   SINGLETON INSTANCE
============================================================ */

export const featureStateManager = new FeatureStateManager();

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

/**
 * Unlock feature with access level check
 */
export async function unlockFeatureByAccess(
  feature: FeatureName,
  accessLevel: AccessState
): Promise<UnlockResponse> {
  return featureStateManager.unlockFeature({
    feature,
    accessLevel,
  });
}

/**
 * Unlock all features for user
 */
export async function unlockAllFeatures(
  accessLevel: AccessState
): Promise<Map<FeatureName, UnlockResponse>> {
  const allFeatures = featureStateManager.getAllFeatures();
  const requests = allFeatures.map((f) => ({
    feature: f.name,
    accessLevel,
  }));

  return featureStateManager.unlockMultiple(requests);
}

/**
 * Batch unlock specific features
 */
export async function unlockFeaturesForTier(
  accessLevel: AccessState,
  features: FeatureName[]
): Promise<Map<FeatureName, UnlockResponse>> {
  const requests = features.map((f) => ({
    feature: f,
    accessLevel,
  }));

  return featureStateManager.unlockMultiple(requests);
}
