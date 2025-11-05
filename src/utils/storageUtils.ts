/**
 * Utility functions for localStorage management and monitoring
 */

/**
 * Get the size of data stored in localStorage for a specific key
 */
export const getStorageSize = (key: string): number => {
  const item = localStorage.getItem(key);
  if (!item) return 0;
  
  // Calculate size in bytes (each character is approximately 2 bytes in UTF-16)
  return new Blob([item]).size;
};

/**
 * Get total localStorage usage across all keys
 */
export const getTotalStorageSize = (): number => {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const item = localStorage.getItem(key);
      if (item) {
        total += new Blob([item]).size;
      }
    }
  }
  return total;
};

/**
 * Format bytes to human-readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get storage usage percentage (assumes 5MB limit)
 */
export const getStorageUsagePercent = (): number => {
  const total = getTotalStorageSize();
  const limit = 5 * 1024 * 1024; // 5MB in bytes
  return (total / limit) * 100;
};

/**
 * Log detailed storage information to console
 */
export const logStorageInfo = (): void => {
  // Storage info logging removed
};

/**
 * Check if localStorage is available and working
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Export all localStorage data as JSON
 */
export const exportLocalStorage = (): string => {
  const data: Record<string, string | null> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      data[key] = localStorage.getItem(key);
    }
  }
  return JSON.stringify(data, null, 2);
};

/**
 * Import localStorage data from JSON
 */
export const importLocalStorage = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    Object.keys(data).forEach(key => {
      if (data[key] !== null) {
        localStorage.setItem(key, data[key]);
      }
    });
    return true;
  } catch (e) {
    console.error('Failed to import localStorage data:', e);
    return false;
  }
};

/**
 * Clear only app-specific localStorage keys
 */
export const clearAppStorage = (): void => {
  const appKeys = ['chatbot-conversations', 'chatbot-selectedId'];
  appKeys.forEach(key => localStorage.removeItem(key));
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).storageUtils = {
    getStorageSize,
    getTotalStorageSize,
    formatBytes,
    getStorageUsagePercent,
    logStorageInfo,
    isLocalStorageAvailable,
    exportLocalStorage,
    importLocalStorage,
    clearAppStorage,
  };
}

const storageUtils = {
  getStorageSize,
  getTotalStorageSize,
  formatBytes,
  getStorageUsagePercent,
  logStorageInfo,
  isLocalStorageAvailable,
  exportLocalStorage,
  importLocalStorage,
  clearAppStorage,
};

export default storageUtils;
