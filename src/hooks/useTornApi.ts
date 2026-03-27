'use client';
import { useState, useCallback } from 'react';
import type { TornUserData } from '@/types/torn-api';
import { fetchUserData, TornApiError } from '@/lib/torn-api';

interface UseTornApiReturn {
  data: TornUserData | null;
  loading: boolean;
  error: string | null;
  fetch: (apiKey: string) => Promise<void>;
  clear: () => void;
}

export function useTornApi(): UseTornApiReturn {
  const [data, setData] = useState<TornUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (apiKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserData(apiKey);
      setData(result);
    } catch (e) {
      if (e instanceof TornApiError) {
        if (e.code === 2) setError('Invalid API key');
        else if (e.code === 5) setError('Rate limited — please wait');
        else setError(e.message);
      } else {
        setError('Could not reach Torn API. Enter stats manually.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetch: fetchData, clear };
}
