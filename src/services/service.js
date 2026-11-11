import {
  createItem,
  deleteItem,
  getItem,
  getItemsList,
  updateItem,
} from "../api/fakeApi";
import { getCached, invalidate, invalidatePrefix } from "./cache";

export function fetchGames(params) {
  return getCached(`games:${params}`, () => getItemsList(params));
}

export function fetchGame(id) {
  return getCached(`game:${id}`, () => getItem(id));
}

export async function updateGame(id, changes) {
  const game = await updateItem(id, changes);

  // Remove the changed game and all cached lists, they may contain old data
  invalidate(`game:${id}`);
  invalidatePrefix("games:");
  invalidatePrefix("favorites:games:");

  return game;
}

export async function createGame(data) {
  const game = await createItem(data);

  // New game can appear in any list
  invalidatePrefix("games:");

  return game;
}

export async function deleteGame(id) {
  await deleteItem(id);

  invalidate(`game:${id}`);
  invalidatePrefix("games:");
  invalidatePrefix("favorites:games:");
}

export function getAllGameFilters(games) {
  return games;
}
