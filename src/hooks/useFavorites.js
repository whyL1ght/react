import { useEffect, useState } from "react";

const FAVORITES_KEY = "pixel-quest-favorites";
const FAVORITES_EVENT = "pixel-quest-favorites-changed";

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(readFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function toggleFavorite(id) {
    setFavoriteIds((current) => {
      const next = current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
      return next;
    });
  }

  useEffect(() => {
    const handleFavoritesChange = () => setFavoriteIds(readFavorites());
    window.addEventListener(FAVORITES_EVENT, handleFavoritesChange);
    return () =>
      window.removeEventListener(FAVORITES_EVENT, handleFavoritesChange);
  }, []);

  return {
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite,
  };
}
