import { useEffect, useState } from 'react';

/**
 * Custom hook for managing localStorage with TypeScript support
 * Automatically syncs state with localStorage
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state with localStorage value or default
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed;
      } else {
        return initialValue;
      }
    } catch (error) {
      console.warn(`❌ Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      const serialized = JSON.stringify(storedValue);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`❌ Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
