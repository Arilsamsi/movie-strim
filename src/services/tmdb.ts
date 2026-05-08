import axios from 'axios';
import type { MovieDetail, PaginatedResponse, Movie, Genre } from '../types/tmdb';

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

export const IMG_BASE = import.meta.env.VITE_TMDB_IMG_BASE_URL;

export const imgSrc = (path: string | null, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-poster.svg';

export const fetchTrending = (page = 1) =>
  api.get<PaginatedResponse<Movie>>('/trending/all/week', { params: { page } });

export const fetchPopular = (page = 1) =>
  api.get<PaginatedResponse<Movie>>('/movie/popular', { params: { page } });

export const fetchTopRated = (page = 1) =>
  api.get<PaginatedResponse<Movie>>('/movie/top_rated', { params: { page } });

export const fetchUpcoming = (page = 1) =>
  api.get<PaginatedResponse<Movie>>('/movie/upcoming', { params: { page } });

export const fetchTrendingTV = (page = 1) =>
  api.get<PaginatedResponse<Movie>>('/trending/tv/week', { params: { page } });

export const fetchMovieDetail = (id: number) =>
  api.get<MovieDetail>(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits,similar' },
  });

export const fetchTVDetail = (id: number) =>
  api.get<MovieDetail>(`/tv/${id}`, {
    params: { append_to_response: 'videos,credits,similar' },
  });

export const searchMulti = (query: string, page = 1) =>
  api.get<PaginatedResponse<Movie>>('/search/multi', {
    params: { query, page },
  });

export const fetchMovieGenres = () =>
  api.get<{ genres: Genre[] }>('/genre/movie/list');

export const fetchTVGenres = () =>
  api.get<{ genres: Genre[] }>('/genre/tv/list');

export const discoverMovies = (page = 1, withGenres?: string) =>
  api.get<PaginatedResponse<Movie>>('/discover/movie', {
    params: { page, with_genres: withGenres, sort_by: 'popularity.desc' },
  });

export default api;
