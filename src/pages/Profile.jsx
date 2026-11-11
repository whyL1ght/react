import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    if (await logout()) navigate("/login");
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Pixel Quest account</p>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>UID: {user.uid}</p>
      <button className="button" type="button" onClick={handleLogout}>
        Log out
      </button>
    </section>
  );
}
