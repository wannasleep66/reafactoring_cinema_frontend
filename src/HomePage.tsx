import { useState, useEffect } from "react";

import MovieCard from "./MovieCard";
import MovieDetailsPage from "./MovieDetailsPage";
import { getFilms, type Film } from "./api/movie";

let globalLoadingState = false;

export default function HomePage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    globalLoadingState = true;

    getFilms()
      .then((filmsData) => {
        setFilms(filmsData.data);
        globalLoadingState = false;

        setViewCount((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Ошибка загрузки фильмов:", error);
        globalLoadingState = false;
      });
  }, []);

  const handleFilmSelect = (film: Film) => {
    setSelectedFilm(film);
    setViewCount((prev) => prev + 1);
  };

  const handleBackFromDetails = () => {
    setSelectedFilm(null);
    setViewCount((prev) => prev + 1);
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
