import { useParams } from "react-router-dom";
import api from "../config/axios/axios";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `movie/${id}`;
      const response = await api.get(endpoint);
      const data = response.data;

      console.log(data);
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies from the API");
        return;
      }

      setMovie(data || []);
    } catch (error) {
      console.log(error);
      setErrorMessage("Error fetching movies from the API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const movieRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  console.log(id);
  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <div className="movie-details">
          {/* Header */}
          <div className="header">
            <div className="header-left">
              <h1>{movie.title}</h1>
              <span>
                {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                <span> • </span>
                {movieRuntime(movie.runtime)}
              </span>
            </div>
            <div className="header-right">
              <div className="rating">
                <img src="/star.svg" alt="star" />
                <p>
                  {movie.vote_average}
                  <span>/10 ({movie.vote_count})</span>
                </p>
              </div>
              <div className="stonk">
                <img src="/stonk.svg" alt="stonk" />
                <span>1</span>
              </div>
            </div>
          </div>

          {/* Movie Images */}
          <div className="movie-images">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : `/no-poster.png`
              }
              alt="Movie Poster"
              className="poster"
            />

            <div className="backdrop">
              <img
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                    : `/no-poster.png`
                }
                alt="Movie Poster"
              />
              <div className="trailer-button">
                <FaPlay />
                Trailer
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
