import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import UpdatePrompt from "./UpdatePrompt";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useAuth } from "../context/AuthContext";
import { loadFavoriteIds } from "../features/favorites/favoritesSlice";

export default function RootLayout() {
  const online = useOnlineStatus();
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const uid = user?.uid;

  // Load favorite ids once for the whole app, and again when the user changes
  useEffect(() => {
    if (!loading) dispatch(loadFavoriteIds(uid));
  }, [dispatch, uid, loading]);

  return (
    <>
      <UpdatePrompt />
      <NavBar />
      {!online && (
        <p className="offline-bar">
          You are offline. You are viewing cached data.
        </p>
      )}
      <main className="container">
        <Outlet />
      </main>
      <footer>PIXEL QUEST · educational video game catalog</footer>
    </>
  );
}
