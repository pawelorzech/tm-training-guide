'use client';
import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tm-theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
        localStorage.setItem('tm-theme', 'dark');
      } else {
        document.documentElement.classList.add('light');
        localStorage.setItem('tm-theme', 'light');
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
