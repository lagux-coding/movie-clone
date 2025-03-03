import { useParams } from "react-router-dom";
import api from "../config/axios/axios";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { format } from "date-fns";

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [movieVideo, setMovieVideo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchMovieVideo = async () => {
    try {
      console.log("testing");
      const endpoint = `movie/${id}/videos`;
      const response = await api.get(endpoint);
      const data = response.data;

      console.log(data);
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies from the API");
        return;
      }

      setMovieVideo(data.results || []);
    } catch (error) {
      console.log(error);
      setErrorMessage("Error fetching movies from the API");
    }
  };

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
    fetchMovieVideo();
  }, []);

  const movieRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const formattedDate = formatter.format(new Date(date));
    return formattedDate;
  };

  const handleTrailer = () => {
    const trailer = movieVideo.find((video) => video.type === "Trailer");
    if (trailer) {
      window.open(`${YOUTUBE_BASE_URL}${trailer.key}`, "_blank");
    }
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
            <h1>{movie.title}</h1>
            <div className="small-detail">
              <span>
                {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                <span> • </span>
                {movieRuntime(movie.runtime)}
              </span>

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

            <div className="backdrop cursor-pointer" onClick={handleTrailer}>
              <img
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                    : `/no-poster.png`
                }
                alt="Movie Poster"
              />
              <div className="trailer-button cursor-pointer" onClick={handleTrailer}>
                <FaPlay />
                Trailer
              </div>
            </div>
          </div>
          {/* Overview */}
          <div className="movie-overview">
            <div className="metadata">
              <div className="meta-item genre">
                <span>Genre</span>
                <ul>
                  {movie.genres?.map((genre) => (
                    <li key={genre.id}>{genre.name}</li>
                  ))}
                </ul>
              </div>

              <div className="meta-item">
                <span>Overview</span>
                <p>{movie.overview}</p>
              </div>

              <div className="meta-item">
                <span>Release date</span>
                <p>{formatDate(movie.release_date)}</p>
              </div>

              <div className="meta-item">
                <span>Countries</span>
                <ul>
                  {movie.production_countries?.map((country, index) => (
                    <li key={index}>
                      {index > 0 && `•`} {country.name || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="meta-item">
                <span>Status</span>
                <p>{movie.status}</p>
              </div>

              <div className="meta-item">
                <span>Language</span>
                <ul>
                  {movie.spoken_languages?.map((lang, index) => (
                    <li key={lang.iso_639_1}>
                      {index > 0 && `•`} {lang.english_name || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="meta-item">
                <span>Budget</span>
                <p>${movie.budget}</p>
              </div>

              <div className="meta-item">
                <span>Revenue</span>
                <p>${movie.revenue}</p>
              </div>

              <div className="meta-item">
                <span>Tagline</span>
                <p>{movie.tagline}</p>
              </div>

              <div className="meta-item">
                <span>Production Companies</span>
                <ul>
                  {movie.production_companies?.map((company, index) => (
                    <li key={company.id}>
                      {index > 0 && `•`} {company.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="homepage">
              <a href={movie.homepage} target="_blank" rel="noreferrer">
                <span>Visit Homepage</span>
                <span>
                  <FaArrowRightLong />
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
