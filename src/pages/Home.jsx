import { useState, useRef, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "../appwrite";
import api from "../config/axios/axios";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const movieListRef = useRef(null);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `search/movie?query=${encodeURIComponent(query)}`
        : `discover/movie?sort_by=popularity.desc`;

      const response = await api.get(endpoint);
      const data = response.data;

      console.log(data);
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies from the API");
        setMovieList([]);
        return;
      }

      //success
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
      setErrorMessage("Error fetching movies from the API");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies: ", error);
    }
  };

  // Debounce the search term so that it only gives us the final value after the user has stopped typing
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <div>
      <main>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            <h1>
              Find <span className="text-gradient">Movies</span>
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <Link to={`movie/${movie.movie_id}`}>
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  </Link>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2 ref={movieListRef}>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <>
                <Pagination
                  setMovieList={setMovieList}
                  movieListRef={movieListRef}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />

                <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
                <Pagination
                  setMovieList={setMovieList}
                  movieListRef={movieListRef}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
