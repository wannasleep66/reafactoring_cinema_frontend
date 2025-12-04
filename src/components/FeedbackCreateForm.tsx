import { useState } from "react";
import { createReview } from "../api/reviews";
import { CONFIG } from "../constants/config";

type FeedbackCreateFormProps = {
  filmId: string;
  onCreate: () => void;
};

const FeedbackCreateForm: React.FC<FeedbackCreateFormProps> = ({
  filmId,
  onCreate,
}) => {
  const [form, setForm] = useState<{
    data: { rating: number; text: string };
    loading: boolean;
  }>({ data: { rating: CONFIG.REVIEW.MIN_RATING, text: "" }, loading: false });

  const registerField = (name: keyof typeof form.data) => {
    return {
      value: form.data[name] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({
          ...prev,
          data: { ...prev.data, [name]: e.target.value },
        })),
    };
  };

  const handleCreate = async () => {
    setForm((prev) => ({ ...prev, loading: true }));
    await createReview(filmId, form.data);
    setForm((prev) => ({ ...prev, loading: false }));
    onCreate();
  };

  return (
    <div className="mt-2">
      <h6>Оставить отзыв:</h6>
      <input
        type="number"
        min={CONFIG.REVIEW.MIN_RATING}
        max={CONFIG.REVIEW.MAX_RATING}
        className="form-control mb-1"
        placeholder={`Рейтинг ${CONFIG.REVIEW.MIN_RATING}–${CONFIG.REVIEW.MAX_RATING}`}
        {...registerField("rating")}
      />
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Текст отзыва"
        {...registerField("text")}
      />
      <button
        className="btn btn-success"
        onClick={handleCreate}
        disabled={form.loading}
      >
        Отправить отзыв
      </button>
    </div>
  );
};

export default FeedbackCreateForm;
