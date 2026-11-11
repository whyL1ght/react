import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteGame, fetchGame, updateGame } from "../services/service";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../hooks/useFavorites";

export default function ItemDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [saveError, setSaveError] = useState("");
  const [state, setState] = useState({ game: null, loading: true, error: "" });
  useEffect(() => {
    let active = true;
    setState({ game: null, loading: true, error: "" });
    fetchGame(id)
      .then((game) => active && setState({ game, loading: false, error: "" }))
      .catch(
        (error) =>
          active &&
          setState({ game: null, loading: false, error: error.message }),
      );
    return () => {
      active = false;
    };
  }, [id]);
  function startEditing() {
    setDescription(state.game.description);
    setSaveError("");
    setEditing(true);
  }

  async function saveDescription() {
    try {
      const game = await updateGame(id, { description });
      setState({ game, loading: false, error: "" });
      setEditing(false);
    } catch (error) {
      setSaveError(error.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this game?")) return;
    try {
      await deleteGame(id);
      navigate("/games");
    } catch (error) {
      setSaveError(error.message);
    }
  }

  if (state.loading) return <p className="state">Loading game...</p>;
  if (state.error)
    return (
      <section className="state error">
        <h1>Game not found</h1>
        <p>{state.error}</p>
        <Link className="button" to="/games">
          All games
        </Link>
      </section>
    );
  const { game } = state;
  return (
    <section className="details">
      <Link className="back-link" to="/games">
        ← All games
      </Link>
      <div className="details-art">🎮</div>
      <div className="details-content">
        <span className="tag">{game.genre}</span>
        <div className="details-title">
          <h1>{game.name}</h1>
          <button
            className={`favorite-button ${isFavorite(game.id) ? "favorite" : ""}`}
            onClick={() => toggleFavorite(game.id)}
            aria-label={
              isFavorite(game.id) ? "Remove from favorites" : "Add to favorites"
            }
            type="button"
          >
            {isFavorite(game.id) ? "♥" : "♡"}
          </button>
        </div>
        {editing ? (
          <>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
            {saveError && <p className="state error">{saveError}</p>}
            <button className="button" type="button" onClick={saveDescription}>
              Save
            </button>{" "}
            <button
              className="button"
              type="button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="lead">{game.description}</p>
            {user && (
              <button className="button" type="button" onClick={startEditing}>
                Edit description
              </button>
            )}
            {user && (
              <button
                className="button secondary"
                type="button"
                onClick={handleDelete}
              >
                Delete game
              </button>
            )}
            {saveError && <p className="state error">{saveError}</p>}
          </>
        )}
        <div className="details-grid">
          <div>
            <small>Rating</small>
            <strong>⭐ {game.rating}</strong>
          </div>
          <div>
            <small>Platform</small>
            <strong>{game.platform}</strong>
          </div>
          <div>
            <small>Year</small>
            <strong>{game.year}</strong>
          </div>
          <div>
            <small>Status</small>
            <strong>{game.status}</strong>
          </div>
          <div>
            <small>Game ID</small>
            <strong>#{game.id}</strong>
          </div>
          <div>
            <small>Type</small>
            <strong>Digital</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
