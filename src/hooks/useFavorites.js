import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { switchFavorite } from "../features/favorites/favoritesSlice";
import { selectFavoriteIds } from "../features/favorites/favoritesSelectors";

// Favorite ids are loaded once in RootLayout, here we only read and change them
export function useFavorites() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavoriteIds);

  return {
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite: (id) => dispatch(switchFavorite({ uid: user?.uid, id })),
  };
}
