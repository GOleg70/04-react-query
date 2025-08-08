import { useState } from "react";
import toast, { Toaster} from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleQuery = async (query: string) => {

    try {
      setMovies([]);
      setIsLoading(true);
      setHasError(false);
      const { results } = await fetchMovies(query);

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
        return;
      }

      setMovies(results);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching movies.");
      setMovies([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleQuery} />
      {hasError && <ErrorMessage />}
      {isLoading ? (
        <Loader />
      ) : (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster 
      position="top-center" 
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: "16px",
        },
      }} 
    />
    </>
  );
}
