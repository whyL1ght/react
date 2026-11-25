import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removeGame, saveGame } from "../features/gameDetails/gameDetailsSlice";
import { useGame } from "../hooks/useGame";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../hooks/useFavorites";

export default function ItemDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { game, loading, error, retry } = useGame(id);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [saveError, setSaveError] = useState("");

  function startEditing() {
    setDescription(game.description);
    setSaveError("");
    setEditing(true);
  }

  async function saveDescription() {
    try {
      await dispatch(saveGame({ id, changes: { description } })).unwrap();
      setEditing(false);
    } catch (error) {
      setSaveError(error.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this game?")) return;
    try {
      await dispatch(removeGame(id)).unwrap();
      navigate("/games");
    } catch (error) {
      setSaveError(error.message);
    }
  }

  if (loading) return <p className="state">Loading game...</p>;
  if (error)
    return (
      <section className="state error">
        <h1>Game not found</h1>
        <p>{error}</p>
        <button className="button" type="button" onClick={retry}>
          Try again
        </button>{" "}
        <Link className="button" to="/games">
          All games
        </Link>
      </section>
    );
  if (!game) return null;
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
