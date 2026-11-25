import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { useFavoriteGames } from "../hooks/useFavoriteGames";

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const {
    data: favoriteGames,
    loading,
    error,
    retry,
  } = useFavoriteGames(user?.uid);

  if (authLoading) return <p className="state">Checking session...</p>;

  if (!user) {
    return (
      <section className="page">
        <h1>Favorites</h1>
        <p className="state">
          Please <Link to="/login">log in</Link> to view your favorites.
        </p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your collection</p>
          <h1>Favorites</h1>
        </div>
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
      {!loading && !error && favoriteGames.length === 0 && (
        <p className="state">You have no favorite games yet.</p>
      )}
      <div className="grid">
        {favoriteGames.map((game) => (
          <Card key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
