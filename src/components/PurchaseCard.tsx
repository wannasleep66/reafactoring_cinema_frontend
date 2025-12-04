import type { Film } from "../api/movie";
import type { Purchase } from "../api/purchases";

export type PurchaseWithFilm = Purchase & {
  film: Film;
};

const PurchaseCard: React.FC<{ purchase: PurchaseWithFilm }> = ({
  purchase,
}) => {
  return (
    <div key={purchase.id} className="card text-dark mb-3">
      <div className="card-body text-light">
        <strong>{purchase.film.title}</strong>
        <br />
        Итого: {purchase.totalCents}₽
        <br />
        Статус: {purchase.status}
      </div>
    </div>
  );
};

export default PurchaseCard;
