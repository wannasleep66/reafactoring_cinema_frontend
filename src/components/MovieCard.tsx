import React from "react";
import type { Film } from "../api/movie";
import { CONFIG } from "../constants/config";

interface Props {
  movie: Film;
  onSelect: () => void;
}

const MovieCard: React.FC<Props> = ({ movie, onSelect }) => (
  <div
    className="card"
    style={{ width: CONFIG.UI.MOVIE_CARD_WIDTH, cursor: "pointer" }}
    onClick={onSelect}
  >
    <img
      src={movie.imageUrl || "https://placehold.co/300x450"}
      className="card-img-top"
      alt={movie.title}
    />
    <div className="card-body">
      <h5 className="card-title">{movie.title}</h5>
      <p className="card-text">{movie.description.slice(0, 50)}...</p>
      <p className="card-text">
        <small>
          • {movie.durationMinutes} мин • {movie.ageRating}
        </small>
      </p>
    </div>
  </div>
);

export default MovieCard;
