import { useState, useEffect, useCallback } from 'react';
import type { AxiosRequestConfig } from 'axios';
import api from '../services/tmdb';

export function useTmdb<T>(url: string, params?: AxiosRequestConfig['params']) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<T>(url, { params: { ...params, api_key: import.meta.env.VITE_TMDB_API_KEY } })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.status_message || err.message))
      .finally(() => setLoading(false));
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
