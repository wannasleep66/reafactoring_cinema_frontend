import { getFilmReviews } from "../api/reviews";
import { useQuery } from "../hooks/query";

interface Review {
  id: string;
  filmId: string;
  clientId: string;
  rating: number;
  text: string;
  createdAt: string;
}

interface Props {
  movieId: string;
}

export default function ReviewsDisplay({ movieId }: Props) {
  const {
    data: reviews,
    loading,
    error,
  } = useQuery<Review[], string>({
    queryFn: () => getFilmReviews(movieId).then((res) => res.data),
  });

  if (loading) return <p className="text-light mt-3">Загрузка отзывов...</p>;
  if (error) return <p className="text-danger mt-3">{error}</p>;
  if (reviews?.length === 0)
    return <p className="text-light mt-3">Нет отзывов для этого фильма.</p>;

  return (
    <div className="mt-4">
      <h4 className="text-light mb-3">Отзывы</h4>
      {reviews?.map((r) => (
        <div
          key={r.id}
          className="card mb-2 p-3 bg-secondary text-light shadow-sm"
        >
          <div className="d-flex justify-content-between">
            <strong>{r.clientId}</strong>
            <span>⭐ {r.rating}</span>
          </div>
          <p className="mb-0 mt-2">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
