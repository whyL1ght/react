export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectFavoritesCount = (state) => state.favorites.ids.length;
export const selectFavoriteGames = (state) => state.favorites.games;
export const selectFavoriteGamesLoading = (state) =>
  state.favorites.gamesStatus === "loading";
export const selectFavoriteGamesError = (state) => state.favorites.gamesError;
