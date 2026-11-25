import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteGame, fetchGame, updateGame } from "../../services/service";
import { loadGames } from "../games/gamesSlice";

export const loadGame = createAsyncThunk("gameDetails/loadGame", (id) =>
  fetchGame(id),
);

export const saveGame = createAsyncThunk(
  "gameDetails/saveGame",
  async ({ id, changes }, { dispatch, getState }) => {
    const game = await updateGame(id, changes);
    // The game in the list is old now, load the list again
    const { query } = getState().games;
    if (query) dispatch(loadGames(query));
    return game;
  },
);

export const removeGame = createAsyncThunk(
  "gameDetails/removeGame",
  async (id, { dispatch, getState }) => {
    await deleteGame(id);
    const { query } = getState().games;
    if (query) dispatch(loadGames(query));
  },
);

const gameDetailsSlice = createSlice({
  name: "gameDetails",
  initialState: {
    game: null,
    status: "idle",
    error: "",
    requestId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGame.pending, (state, action) => {
        state.status = "loading";
        state.error = "";
        state.game = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(loadGame.fulfilled, (state, action) => {
        // Ignore answers of old requests (user opened another game)
        if (state.requestId !== action.meta.requestId) return;
        state.status = "succeeded";
        state.game = action.payload;
      })
      .addCase(loadGame.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveGame.fulfilled, (state, action) => {
        state.game = action.payload;
      })
      .addCase(removeGame.fulfilled, (state) => {
        state.game = null;
        state.status = "idle";
      });
  },
});

export default gameDetailsSlice.reducer;
