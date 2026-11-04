import { API_CONFIG, DATA_KEY } from "./settings.js";
import { initialDataSample } from "./initial-data-sample.js";

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

function initializeDatabase() {
  const savedData = localStorage.getItem(DATA_KEY);

  if (!savedData) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
    return;
  }

  try {
    const items = JSON.parse(savedData);
    const migratedItems = [
      ...initialDataSample.map((sample) => {
        const savedItem = items.find((item) => item.id === sample.id);
        return savedItem
          ? { ...sample, ...savedItem, ...getGameMetadata(sample) }
          : sample;
      }),
      ...items.filter(
        (item) => !initialDataSample.some((sample) => sample.id === item.id),
      ),
    ];

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
  return fakeRequest(() => {
    const item = readData().find((game) => game.id === Number(id));
    if (!item) throw new Error("Game not found.");
    return item;
  });
}
