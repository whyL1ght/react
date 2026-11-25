import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadFavoriteGames } from "../features/favorites/favoritesSlice";
import {
  selectFavoriteGames,
  selectFavoriteGamesError,
  selectFavoriteGamesLoading,
} from "../features/favorites/favoritesSelectors";

export function useFavoriteGames(uid) {
  const dispatch = useDispatch();
  const data = useSelector(selectFavoriteGames);
  const loading = useSelector(selectFavoriteGamesLoading);
  const error = useSelector(selectFavoriteGamesError);

  useEffect(() => {
    if (uid) dispatch(loadFavoriteGames(uid));
  }, [dispatch, uid]);

  return {
    data,
    loading,
    error,
    retry: () => dispatch(loadFavoriteGames(uid)),
  };
}
