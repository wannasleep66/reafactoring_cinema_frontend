import React from "react";

interface FilterValues {
  genre: string;
  ageRating: string;
  date: string;
}

interface FilterCallbacks {
  onGenreChange: (g: string) => void;
  onAgeChange: (a: string) => void;
  onDateChange: (d: string) => void;
}

interface FilterOptions {
  genres: string[];
  ageRatings: string[];
  dates: string[];
}

interface Props {
  filterValues: FilterValues;
  filterCallbacks: FilterCallbacks;
  filterOptions: FilterOptions;
}

const MovieFilter: React.FC<Props> = ({
  filterValues,
  filterCallbacks,
  filterOptions,
}) => {
  return (
    <div className="d-flex gap-3 mb-4 flex-wrap justify-content-center">
      <select
        className="form-select w-auto"
        value={filterValues.genre}
        onChange={(e) => filterCallbacks.onGenreChange(e.target.value)}
      >
        <option value="all">Все жанры</option>
        {filterOptions.genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        className="form-select w-auto"
        value={filterValues.ageRating}
        onChange={(e) => filterCallbacks.onAgeChange(e.target.value)}
      >
        <option value="all">Все возрастные рейтинги</option>
        {filterOptions.ageRatings.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        className="form-select w-auto"
        value={filterValues.date}
        onChange={(e) => filterCallbacks.onDateChange(e.target.value)}
      >
        <option value="all">Все даты</option>
        {filterOptions.dates.map((d) => (
          <option key={d} value={d}>
            {new Date(d).toLocaleDateString("ru-RU")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MovieFilter;
