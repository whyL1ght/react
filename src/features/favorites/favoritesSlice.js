import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchFavoriteGames,
  fetchFavoriteIds,
  toggleFavorite,
} from "../../services/favoritesService";

export const loadFavoriteIds = createAsyncThunk(
  "favorites/loadFavoriteIds",
  (uid) => fetchFavoriteIds(uid),
);

export const loadFavoriteGames = createAsyncThunk(
  "favorites/loadFavoriteGames",
  (uid) => fetchFavoriteGames(uid),
);

export const switchFavorite = createAsyncThunk(
  "favorites/switchFavorite",
  async ({ uid, id }, { dispatch }) => {
    const ids = await toggleFavorite(uid, id);
    // Favorites page shows games, load them again
    if (uid) dispatch(loadFavoriteGames(uid));
    return ids;
  },
);

function toggleId(ids, id) {
  return ids.includes(id)
    ? ids.filter((favoriteId) => favoriteId !== id)
    : [...ids, id];
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    ids: [],
    idsRequestId: null,
    games: [],
    gamesStatus: "idle",
    gamesError: "",
    gamesRequestId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavoriteIds.pending, (state, action) => {
        state.idsRequestId = action.meta.requestId;
      })
      .addCase(loadFavoriteIds.fulfilled, (state, action) => {
        if (state.idsRequestId !== action.meta.requestId) return;
        state.ids = action.payload;
      })
      .addCase(loadFavoriteIds.rejected, (state, action) => {
        if (state.idsRequestId !== action.meta.requestId) return;
        state.ids = [];
      })
      .addCase(loadFavoriteGames.pending, (state, action) => {
        state.gamesStatus = "loading";
        state.gamesError = "";
        state.gamesRequestId = action.meta.requestId;
      })
      .addCase(loadFavoriteGames.fulfilled, (state, action) => {
        if (state.gamesRequestId !== action.meta.requestId) return;
        state.gamesStatus = "succeeded";
        state.games = action.payload;
      })
      .addCase(loadFavoriteGames.rejected, (state, action) => {
        if (state.gamesRequestId !== action.meta.requestId) return;
        state.gamesStatus = "failed";
        state.games = [];
        state.gamesError = action.error.message;
      })
      // Update the heart right away, the server answer comes later
      .addCase(switchFavorite.pending, (state, action) => {
        state.ids = toggleId(state.ids, action.meta.arg.id);
      })
      .addCase(switchFavorite.fulfilled, (state, action) => {
        state.ids = action.payload;
      })
      // On error put the heart back
      .addCase(switchFavorite.rejected, (state, action) => {
        state.ids = toggleId(state.ids, action.meta.arg.id);
      });
  },
});

export default favoritesSlice.reducer;
