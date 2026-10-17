import { STORAGE_KEYS, DEFAULT_SETTINGS } from './constants.js';

/**
 * Safe browser storage helper supporting Firefox WebExtensions API and fallback environments.
 */
function getStorage() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
    return browser.storage.local;
  }
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return chrome.storage.local;
  }
  // In-memory fallback for testing / non-extension contexts
  if (!globalThis._mockStorage) {
    globalThis._mockStorage = {};
  }
  return {
    async get(keys) {
      if (typeof keys === 'string') {
        return { [keys]: globalThis._mockStorage[keys] };
      }
      if (Array.isArray(keys)) {
        const res = {};
        for (const k of keys) res[k] = globalThis._mockStorage[k];
        return res;
      }
      return { ...globalThis._mockStorage };
    },
    async set(items) {
      Object.assign(globalThis._mockStorage, items);
    },
    async remove(keys) {
      const arr = Array.isArray(keys) ? keys : [keys];
      for (const k of arr) delete globalThis._mockStorage[k];
    },
    async clear() {
      globalThis._mockStorage = {};
    }
  };
}

/**
 * Loads user settings merged with defaults.
 * @returns {Promise<typeof DEFAULT_SETTINGS>}
 */
export async function getStoredSettings() {
  const storage = getStorage();
  try {
    const result = await storage.get(STORAGE_KEYS.SETTINGS);
    const saved = result && result[STORAGE_KEYS.SETTINGS];
    return { ...DEFAULT_SETTINGS, ...(saved || {}) };
  } catch (err) {
    console.error('[SimpleAloud] Failed to load settings from storage:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Updates user settings partially or fully.
 * @param {Partial<typeof DEFAULT_SETTINGS>} newSettings
 * @returns {Promise<typeof DEFAULT_SETTINGS>}
 */
export async function updateStoredSettings(newSettings) {
  const storage = getStorage();
  try {
    const current = await getStoredSettings();
    const updated = { ...current, ...newSettings };
    await storage.set({ [STORAGE_KEYS.SETTINGS]: updated });
    return updated;
  } catch (err) {
    console.error('[SimpleAloud] Failed to save settings to storage:', err);
    throw err;
  }
}
