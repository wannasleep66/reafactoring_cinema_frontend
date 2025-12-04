import { getFilm } from "../api/movie";
import { getPurchases } from "../api/purchases";
import EditProfileForm from "../components/EditProfileForm";
import FeedbackCreateForm from "../components/FeedbackCreateForm";
import PurchaseCard, {
  type PurchaseWithFilm,
} from "../components/PurchaseCard";
import Fallback from "../components/shared/Fallback";
import { useQuery } from "../hooks/query";
import { CONFIG } from "../constants/config";

export default function UserProfilePage() {
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

  return (
    <div className="min-vh-100 bg-dark text-light p-4">
      <EditProfileForm />
      <div className="mb-4">
        <Fallback loading={isPurchasesLoading}>
          <h2 className="text-primary mb-3">История покупок</h2>
          {purchases?.length === 0 ? (
            <p>У вас пока нет покупок 🎟️</p>
          ) : (
            purchases?.map((purchase) => (
              <>
                <PurchaseCard purchase={purchase} />
                <FeedbackCreateForm
                  filmId={purchase.filmId}
                  onCreate={() => refetchPurchases()}
                />
              </>
            ))
          )}
        </Fallback>
      </div>
    </div>
  );
}
