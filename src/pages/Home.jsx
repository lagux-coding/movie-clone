import { useState, useRef, useEffect } from "react";
import { useDebounce, useScroll } from "react-use";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "../appwrite";
import api from "../config/axios/axios";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import Navigation from "../components/Navigation";
import { motion, useTransform } from "framer-motion";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const movieListRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

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
      <Navigation />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            <h1>
              Movie <span className="text-gradient">Clone</span>
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <motion.section
              className="trending"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <Link to={`movie/${movie.movie_id}`}>
                    <motion.li
                      key={movie.$id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </motion.li>
                  </Link>
                ))}
              </ul>
            </motion.section>
          )}

          <section ref={movieListRef} className="all-movies">
            <h2>All Movies</h2>
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
                  setSearchParams={setSearchParams}
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
                  setSearchParams={setSearchParams}
                />
              </>
            )}
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default Home;
