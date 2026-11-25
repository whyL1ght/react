import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGame } from "../features/gameDetails/gameDetailsSlice";

export function useGame(id) {
  const dispatch = useDispatch();
  const { game, status, error } = useSelector((state) => state.gameDetails);

  useEffect(() => {
    dispatch(loadGame(id));
  }, [dispatch, id]);

  // The store can still hold the previous game for one render
  const oldGame = game && game.id !== Number(id);

  return {
    game,
    loading: status === "loading" || status === "idle" || oldGame,
    error,
    retry: () => dispatch(loadGame(id)),
  };
}
