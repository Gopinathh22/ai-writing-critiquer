"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
} 