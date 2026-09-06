/**
 * Safe Storage Utility
 * Prevents White Screen of Death (WSOD) caused by:
 * - Safari Private Mode (SecurityError: The operation is insecure)
 * - In-App WebViews (WhatsApp, Telegram, Facebook, TikTok) blocking storage
 * - Corrupted JSON parsing exceptions
 */

// In-memory fallback if localStorage is completely blocked or restricted
const memoryFallback = new Map<string, string>();

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__naqla_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const storageAvailable = isStorageAvailable();

export const safeStorage = {
  getItem(key: string, defaultValue: string | null = null): string | null {
    if (typeof window === 'undefined') return defaultValue;
    try {
      if (storageAvailable) {
        const val = window.localStorage.getItem(key);
        return val !== null ? val : defaultValue;
      }
    } catch (e) {
      console.warn(`[safeStorage] Failed reading key "${key}":`, e);
    }
    return memoryFallback.has(key) ? (memoryFallback.get(key) as string) : defaultValue;
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      if (storageAvailable) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[safeStorage] Failed writing key "${key}":`, e);
    }
    memoryFallback.set(key, value);
  },

  getJSON<T>(key: string, fallback: T): T {
    const raw = this.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[safeStorage] Corrupted JSON for "${key}":`, e);
      return fallback;
    }
  },

  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[safeStorage] Failed serializing JSON for "${key}":`, e);
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
    memoryFallback.delete(key);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      if (storageAvailable) {
        window.localStorage.clear();
      }
    } catch (e) {}
    memoryFallback.clear();
  }
};
