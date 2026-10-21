export const styles = [
  "Gothic",
  "Baroque",
  "Modernism",
  "Classicism",
  "Islamic",
  "Renaissance",
  "Brutalism",
  "Art Nouveau",
];

const types = [
  "Cathedral",
  "Fortress",
  "Palace",
  "Mausoleum",
  "Library",
  "Theatre",
  "Station",
  "Bridge",
  "Tower",
  "Market",
];

const cities = [
  "Samarkand",
  "Prague",
  "Vienna",
  "Istanbul",
  "Almaty",
  "Barcelona",
  "Florence",
  "Kyiv",
  "Tbilisi",
  "Riga",
  "Lisbon",
];

export const initialBuildings = [];

for (let i = 0; i < 120; i++) {
  const style = styles[i % styles.length];
  const type = types[i % types.length];
  const city = cities[i % cities.length];
  const year = 1100 + ((i * 37) % 900);

  initialBuildings.push({
    id: i + 1,
    name: style + " " + type + " of " + city,
    city: city,
    style: style,
    year: year,
    description:
      "A " + style.toLowerCase() + " " + type.toLowerCase() +
      " in " + city + ", built in " + year +
      ". It is a good example for measured drawings and heritage study.",
  });
}

export const flags = {
  Samarkand: "🇺🇿",
  Prague: "🇨🇿",
  Vienna: "🇦🇹",
  Istanbul: "🇹🇷",
  Almaty: "🇰🇿",
  Barcelona: "🇪🇸",
  Florence: "🇮🇹",
  Kyiv: "🇺🇦",
  Tbilisi: "🇬🇪",
  Riga: "🇱🇻",
  Lisbon: "🇵🇹",
};

export function styleClass(style) {
  return "badge " + style.toLowerCase().replace(" ", "-");
}
