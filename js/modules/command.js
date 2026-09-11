import { abs } from "../core/paths.js";

function flatten(data) {
  const records = [];
  data.updates.items.forEach((item) => {
    records.push({ title: item.title, hint: "Update", href: abs(item.href || "updates/") });
  });
  data.linkedin.items.forEach((item) => {
    records.push({ title: item.title, hint: "LinkedIn", href: abs("linkedin/") });
  });
  data.apps.items.forEach((item) => {
    records.push({ title: item.title, hint: "App", href: abs("apps/") });
  });
  data.suggested.items.forEach((item) => {
    records.push({ title: item.name, hint: "Suggested", href: item.href });
  });
  data.learning.items.forEach((item) => {
    records.push({ title: item.title, hint: "Learning", href: abs("learning/") });
  });
  data.projects.items.forEach((item) => {
    records.push({ title: item.title, hint: "Case file", href: abs("work/") });
  });
  data.site.nav.forEach((group) => {
    group.items.forEach((item) => {
      records.push({ title: item.label, hint: group.group, href: abs(item.path) });
    });
  });
  return records;
}

export function initCommand(data) {
  const layer = document.getElementById("command");
  if (!layer) return;
  const records = flatten(data);

  const render = (query = "") => {
    const q = query.trim().toLowerCase();
    const hits = records
      .filter((item) => !q || `${item.title} ${item.hint}`.toLowerCase().includes(q))
      .slice(0, 12);
    const list = layer.querySelector("[data-command-list]");
    list.innerHTML = hits
      .map(
        (item, index) =>
          `<li><a class="${index === 0 ? "active" : ""}" href="${item.href}"><span>${item.title}</span><small>${item.hint}</small></a></li>`
      )
      .join("") || `<li><button type="button">No matches</button></li>`;
  };

  const open = () => {
    layer.classList.add("open");
    layer.setAttribute("aria-hidden", "false");
    const input = layer.querySelector("input");
    input.value = "";
    render("");
    input.focus();
  };

  const close = () => {
    layer.classList.remove("open");
    layer.setAttribute("aria-hidden", "true");
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-command]")) open();
  });

  layer.addEventListener("click", (event) => {
    if (event.target === layer) close();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      layer.classList.contains("open") ? close() : open();
    }
    if (event.key === "Escape" && layer.classList.contains("open")) close();
  });

  layer.querySelector("input")?.addEventListener("input", (event) => render(event.target.value));
}
