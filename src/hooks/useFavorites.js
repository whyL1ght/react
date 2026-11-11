import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchFavoriteIds, toggleFavorite } from "../services/favoritesService";

export const FAVORITES_EVENT = "pixel-quest-favorites-changed";

export function useFavorites() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    let active = true;

    function load() {
      fetchFavoriteIds(uid)
        .then((ids) => {
          if (active) setFavoriteIds(ids);
        })
        .catch(() => {});
    }

    load();
    window.addEventListener(FAVORITES_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(FAVORITES_EVENT, load);
    };
  }, [uid]);

  async function toggle(id) {
    // Update the heart right away, the server answer comes later
    setFavoriteIds((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );

    try {
      await toggleFavorite(uid, id);
    } catch {
      // On error the reload below restores the real list
    }
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  }

  return {
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite: toggle,
  };
}
