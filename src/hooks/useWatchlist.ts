import { useState, useCallback } from 'react';

const STORAGE_KEY = 'movie_watchlist';

function readList(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [list, setList] = useState<number[]>(readList);

  const toggle = useCallback((id: number) => {
    setList((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id: number) => list.includes(id), [list]);

  return { list, toggle, isSaved };
}
