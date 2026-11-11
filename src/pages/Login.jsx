import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loginWithGoogle, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    clearError();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (await login(email, password)) navigate(redirectTo, { replace: true });
  }

  async function handleGoogle() {
    if (await loginWithGoogle()) navigate(redirectTo, { replace: true });
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Pixel Quest account</p>
      <h1>Log in</h1>
      <label>
        Email
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error && <p className="state error">{error}</p>}
      <button className="button" type="submit">
        Log in
      </button>{" "}
      <button className="button" type="button" onClick={handleGoogle}>
        Sign in with Google
      </button>
      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}
