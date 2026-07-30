import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";
import type { Movie } from "../types/tmdb";
import { imgSrc } from "../services/tmdb";
import { getTitle, getYear, formatRating } from "../utils/helpers";

interface Props {
  movie: Movie;
  isSaved?: boolean;
  onToggleWatchlist?: (id: number) => void;
  index?: number;
}

export default function MovieCard({
  movie,
  isSaved,
  onToggleWatchlist,
  index = 0,
}: Props) {
  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const linkTo = `/${mediaType}/${movie.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      className="group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
    >
      <Link to={linkTo} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 mb-3">
          <img
            src={imgSrc(movie.poster_path)}
            alt={getTitle(movie)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-yellow-400 px-2 py-0.5 rounded-md text-xs font-semibold">
            <Star className="w-3 h-3 fill-yellow-400" />
            {formatRating(movie.vote_average || 0)}
          </div>

          {onToggleWatchlist && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWatchlist(movie.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/70 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.div
                key={isSaved ? "saved" : "not-saved"}
                initial={{ scale: 0.5, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 fill-white-400 text-blue-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </motion.div>
            </motion.button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="bg-blue-500/80 text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                {mediaType}
              </span>
              <span>{getYear(movie)}</span>
            </div>
          </div>
        </div>
      </Link>

      <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
        {getTitle(movie)}
      </h3>
      <p className="text-gray-500 text-xs mt-1">{getYear(movie)}</p>
    </motion.div>
  );
}
