import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

interface UseDatabaseOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useDatabase(options: UseDatabaseOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchData = useCallback(async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const data = await response.json();
      options.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken, options]);

  const get = useCallback((url: string) => {
    return fetchData(url);
  }, [fetchData]);

  const post = useCallback((url: string, data: any) => {
    return fetchData(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const put = useCallback((url: string, data: any) => {
    return fetchData(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const del = useCallback((url: string) => {
    return fetchData(url, {
      method: 'DELETE',
    });
  }, [fetchData]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
}

