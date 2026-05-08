import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Movie } from "../types/tmdb";
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  fetchTrendingTV,
} from "../services/tmdb";
import HeroBanner from "../components/HeroBanner";
import MovieCarousel from "../components/MovieCarousel";
import SkeletonCard from "../components/SkeletonCard";
import { useWatchlist } from "../hooks/useWatchlist";

function SkeletonRow() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-7 bg-gray-800/50 rounded w-48 mb-5 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggle } = useWatchlist();

  useEffect(() => {
    Promise.all([
      fetchTrending().then((r) => r.data.results),
      fetchPopular().then((r) => r.data.results),
      fetchTopRated().then((r) => r.data.results),
      fetchUpcoming().then((r) => r.data.results),
      fetchTrendingTV().then((r) => r.data.results),
    ])
      .then(([t, p, tr, u, tv]) => {
        setTrending(t);
        setPopular(p);
        setTopRated(tr);
        setUpcoming(u);
        setTrendingTV(tv);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-16">
        <div className="h-[70vh] min-h-[500px] bg-gray-900 animate-pulse" />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroBanner
        movies={Array.isArray(trending) ? trending.slice(0, 5) : []}
      />

      <div className="-mt-8 relative z-10">
        <MovieCarousel
          title="Trending Now"
          movies={trending}
          isSaved={isSaved}
          onToggleWatchlist={toggle}
        />
        <MovieCarousel
          title="Popular Movies"
          movies={popular}
          isSaved={isSaved}
          onToggleWatchlist={toggle}
        />
        <MovieCarousel
          title="Top Rated"
          movies={topRated}
          isSaved={isSaved}
          onToggleWatchlist={toggle}
        />
        <MovieCarousel
          title="Upcoming"
          movies={upcoming}
          isSaved={isSaved}
          onToggleWatchlist={toggle}
        />
        <MovieCarousel
          title="Trending TV Shows"
          movies={trendingTV}
          isSaved={isSaved}
          onToggleWatchlist={toggle}
        />
      </div>
    </motion.div>
  );
}
