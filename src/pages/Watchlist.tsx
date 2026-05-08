import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, Trash2 } from "lucide-react";
import type { Movie } from "../types/tmdb";
import api from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useWatchlist } from "../hooks/useWatchlist";

export default function Watchlist() {
  const { list, isSaved, toggle } = useWatchlist();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!list.length) {
      setMovies([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      list.map((id) =>
        api
          .get<Movie>(`/movie/${id}`)
          .then((r) => r.data)
          .catch(() => null),
      ),
    )
      .then((results) => setMovies(results.filter(Boolean) as Movie[]))
      .finally(() => setLoading(false));
  }, [list]);

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-7 h-7 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          <span className="text-gray-500 text-sm ml-2">
            ({list.length} items)
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-700" />
            <p className="text-gray-400 text-lg mb-2">
              Your watchlist is empty
            </p>
            <p className="text-gray-600 text-sm">
              Start adding movies and TV shows to your watchlist
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies?.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={i}
                isSaved={isSaved(movie.id)}
                onToggleWatchlist={toggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
