/* =========================================
   Storage Utilities (Local & Session)
   ========================================= */

const STORAGE_PREFIX = "ai_trading:";

/* -----------------------------------------
   Helpers
------------------------------------------ */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeJSONParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

/* -----------------------------------------
   Local Storage
------------------------------------------ */

export interface StoredValue<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Load value from localStorage with optional TTL
 */
export function loadLocal<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  const parsed = safeJSONParse<StoredValue<T> | null>(raw, null);

  if (!parsed) return fallback;

  if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return fallback;
  }

  return parsed.value;
}

/**
 * Save value to localStorage with optional TTL (ms)
 */
export function saveLocal<T>(
  key: string,
  value: T,
  ttlMs?: number
): void {
  if (!isBrowser()) return;

  try {
    const payload: StoredValue<T> = {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    };

    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(payload)
    );
  } catch (err) {
    console.error("[storage] Failed to save local:", err);
  }
}

/**
 * Remove localStorage key
 */
export function removeLocal(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/* -----------------------------------------
   Session Storage
------------------------------------------ */

/**
 * Read sessionStorage (type-safe)
 */
export function readSession<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
  return safeJSONParse<T>(raw, fallback);
}

/**
 * Write sessionStorage
 */
export function writeSession<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(value)
    );
  } catch (err) {
    console.error("[storage] Failed to write session:", err);
  }
}

/**
 * Remove sessionStorage key
 */
export function removeSession(key: string): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_PREFIX + key);
}

/* -----------------------------------------
   Legacy Compatibility (DO NOT BREAK)
------------------------------------------ */

/**
 * Backward compatible — coin order
 */
export function loadCoinOrder(): string[] | null {
  return loadLocal<string[]>("coinOrder", null);
}

export function saveCoinOrder(order: string[]): void {
  saveLocal("coinOrder", order);
}
// create Coin object with name, symbol, price, short
  