import axios from 'axios';
import type { Movie } from '../types/movie';

export interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, page: number): Promise<FetchMoviesResponse> {
  const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const response = await axios.get<FetchMoviesResponse>(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query,
      
      page,
    },
  });

  return response.data;
}
