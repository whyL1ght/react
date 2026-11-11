import {
  getFavoriteIds,
  getFavoriteItems,
  toggleFavoriteItem,
} from "../api/fakeApi";
import { getCached, invalidate } from "./cache";

export function fetchFavoriteIds(uid) {
  return getCached(`favorites:ids:${uid}`, () => getFavoriteIds(uid));
}

export function fetchFavoriteGames(uid) {
  return getCached(`favorites:games:${uid}`, () => getFavoriteItems(uid));
}

export async function toggleFavorite(uid, id) {
  const ids = await toggleFavoriteItem(uid, id);

  // Favorites of this user changed, so cached ids and games are old
  invalidate(`favorites:ids:${uid}`);
  invalidate(`favorites:games:${uid}`);

  return ids;
}
