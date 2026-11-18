import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const links = [
  ["/", "Home"],
  ["/games", "Games"],
  ["/favorites", "Favorites"],
  ["/dashboard", "Dashboard"],
  ["/about", "About"],
];

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    if (await logout()) navigate("/login");
  }

  return (
    <header className="navbar">
      <NavLink className="logo" to="/">
        PIXEL QUEST
      </NavLink>
      <span className={`status ${online ? "online" : "offline"}`}>
        {online ? "Online" : "Offline"}
      </span>
      <button
        className="menu-button"
        type="button"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>
      <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            className={({ isActive }) => (isActive ? "active" : "")}
            to={to}
          >
            {label}
          </NavLink>
        ))}
        {!loading && !user && (
          <>
            <NavLink className="login-link" to="/login">
              Log in
            </NavLink>
            <NavLink className="login-link" to="/signup">
              Sign up
            </NavLink>
          </>
        )}
        {!loading && user && (
          <>
            <NavLink className="login-link" to="/profile">
              Profile
            </NavLink>
            <button className="login-link" type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
