import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "../types/tmdb";
import { imgSrc } from "../services/tmdb";
import { getTitle, getYear, formatRating } from "../utils/helpers";

interface Props {
  movies: Movie[];
}

export default function HeroBanner({ movies }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % movies.length);
  }, [movies.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + movies.length) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    if (!movies.length) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, movies.length]);

  if (!movies.length) return null;

  const movie = movies[current];

  return (
    <div className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imgSrc(movie.backdrop_path, "original")})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-blue-500/20">
                <Star className="w-3 h-3 fill-blue-400" />
                {formatRating(movie.vote_average)}
              </span>
              <span className="text-gray-400 text-sm">{getYear(movie)}</span>
              {movie.media_type && (
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {movie.media_type}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {getTitle(movie)}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-6 leading-relaxed">
              {movie.overview}
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                <Play className="w-4 h-4 fill-white" />
                More Details
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 mx-2">
          {Array.isArray(movies) &&
            movies
              .slice(0, 5)
              .map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-blue-500" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
        </div>
        <button
          onClick={next}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
