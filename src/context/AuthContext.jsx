import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  subscribeToAuth,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    return subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  async function run(action) {
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  const value = {
    user,
    loading,
    error,
    clearError: () => setError(""),
    signup: (email, password) => run(() => signUpWithEmail(email, password)),
    login: (email, password) => run(() => signInWithEmail(email, password)),
    loginWithGoogle: () => run(signInWithGoogle),
    logout: () => run(signOutUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
