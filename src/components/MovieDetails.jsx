import { useParams } from "react-router-dom";
import api from "../config/axios/axios";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";

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
        <div className="max-w-7xl w-full bg-[#0F0D23] text-white p-6 rounded-2xl shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center p-4 text-white">
            <div>
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              <p className="text-gray-400">
                {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                <span> • </span>
                {movieRuntime(movie.runtime)}
              </p>
            </div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
