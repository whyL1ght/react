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
