import { abs } from "./paths.js";

const files = [
  ["site", "data/site.json"],
  ["updates", "data/updates.json"],
  ["linkedin", "data/linkedin.json"],
  ["apps", "data/apps.json"],
  ["suggested", "data/suggested.json"],
  ["learning", "data/learning.json"],
  ["projects", "data/projects.json"],
  ["studio", "data/studio.json"],
  ["credentials", "data/credentials.json"]
];

export async function loadAllData() {
  const entries = await Promise.all(
    files.map(async ([key, file]) => {
      const response = await fetch(abs(file));
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return [key, await response.json()];
    })
  );
  return Object.fromEntries(entries);
}
