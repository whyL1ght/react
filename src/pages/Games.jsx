import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import { useGames } from "../hooks/useGames";
import { useFavorites } from "../hooks/useFavorites";

export default function Games() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const genre = params.get("genre") || "all";
  const platform = params.get("platform") || "all";
  const sort = params.get("sort") || "name";
  const page = Number(params.get("page")) || 1;
  const pageSize = 6;
  const favoritesOnly = params.get("favorites") === "true";
  const { favoriteIds } = useFavorites();
  const { data, loading, error } = useGames(
    `?search=${encodeURIComponent(search)}&sort=${sort}&page=1&limit=100`,
  );
  const filteredGames = data.filter(
    (game) =>
      (genre === "all" || game.genre === genre) &&
      (platform === "all" || game.platform === platform) &&
      (!favoritesOnly || favoriteIds.includes(game.id)),
  );
  const total = filteredGames.length;
  const totalPages = Math.ceil(total / pageSize);
  const visibleGames = filteredGames.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Collection</p>
          <h1>Games</h1>
        </div>
        <span className="muted">{total} games found</span>
      </div>
      <div className="filters">
        <input
          value={search}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Search games..."
        />
        <select
          value={genre}
          onChange={(event) => update("genre", event.target.value)}
        >
          <option value="all">All genres</option>
          <option>Adventure</option>
          <option>Racing</option>
          <option>Strategy</option>
          <option>Simulator</option>
          <option>Mystery</option>
        </select>
        <select
          value={platform}
          onChange={(event) => update("platform", event.target.value)}
        >
          <option value="all">All platforms</option>
          <option>PC</option>
          <option>PlayStation</option>
          <option>Xbox</option>
          <option>Nintendo</option>
        </select>
        <select
          value={sort}
          onChange={(event) => update("sort", event.target.value)}
        >
          <option value="name">A → Z</option>
          <option value="name-desc">Z → A</option>
        </select>
        <label className="favorites-filter">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) =>
              update("favorites", event.target.checked ? "true" : "")
            }
          />{" "}
          Favorites only
        </label>
      </div>
      {loading && <p className="state">Loading games...</p>}
      {error && <p className="state error">{error}</p>}
      {!loading && !error && visibleGames.length === 0 && (
        <p className="state">No games found. Try changing the filters.</p>
      )}
      {!loading && !error && (
        <div className="grid">
          {visibleGames.map((game) => (
            <Card key={game.id} game={game} />
          ))}
        </div>
      )}
      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => update("page", page - 1)}>
            ←
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => update("page", page + 1)}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
