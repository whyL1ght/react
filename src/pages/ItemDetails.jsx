import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGame } from "../services/service";
import { useFavorites } from "../hooks/useFavorites";

export default function ItemDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [state, setState] = useState({ game: null, loading: true, error: "" });
  useEffect(() => {
    let active = true;
    setState({ game: null, loading: true, error: "" });
    fetchGame(id).then((game) => active && setState({ game, loading: false, error: "" })).catch((error) => active && setState({ game: null, loading: false, error: error.message }));
    return () => { active = false; };
  }, [id]);
  if (state.loading) return <p className="state">Loading game...</p>;
  if (state.error) return <section className="state error"><h1>Game not found</h1><p>{state.error}</p><Link className="button" to="/games">All games</Link></section>;
  const { game } = state;
  return <section className="details"><Link className="back-link" to="/games">← All games</Link><div className="details-art">🎮</div><div className="details-content"><span className="tag">{game.genre}</span><div className="details-title"><h1>{game.name}</h1><button className={`favorite-button ${isFavorite(game.id) ? "favorite" : ""}`} onClick={() => toggleFavorite(game.id)} aria-label={isFavorite(game.id) ? "Remove from favorites" : "Add to favorites"} type="button">{isFavorite(game.id) ? "♥" : "♡"}</button></div><p className="lead">{game.description}</p><div className="details-grid"><div><small>Rating</small><strong>⭐ {game.rating}</strong></div><div><small>Platform</small><strong>{game.platform}</strong></div><div><small>Year</small><strong>{game.year}</strong></div><div><small>Status</small><strong>{game.status}</strong></div><div><small>Game ID</small><strong>#{game.id}</strong></div><div><small>Type</small><strong>Digital</strong></div></div></div></section>;
}
