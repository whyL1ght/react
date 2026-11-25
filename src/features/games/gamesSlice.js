import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createGame, fetchGames } from "../../services/service";

export const loadGames = createAsyncThunk(
  "games/loadGames",
  async (query) => {
    const result = await fetchGames(query);
    return result.data;
  },
  {
    // Do not start the same request twice
    condition: (query, { getState }) => {
      const { status, query: currentQuery } = getState().games;
      return !(status === "loading" && currentQuery === query);
    },
  },
);

export const addGame = createAsyncThunk(
  "games/addGame",
  async (data, { dispatch, getState }) => {
    const game = await createGame(data);
    // The list changed, load it again
    const { query } = getState().games;
    if (query) dispatch(loadGames(query));
    return game;
  },
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    items: [],
    query: "",
    status: "idle",
    error: "",
    requestId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGames.pending, (state, action) => {
        state.status = "loading";
        state.error = "";
        state.query = action.meta.arg;
        state.requestId = action.meta.requestId;
      })
      .addCase(loadGames.fulfilled, (state, action) => {
        // Ignore answers of old requests
        if (state.requestId !== action.meta.requestId) return;
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadGames.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = "failed";
        state.items = [];
        state.error = action.error.message;
      });
  },
});

export default gamesSlice.reducer;
