import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  Calendar,
  Play,
  Heart,
  ArrowLeft,
  Film,
} from 'lucide-react';
import type { MovieDetail as MovieDetailType } from '../types/tmdb';
import { fetchMovieDetail, fetchTVDetail, imgSrc } from '../services/tmdb';
import { formatRating, formatRuntime, formatDate, getTitle } from '../utils/helpers';
import { useWatchlist } from '../hooks/useWatchlist';
import TrailerModal from '../components/TrailerModal';
import MovieCarousel from '../components/MovieCarousel';

export default function MovieDetailPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [detail, setDetail] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const { isSaved, toggle } = useWatchlist();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetcher = type === 'tv' ? fetchTVDetail : fetchMovieDetail;
    fetcher(Number(id))
      .then((r) => {
        setDetail(r.data);
        const trailer = r.data.videos?.results?.find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch((err) => setError(err.response?.data?.status_message || 'Failed to load details'))
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="h-[50vh] bg-gray-900 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <div className="h-10 bg-gray-800 rounded w-1/2 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded w-1/3 animate-pulse" />
          <div className="h-32 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg mb-4">{error || 'Movie not found'}</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const saved = isSaved(detail.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Backdrop */}
      <div className="relative h-[55vh] min-h-[400px] max-h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgSrc(detail.backdrop_path, 'original')})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/30" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 sm:w-56 md:w-64 mx-auto md:mx-0">
            <img
              src={imgSrc(detail.poster_path)}
              alt={detail.title}
              className="w-full rounded-xl shadow-2xl shadow-black/50"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {getTitle(detail)}
            </h1>
            {detail.tagline && (
              <p className="text-blue-400 italic text-sm mb-4">"{detail.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4 fill-yellow-400" />
                {formatRating(detail.vote_average)}
              </span>
              {detail.runtime > 0 && (
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatRuntime(detail.runtime)}
                </span>
              )}
              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(detail.release_date || detail.first_air_date || '')}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {detail.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/10"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-6">
              {trailerKey && (
                <button
                  onClick={() => setTrailerKey(trailerKey)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Play Trailer
                </button>
              )}
              <button
                onClick={() => toggle(detail.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all border ${
                  saved
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-red-400' : ''}`} />
                {saved ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
              <p className="text-gray-400 leading-relaxed">{detail.overview}</p>
            </div>
          </div>
        </div>

        {/* Cast */}
        {detail.credits?.cast?.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {detail.credits.cast.slice(0, 15).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-28 text-center group">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                    {person.profile_path ? (
                      <img
                        src={imgSrc(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Film className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium line-clamp-1">{person.name}</p>
                  <p className="text-gray-500 text-[10px] line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {detail.similar?.results?.length > 0 && (
          <div className="mt-8">
            <MovieCarousel
              title="Similar Movies"
              movies={detail.similar.results}
              isSaved={isSaved}
              onToggleWatchlist={toggle}
            />
          </div>
        )}
      </div>

      <TrailerModal
        videoKey={trailerKey}
        onClose={() => setTrailerKey(null)}
      />
    </motion.div>
  );
}
