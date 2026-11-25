import { createSelector } from "@reduxjs/toolkit";

export const selectGames = (state) => state.games.items;
export const selectGamesLoading = (state) =>
  state.games.status === "loading" || state.games.status === "idle";
export const selectGamesError = (state) => state.games.error;

// Games filtered by genre and platform (memoized)
export const selectFilteredGames = createSelector(
  [
    selectGames,
    (state, genre) => genre,
    (state, genre, platform) => platform,
  ],
  (games, genre, platform) =>
    games.filter(
      (game) =>
        (genre === "all" || game.genre === genre) &&
        (platform === "all" || game.platform === platform),
    ),
);

// Numbers for the dashboard (memoized)
export const selectDashboardStats = createSelector(
  [selectGames, (state, platform) => platform],
  (games, platform) => {
    const filtered = games.filter(
      (game) => platform === "all" || game.platform === platform,
    );
    const genres = [...new Set(filtered.map((game) => game.genre))];

    return {
      total: filtered.length,
      platformsCount: new Set(filtered.map((game) => game.platform)).size,
      genres: genres.map((genre) => ({
        name: genre,
        count: filtered.filter((game) => game.genre === genre).length,
      })),
      popular: filtered.filter((game) => game.status === "Popular"),
    };
  },
);
