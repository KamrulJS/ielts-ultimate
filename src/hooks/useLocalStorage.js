'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch {
        // Ignore storage read errors in restricted environments
      } finally {
        setHydrated(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = typeof value === 'function' ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Ignore quota errors
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue, hydrated];
}

