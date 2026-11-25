import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { useGames } from "../hooks/useGames";
import { selectFilteredGames } from "../features/games/gamesSelectors";

export default function Games() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const genre = params.get("genre") || "all";
  const platform = params.get("platform") || "all";
  const sort = params.get("sort") || "name";
  const page = Number(params.get("page")) || 1;
  const pageSize = 6;
  // Text in the input, it goes to the URL with a small delay
  const [searchInput, setSearchInput] = useState(search);
  const { loading, error, retry } = useGames(
    `?search=${encodeURIComponent(search)}&sort=${sort}&page=1&limit=100`,
  );
  const filteredGames = useSelector((state) =>
    selectFilteredGames(state, genre, platform),
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

  // If the URL changed (back button, menu link), show its search in the input
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce: update the URL 400ms after the user stops typing
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => update("search", searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Collection</p>
          <h1>Games</h1>
        </div>
        <div>
          <span className="muted">{total} games found</span>{" "}
          {user && (
            <Link className="button" to="/games/new">
              Add game
            </Link>
          )}
        </div>
      </div>
      <div className="filters">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
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
      </div>
      {loading && <p className="state">Loading games...</p>}
      {error && (
        <div className="state error">
          <p>{error}</p>
          <button className="button" type="button" onClick={retry}>
            Try again
          </button>
        </div>
      )}
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
