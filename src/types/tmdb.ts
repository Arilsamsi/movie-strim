export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  first_air_date?: string;
  genre_ids: number[];
  popularity: number;
  media_type?: string;
  adult: boolean;
  original_language: string;
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
  status: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  videos: VideoResponse;
  credits: CreditsResponse;
  similar: SimilarResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideoResponse {
  results: Video[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CreditsResponse {
  cast: CastMember[];
}

export interface SimilarResponse {
  results: Movie[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MediaType = 'movie' | 'tv';
