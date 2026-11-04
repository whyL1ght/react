import { NavLink } from "react-router-dom";

const links = [
  ["/", "Home"],
  ["/games", "Games"],
  ["/dashboard", "Dashboard"],
  ["/about", "About"],
];

export default function NavBar() {
  return (
    <header className="navbar">
      <NavLink className="logo" to="/">PIXEL QUEST</NavLink>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} className={({ isActive }) => (isActive ? "active" : "")} to={to}>
            {label}
          </NavLink>
        ))}
        <NavLink className="login-link" to="/login">Log in</NavLink>
      </nav>
    </header>
  );
}
