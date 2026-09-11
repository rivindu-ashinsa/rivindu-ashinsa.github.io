import { abs, asset } from "./paths.js";

export function picture({
  src,
  alt,
  width,
  height,
  caption,
  eager = false,
  sizes = "(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 360px",
  className = "",
  wrap = true,
  zoom = false
}) {
  if (!src) return "";
  const loading = eager ? "eager" : "lazy";
  const fetchPriority = eager ? ' fetchpriority="high"' : "";
  const dims = width && height ? ` width="${width}" height="${height}"` : "";
  const zoomAttr = zoom ? " data-zoom" : "";
  const img = `<img class="${className}" src="${asset(src)}" alt="${escapeHtml(alt || "")}"${dims} loading="${loading}" decoding="async"${fetchPriority} sizes="${sizes}"${zoomAttr} />`;
  const node = wrap ? `<div class="card-media">${img}</div>` : img;
  if (!caption) return node;
  return `<figure>${node}<figcaption>${escapeHtml(caption)}</figcaption></figure>`;
}

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${iso}T00:00:00`));
}

export function linkRow(links = []) {
  if (!links.length) return "";
  return `<div class="links">${links
    .map((link) => {
      const external = /^https?:\/\//i.test(link.href);
      const href = external ? link.href : abs(link.href.replace(/^\.\.\//, ""));
      const extra = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${extra}>${escapeHtml(link.label)}</a>`;
    })
    .join("")}</div>`;
}

export function tagRow(tags = []) {
  if (!tags.length) return "";
  return `<div class="tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

export function bindLightbox(root = document) {
  const layer = document.getElementById("lightbox");
  if (!layer) return;
  root.querySelectorAll("[data-zoom]").forEach((img) => {
    img.addEventListener("click", () => {
      layer.innerHTML = `<img src="${img.src}" alt="${escapeHtml(img.alt)}" />${img.alt ? `<p class="lightbox-caption">${escapeHtml(img.alt)}</p>` : ""}`;
      layer.classList.add("open");
      layer.setAttribute("aria-hidden", "false");
    });
  });
  layer.addEventListener("click", () => {
    layer.classList.remove("open");
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = "";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && layer.classList.contains("open")) {
      layer.click();
    }
  });
}
