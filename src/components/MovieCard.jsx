import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({
  movie: { id, title, vote_average, poster_path, release_date, original_language },
}) => {
  const handleInfo = () => {
    console.log("first");
  };

  return (
    <Link to={`/movie/${id}`}>
      <div className="movie-card" onClick={handleInfo}>
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : `/no-poster.png`}
          alt="{title}"
        />

        <div className="mt-4">
          <h3>{title}</h3>

          <div className="content">
            <div className="rating">
              <img src="./star.svg" alt="star" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>

              <span>•</span>
              <div className="lang">{original_language}</div>
              <span>•</span>
              <div className="year">{release_date ? release_date.split("-")[0] : "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
