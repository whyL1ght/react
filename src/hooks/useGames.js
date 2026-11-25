import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGames } from "../features/games/gamesSlice";
import {
  selectGamesError,
  selectGamesLoading,
} from "../features/games/gamesSelectors";

export function useGames(query) {
  const dispatch = useDispatch();
  const loading = useSelector(selectGamesLoading);
  const error = useSelector(selectGamesError);

  useEffect(() => {
    dispatch(loadGames(query));
  }, [dispatch, query]);

  return {
    loading,
    error,
    retry: () => dispatch(loadGames(query)),
  };
}
