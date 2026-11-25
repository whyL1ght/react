# Pixel Quest

An educational video game catalog built with React. The project uses the fake
API. Data is saved in `localStorage`, so no separate backend is needed.

Main routes:

- `/` — home
- `/games` — catalog with search, filters, sorting, and pagination
- `/games/new` — add a game (logged-in users only)
- `/games/:id` — game details
- `/dashboard` — catalog statistics
- `/about` — project information
- `/login` — email/password and Google login
- `/signup` — registration with password confirmation
- `/favorites` — favorite games of the logged-in user (guests are asked to log in)
- `/profile` — protected page with the user's email and UID, and logout

## Caching strategy

Games requests (the list and a single game) and favorites requests are cached in
memory (`src/services/cache.js`, used by `service.js` and `favoritesService.js`). The cache key is made from the resource name and the
request params, for example `games:?search=a&sort=name&page=1&limit=100` or
`game:3`. Each entry is fresh for 1 minute; after that the data is requested
again. Components ignore the results of outdated requests, so an old response
cannot overwrite a newer one.

The cache is invalidated when a game is created ("Add game"), updated
("Edit description") or deleted ("Delete game"). These actions are available to
logged-in users: the cached game and all cached
lists are removed, and the next request loads fresh data.

Favorites are also stored through the API layer (`src/api/fakeApi.js`).
Cache keys are `favorites:ids:<uid>` and `favorites:games:<uid>`. They are
invalidated when the user adds or removes a favorite, and the games lists are
cleared when a game is created, edited or deleted.

## Redux Toolkit

Global data is kept in a Redux store (`src/store/store.js`), connected with
`<Provider>` in `src/main.jsx`. Authentication stays in `AuthContext`, and
temporary UI state (form fields, edit mode, dashboard platform filter) stays
local in components. Search, filters, sorting and pagination stay in the URL.
Search input is debounced (400 ms) before it goes to the URL.

Folders:

- `src/features/*` — slices, thunks and selectors
- `src/services/*` — API calls with the in-memory cache
- `src/hooks/*` — custom hooks that dispatch thunks and read state with `useSelector`
- `src/pages/*`, `src/components/*` — UI

### Slices

- `games` — games list: `items`, `query`, `status`, `error`.
- `gameDetails` — one opened game: `game`, `status`, `error`.
- `favorites` — favorite ids of the current user and the list of favorite games.

### Thunks (`createAsyncThunk`)

- `loadGames(query)` — loads the list. `condition` skips the request if the same
  query is already loading.
- `loadGame(id)` — loads one game for the details page.
- `saveGame({ id, changes })` — edits a game, then reloads the games list.
- `removeGame(id)` — deletes a game, then reloads the games list.
- `addGame(data)` — creates a game, then reloads the games list.
- `loadFavoriteIds(uid)`, `loadFavoriteGames(uid)` — load favorites.
- `switchFavorite({ uid, id })` — adds/removes a favorite. The heart changes
  right away (in `pending`), goes back on error (in `rejected`), and the
  favorite games are reloaded after success.

All `pending`, `fulfilled` and `rejected` cases are handled in `extraReducers`.
Every slice saves the `requestId` of the last request and ignores answers of
older requests, so stale data cannot replace new data. Pages show loading,
error with a "Try again" button, and an empty state.

### Selectors

- `selectGames`, `selectGamesLoading`, `selectGamesError` — simple selectors.
- `selectFilteredGames(state, genre, platform)` — memoized with `createSelector`,
  filters the list by genre and platform.
- `selectDashboardStats(state, platform)` — memoized with `createSelector`,
  counts games, genres, platforms and popular games for the dashboard.
- `selectFavoriteIds`, `selectFavoritesCount`, `selectFavoriteGames` — favorites.

Favorite ids are loaded once in `RootLayout` (and again when the user changes),
so cards do not send their own requests. The service cache (1 minute) still
prevents repeated API calls for the same data.
