import { API_CONFIG, DATA_KEY, FAVORITES_KEY } from "./settings.js";
import { initialDataSample } from "./initial-data-sample.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";

function fakeRequest(operation) {
  return new Promise((resolve, reject) => {
    const delay =
      Math.floor(
        Math.random() * (API_CONFIG.maxDelay - API_CONFIG.minDelay + 1),
      ) + API_CONFIG.minDelay;

    setTimeout(() => {
      if (Math.random() < API_CONFIG.errorChance) {
        reject(new Error("Could not load data. Please try again."));
        return;
      }

      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

// Public catalog request. It goes through the service worker (network-first),
// so the answer stays available offline. Saved data is used only when
// the local catalog is empty.
async function ensureCatalog() {
  let games = initialDataSample;
  try {
    const response = await fetch("/api/games.json");
    if (response.ok) games = await response.json();
  } catch (error) {
    console.error("Could not load the public catalog.", error);
  }

  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(games));
  }
}

function initializeDatabase() {
  const savedData = localStorage.getItem(DATA_KEY);

  if (!savedData) return;

  try {
    const items = JSON.parse(savedData);
    // Do not add deleted sample games back, only refresh the sample metadata
    const migratedItems = items.map((item) => {
      const sample = initialDataSample.find((game) => game.id === item.id);
      return sample ? { ...sample, ...item, ...getGameMetadata(sample) } : item;
    });

    localStorage.setItem(DATA_KEY, JSON.stringify(migratedItems));
  } catch (error) {
    console.error(
      "Could not read saved game data. Resetting the local catalog.",
      error,
    );
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
  }
}

function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}

function getGameMetadata(sample) {
  return {
    genre: sample.genre,
    platform: sample.platform,
    rating: sample.rating,
    year: sample.year,
    status: sample.status,
  };
}

initializeDatabase();

export async function getItemsList(query = "") {
  await ensureCatalog();
  return fakeRequest(() => {
    const params = new URLSearchParams(query);
    const search = params.get("search")?.toLowerCase() || "";
    const sort = params.get("sort") || "name";
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 6;

    let items = readData().filter((item) =>
      `${item.name} ${item.description}`.toLowerCase().includes(search),
    );

    items = [...items].sort((a, b) =>
      sort === "name-desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name),
    );

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      data: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages,
    };
  });
}

export async function getItem(id) {
  await ensureCatalog();
  return fakeRequest(() => {
    const item = readData().find((game) => game.id === Number(id));
    if (!item) throw new Error("Game not found.");
    return item;
  });
}

export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const items = readData();
    const index = items.findIndex((game) => game.id === Number(id));
    if (index === -1) throw new Error("Game not found.");

    items[index] = { ...items[index], ...changes };
    localStorage.setItem(DATA_KEY, JSON.stringify(items));
    return items[index];
  });
}

export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();
    const id = Math.max(0, ...items.map((game) => game.id)) + 1;
    const newItem = { id, status: "In catalog", ...data };

    localStorage.setItem(DATA_KEY, JSON.stringify([...items, newItem]));
    return newItem;
  });
}

export async function deleteItem(id) {
  return fakeRequest(() => {
    const items = readData();
    if (!items.some((game) => game.id === Number(id))) {
      throw new Error("Game not found.");
    }

    const rest = items.filter((game) => game.id !== Number(id));
    localStorage.setItem(DATA_KEY, JSON.stringify(rest));
  });
}

// Every logged-in user has their own favorites, guests share one list
function getFavoritesKey(uid) {
  return uid ? `${FAVORITES_KEY}-${uid}` : FAVORITES_KEY;
}

function readFavoriteIds(uid) {
  try {
    return JSON.parse(localStorage.getItem(getFavoritesKey(uid)) || "[]");
  } catch {
    return [];
  }
}

// Logged-in users keep favorites in Firestore (collection "favorites", document = uid).
// localStorage is a copy, it is used for guests and when there is no connection.
async function loadFavoriteIds(uid) {
  if (!uid) return readFavoriteIds(uid);

  try {
    const snapshot = await getDoc(doc(db, "favorites", uid));
    // No document yet: keep the favorites that were saved on this device
    const ids = snapshot.exists() ? snapshot.data().ids : readFavoriteIds(uid);
    localStorage.setItem(getFavoritesKey(uid), JSON.stringify(ids));
    return ids;
  } catch {
    return readFavoriteIds(uid);
  }
}

export async function getFavoriteIds(uid) {
  return loadFavoriteIds(uid);
}

export async function getFavoriteItems(uid) {
  const ids = await loadFavoriteIds(uid);
  await ensureCatalog();
  return fakeRequest(() => readData().filter((game) => ids.includes(game.id)));
}

export async function toggleFavoriteItem(uid, id) {
  const ids = await loadFavoriteIds(uid);
  const next = ids.includes(id)
    ? ids.filter((favoriteId) => favoriteId !== id)
    : [...ids, id];
  localStorage.setItem(getFavoritesKey(uid), JSON.stringify(next));

  // No await: without connection the write waits, and the page must not freeze
  if (uid) setDoc(doc(db, "favorites", uid), { ids: next }).catch(() => {});

  return next;
}
