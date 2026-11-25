import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "../features/games/gamesSlice";
import gameDetailsReducer from "../features/gameDetails/gameDetailsSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    gameDetails: gameDetailsReducer,
    favorites: favoritesReducer,
  },
});
