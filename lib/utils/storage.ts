/**
 * Storage utility functions for localStorage and sessionStorage
 */

/**
 * Load coin order from localStorage
 */
export function loadCoinOrder(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("coinOrder");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save coin order to localStorage
 */
export function saveCoinOrder(order: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("coinOrder", JSON.stringify(order));
  } catch {
    console.error("Failed to save coin order");
  }
}

/**
 * Read value from sessionStorage with type safety
 */
export function readSession<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Write value to sessionStorage
 */
export function writeSession(key: string, value: any): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
}
