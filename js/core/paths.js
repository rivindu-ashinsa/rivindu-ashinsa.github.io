export function getBase() {
  return document.documentElement.dataset.base || "./";
}

export function abs(path = "") {
  const base = getBase();
  if (!path) return base;
  if (/^https?:\/\//i.test(path) || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }
  if (path.startsWith("#")) return path;
  return `${base}${path.replace(/^\.\//, "")}`;
}

export function asset(path = "") {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return abs(encoded);
}
