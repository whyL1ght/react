import { getItem, getItemsList } from "../api/fakeApi";

export async function fetchGames(params) {
  const result = await getItemsList(params);
  return result;
}

export async function fetchGame(id) {
  return getItem(id);
}

export function getAllGameFilters(games) {
  return games;
}
