import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";

export default function Card({ game }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <article className="card">
      <div className="card-art">
        {game.id % 2 ? "🎮" : "🕹️"}
        <button
          className={`favorite-button ${isFavorite(game.id) ? "favorite" : ""}`}
          onClick={() => toggleFavorite(game.id)}
          aria-label={
            isFavorite(game.id)
              ? `Remove ${game.name} from favorites`
              : `Add ${game.name} to favorites`
          }
          type="button"
        >
          {isFavorite(game.id) ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <span className="tag">{game.genre}</span>
        <h3>{game.name}</h3>
        <p>{game.description}</p>
        <div className="card-meta">
          <span>⭐ {game.rating}</span>
          <span>{game.platform}</span>
        </div>
        <Link className="text-link" to={`/games/${game.id}`}>
          View details →
        </Link>
      </div>
    </article>
  );
}
