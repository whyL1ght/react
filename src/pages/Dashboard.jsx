import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGames, getAllGameFilters } from "../services/service";
import { useFavorites } from "../hooks/useFavorites";

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [platform, setPlatform] = useState("all");
  const [error, setError] = useState("");
  const { favoriteIds } = useFavorites();
  useEffect(() => {
    fetchGames("?page=1&limit=100")
      .then((result) => setGames(getAllGameFilters(result.data)))
      .catch((e) => setError(e.message));
  }, []);
  const filtered = games.filter(
    (game) => platform === "all" || game.platform === platform,
  );
  const genres = [...new Set(filtered.map((game) => game.genre))];
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog overview</p>
          <h1>Dashboard</h1>
        </div>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="all">All platforms</option>
          <option>PC</option>
          <option>PlayStation</option>
          <option>Xbox</option>
          <option>Nintendo</option>
        </select>
      </div>
      {error ? (
        <p className="state error">{error}</p>
      ) : (
        <>
          <div className="stats">
            <div>
              <strong>{filtered.length}</strong>
              <span>Games in view</span>
            </div>
            <div>
              <strong>{genres.length}</strong>
              <span>Genres</span>
            </div>
            <div>
              <strong>{new Set(filtered.map((g) => g.platform)).size}</strong>
              <span>Platforms</span>
            </div>
            <div>
              <strong>{favoriteIds.length}</strong>
              <span>Favorites</span>
            </div>
          </div>
          <div className="breakdowns">
            <div className="info-box">
              <h2>Genres</h2>
              {genres.map((genre) => (
                <p key={genre}>
                  <span>{genre}</span>
                  <b>{filtered.filter((g) => g.genre === genre).length}</b>
                </p>
              ))}
            </div>
            <div className="info-box">
              <h2>Popular games</h2>
              {filtered
                .filter((g) => g.status === "Popular")
                .map((game) => (
                  <p key={game.id}>
                    <Link to={`/games/${game.id}`}>{game.name}</Link>
                    <b>⭐ {game.rating}</b>
                  </p>
                ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
