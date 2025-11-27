import { useState } from "react";

import MovieCard from "../components/MovieCard";
import MovieDetailsPage from "./MovieDetailsPage";
import { getFilms, type Film } from "../api/movie";
import { useQuery } from "../hooks/query";

export default function HomePage() {
  const { data: films } = useQuery({
    queryFn: () => getFilms().then((res) => res.data),
  });

  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

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

  return (
    <div className="container py-5 d-flex flex-wrap gap-4 justify-content-center">
      {films?.map((film) => (
        <MovieCard
          key={film.id}
          movie={film}
          onSelect={() => handleFilmSelect(film)}
        />
      ))}
    </div>
  );
}
