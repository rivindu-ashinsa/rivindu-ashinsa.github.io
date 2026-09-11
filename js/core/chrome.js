import { abs, asset } from "./paths.js";

const svg = {
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 13a6 6 0 0 1-7-8 7 7 0 1 0 8 9 6.2 6.2 0 0 1-1-1z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
};

function formatClock(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function renderChrome(site, pageId) {
  const mast = document.getElementById("mast");
  const rail = document.getElementById("rail");
  if (!mast || !rail) return;

  const current = pageId || "home";
  const crumb = current === "home" ? "atlas / desk" : `atlas / ${current}`;

  const shortcut = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? "⌘K" : "Ctrl K";

  mast.innerHTML = `
    <a class="mark" href="${abs("")}" aria-label="Rivindu Ashinsa homepage">
      <img src="${asset(site.logo)}" alt="" width="34" height="34" />
      <span class="mark-text">${site.handle.split(".")[0]}<em>.${site.handle.split(".")[1]}</em></span>
    </a>
    <p class="pathbar" id="pathbar">${crumb}</p>
    <div class="mast-actions">
      <button class="search-chip" type="button" data-open-command>
        Search the atlas
        <kbd>${shortcut}</kbd>
      </button>
      <button class="icon-btn" type="button" data-open-command aria-label="Search">
        ${svg.search}
      </button>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle color theme">
        ${svg.moon}
      </button>
      <button class="icon-btn nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="rail">
        ${svg.menu}
      </button>
    </div>
  `;

  const groups = site.nav.map((group) => {
    const items = group.items
      .map((item) => {
        const href = abs(item.path);
        const currentAttr = item.id === current ? ' aria-current="page"' : "";
        return `<a href="${href}"${currentAttr}><span>${item.label}</span><span class="hint">${item.hint}</span></a>`;
      })
      .join("");
    return `<div class="rail-group"><h2>${group.group}</h2>${items}</div>`;
  }).join("");

  rail.innerHTML = `
    <p class="rail-clock" data-clock>${formatClock(new Date())}</p>
    <nav aria-label="Studio index">${groups}</nav>
    <div class="rail-status">
      <strong>Now</strong>
      ${site.availability}
    </div>
  `;

  const footer = document.getElementById("colophon");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <p>© ${year} ${site.name}. Atlas desk.</p>
      <p><a href="${abs("contact/")}">Contact</a> · <a href="${abs(site.resume)}" download>CV</a> · Last updated ${site.updated}</p>
    `;
  }

  if (!document.querySelector(".back-to-top")) {
    const top = document.createElement("button");
    top.className = "icon-btn back-to-top";
    top.type = "button";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = svg.up;
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(top);
  }

  window.setInterval(() => {
    const clock = document.querySelector("[data-clock]");
    if (clock) clock.textContent = formatClock(new Date());
  }, 30000);
}

export { svg };
