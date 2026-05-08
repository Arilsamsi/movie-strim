import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import type { Movie, Genre } from '../types/tmdb';
import { searchMulti, discoverMovies, fetchMovieGenres } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import GenreFilter from '../components/GenreFilter';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useWatchlist } from '../hooks/useWatchlist';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { isSaved, toggle } = useWatchlist();

  useEffect(() => {
    fetchMovieGenres()
      .then((r) => setGenres(r.data.genres))
      .catch(() => {});
  }, []);

  const doSearch = useCallback(
    async (q: string, p: number, reset = false) => {
      setLoading(true);
      try {
        if (q.trim()) {
          const res = await searchMulti(q, p);
          setResults((prev) => (reset ? res.data.results : [...prev, ...res.data.results]));
          setTotalPages(res.data.total_pages);
        } else if (selectedGenres.length) {
          const res = await discoverMovies(p, selectedGenres.join(','));
          setResults((prev) => (reset ? res.data.results : [...prev, ...res.data.results]));
          setTotalPages(res.data.total_pages);
        } else {
          const res = await discoverMovies(p);
          setResults((prev) => (reset ? res.data.results : [...prev, ...res.data.results]));
          setTotalPages(res.data.total_pages);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [selectedGenres]
  );

  useEffect(() => {
    const q = params.get('q') || '';
    setQuery(q);
    setPage(1);
    setResults([]);
    doSearch(q, 1, true);
  }, [params, selectedGenres]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setParams({ q: query.trim() });
      setSelectedGenres([]);
    }
  };

  const toggleGenre = (id: number) => {
    const sid = String(id);
    setSelectedGenres((prev) =>
      prev.includes(sid) ? prev.filter((g) => g !== sid) : [...prev, sid]
    );
  };

  const loadMore = () => {
    if (loading || page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    doSearch(params.get('q') || '', next);
  };

  const lastRef = useInfiniteScroll(loadMore, page < totalPages && !loading);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows, people..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-14 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-base"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </form>

        {/* Genre filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <GenreFilter genres={genres} selected={selectedGenres} onToggle={toggleGenre} />
          </motion.div>
        )}

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {results.map((movie, i) => (
            <div key={`${movie.id}-${i}`} ref={i === results.length - 1 ? lastRef : undefined}>
              <MovieCard
                movie={movie}
                index={i}
                isSaved={isSaved(movie.id)}
                onToggleWatchlist={toggle}
              />
            </div>
          ))}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
        </div>

        {!loading && results.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-1">Try a different search term or genre filter</p>
          </div>
        )}

        {!loading && page < totalPages && (
          <div ref={lastRef} className="h-10" />
        )}
      </div>
    </div>
  );
}
