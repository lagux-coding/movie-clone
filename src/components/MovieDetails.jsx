import { useParams } from "react-router-dom";
import api from "../config/axios/axios";
import { useState, useEffect } from "react";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);

  const fetchMovieDetails = async () => {
    try {
      const endpoint = `movie/${id}`;
      const response = await api.get(endpoint);
      const data = response.data;

      console.log(data);

      setMovie(data || []);
    } catch (error) {
      console.log(error);
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
          <div>Phần bên phải</div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
