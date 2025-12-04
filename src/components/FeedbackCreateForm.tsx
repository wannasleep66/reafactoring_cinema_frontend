import { createReview } from "../api/reviews";
import { useForm } from "../hooks/useForm";
import { CONFIG } from "../constants/config";

type FeedbackCreateFormProps = {
  filmId: string;
  onCreate: () => void;
};

const FeedbackCreateForm: React.FC<FeedbackCreateFormProps> = ({
  filmId,
  onCreate,
}) => {
  type FormData = { rating: number; text: string };

  const { form, registerField, handleSubmit } = useForm<FormData>({
    rating: CONFIG.REVIEW.MIN_RATING,
    text: "",
  });

  const handleCreate = async () => {
    await handleSubmit(async (data) => {
      await createReview(filmId, data);
      onCreate();
    });
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
        {...registerField("rating", {
          transformer: (value) => parseInt(value) || CONFIG.REVIEW.MIN_RATING,
        })}
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
