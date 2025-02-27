import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTION);

      if (!response.ok) {
        throw new Error("Error fetching movies from the API");
      }

      const data = await response.json();
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

  return (
    <div>
      <main>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            <img
              src="./hero-img.png"
              alt="Hero Banner"
            />

            <h1>
              Find <span className="text-gradient">Movies</span>
            </h1>

            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
