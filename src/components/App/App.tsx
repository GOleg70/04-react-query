import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
     placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!isPending && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isPending, data]);

  const handleQuery = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  if (!query) {
  return (
    <>
      <SearchBar onSubmit={handleQuery} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "16px" },
        }}
      />
    </>
  );
}
  return (
    <>

      
      <SearchBar onSubmit={handleQuery} />

      {isError && <ErrorMessage />}
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isPending ? (
        <Loader />
      ) : (
        <MovieGrid movies={data?.results || []} onSelect={handleSelectMovie} />
      )}

      

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "16px" },
        }}
      />
    </>
  );
}
