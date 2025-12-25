import { getFilm } from "../api/movie";
import { getPurchases } from "../api/purchases";
import PurchaseCard, {
  type PurchaseWithFilm,
} from "../components/PurchaseCard";
import FeedbackCreateForm from "../components/FeedbackCreateForm";
import Fallback from "../components/shared/Fallback";
import { useQuery } from "../hooks/query";
import { CONFIG } from "../constants/config";

interface UserPurchasesProps {
  onRefresh?: () => void;
}

export default function UserPurchases({ onRefresh }: UserPurchasesProps) {
  const {
    data: purchases,
    loading: isPurchasesLoading,
    refetch: refetchPurchases,
  } = useQuery({
    queryFn: async () => {
      const { data: purchases } = await getPurchases({
        page: CONFIG.PAGINATION.DEFAULT_PAGE,
        size: CONFIG.PAGINATION.PURCHASE_PAGE_SIZE,
      });
      const filmsIdsToLoad = new Set(purchases.map((p) => p.filmId));
      const films = await Promise.all(
        Array.from(filmsIdsToLoad).map((id) => getFilm(id))
      );
      const purchasesWithFilms: PurchaseWithFilm[] = purchases.map(
        (purchase) => ({
          ...purchase,
          film: films.find((film) => film.id === purchase.filmId)!,
        })
      );
      return purchasesWithFilms;
    },
  });

  const handleFeedbackCreate = () => {
    refetchPurchases();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="mb-4">
      <Fallback loading={isPurchasesLoading}>
        <h2 className="text-primary mb-3">История покупок</h2>
        {purchases?.length === 0 ? (
          <p>У вас пока нет покупок 🎟️</p>
        ) : (
          purchases?.map((purchase) => (
            <div key={purchase.id} className="mb-3">
              <PurchaseCard purchase={purchase} />
              <FeedbackCreateForm
                filmId={purchase.filmId}
                onCreate={handleFeedbackCreate}
              />
            </div>
          ))
        )}
      </Fallback>
    </div>
  );
}