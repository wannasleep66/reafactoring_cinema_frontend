import { useState, useEffect } from "react";

import MovieCard from "./MovieCard";
import MovieDetailsPage from "./MovieDetailsPage";
import { getFilms, type Film } from "./api/movie";

export default function HomePage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    getFilms()
      .then((filmsData) => {
        setFilms(filmsData.data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки фильмов:", error);
      });
  }, []);

  const handleFilmSelect = (film: Film) => {
    setSelectedFilm(film);
  };

  const handleBackFromDetails = () => {
    setSelectedFilm(null);
  };

  if (selectedFilm) {
    return (
      <MovieDetailsPage movie={selectedFilm} onBack={handleBackFromDetails} />
    );
  }

  const renderMovieCards = () => {
    return films.map((film) => (
      <MovieCard
        key={film.id}
        movie={film}
        onSelect={() => handleFilmSelect(film)}
      />
    ));
  };

  return (
    <div className="container py-5 d-flex flex-wrap gap-4 justify-content-center">
      {renderMovieCards()}
    </div>
  );
}
