import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGames } from "../hooks/useGames";
import { selectDashboardStats } from "../features/games/gamesSelectors";
import { selectFavoritesCount } from "../features/favorites/favoritesSelectors";

export default function Dashboard() {
  const [platform, setPlatform] = useState("all");
  const { error, retry } = useGames("?page=1&limit=100");
  const stats = useSelector((state) => selectDashboardStats(state, platform));
  const favoritesCount = useSelector(selectFavoritesCount);

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
        <div className="state error">
          <p>{error}</p>
          <button className="button" type="button" onClick={retry}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="stats">
            <div>
              <strong>{stats.total}</strong>
              <span>Games in view</span>
            </div>
            <div>
              <strong>{stats.genres.length}</strong>
              <span>Genres</span>
            </div>
            <div>
              <strong>{stats.platformsCount}</strong>
              <span>Platforms</span>
            </div>
            <div>
              <strong>{favoritesCount}</strong>
              <span>Favorites</span>
            </div>
          </div>
          <div className="breakdowns">
            <div className="info-box">
              <h2>Genres</h2>
              {stats.genres.map((genre) => (
                <p key={genre.name}>
                  <span>{genre.name}</span>
                  <b>{genre.count}</b>
                </p>
              ))}
            </div>
            <div className="info-box">
              <h2>Popular games</h2>
              {stats.popular.map((game) => (
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
