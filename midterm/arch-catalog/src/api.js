import { initialBuildings } from "./data";

const KEY = "buildings";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadAll() {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(KEY, JSON.stringify(initialBuildings));
  return initialBuildings;
}

export async function getBuildings({ search, style, sort, page, perPage }) {
  await wait(500);
  let list = loadAll();

  if (search) {
    const text = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(text) ||
        b.city.toLowerCase().includes(text)
    );
  }

  if (style !== "all") {
    list = list.filter((b) => b.style === style);
  }

  list = [...list]; 
  if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "oldest") {
    list.sort((a, b) => a.year - b.year);
  } else if (sort === "newest") {
    list.sort((a, b) => b.year - a.year);
  }

  const total = list.length;
  const start = (page - 1) * perPage;
  return { items: list.slice(start, start + perPage), total: total };
}

export async function getBuilding(id) {
  await wait(300);
  const building = loadAll().find((b) => b.id === id);
  if (!building) {
    throw new Error("Building not found");
  }
  return building;
}

export async function addBuilding(data) {
  await wait(300);
  const newBuilding = { ...data, id: Date.now(), year: Number(data.year) };
  const list = loadAll();
  localStorage.setItem(KEY, JSON.stringify([newBuilding, ...list]));
  return newBuilding;
}
