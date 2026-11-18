import { Link } from "react-router-dom";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function Offline() {
  const online = useOnlineStatus();

  return (
    <section className="empty-page">
      <div>📡</div>
      <h1>{online ? "You are back online" : "You are offline"}</h1>
      <p className="muted">
        {online
          ? "The connection is restored. You can continue."
          : "No internet connection. Pages you opened before and saved games are still available."}
      </p>
      <button className="button" onClick={() => window.location.reload()}>
        Retry Connection
      </button>{" "}
      <Link className="button secondary" to="/games">
        Open games
      </Link>
    </section>
  );
}
