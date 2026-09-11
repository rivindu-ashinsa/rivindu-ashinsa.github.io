import { abs } from "../core/paths.js";
import { picture, formatDate, linkRow, tagRow, escapeHtml, bindLightbox } from "../core/render.js";

const texts = [
  "parsing ECG waveforms in real time…",
  "forecasting SpO2 deterioration…",
  "cleaning a dataset before trusting it…",
  "shipping ML that holds up in production…"
];

function typeHero() {
  const el = document.getElementById("typing");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    el.textContent = texts[0];
    return;
  }
  let i = 0;
  let c = 0;
  let del = false;
  const tick = () => {
    const word = texts[i];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) {
      del = true;
      setTimeout(tick, 1600);
      return;
    }
    if (del && c === 0) {
      del = false;
      i = (i + 1) % texts.length;
    }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 32 : 48);
  };
  setTimeout(tick, 400);
}

function startCarousel(track) {
  if (!track || track.children.length < 3) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const originals = [...track.children];
  originals.slice(0, 3).forEach((node) => track.appendChild(node.cloneNode(true)));
  let index = 0;
  const step = () => {
    index += 1;
    const first = track.querySelector("figure");
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 12;
    const width = first.getBoundingClientRect().width + gap;
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(-${index * width}px)`;
    if (index >= originals.length) {
      setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        track.style.transform = "translateX(0)";
      }, 520);
    }
  };
  setInterval(step, 2800);
}

export function pageHome(data) {
  typeHero();
  const updates = document.getElementById("updates-mount");
  if (updates) {
    updates.innerHTML = data.updates.items
      .slice(0, 6)
      .map(
        (item) => `
        <a class="card ticker-item" href="${abs(item.href || "updates/")}">
          <time datetime="${item.date}">${formatDate(item.date)} · ${item.kind}</time>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.summary)}</p>
        </a>`
      )
      .join("");
  }

  const linkedin = document.getElementById("linkedin-mount");
  if (linkedin) {
    linkedin.innerHTML = data.linkedin.items
      .slice(0, 3)
      .map(
        (item) => `
        <article class="card" data-reveal>
          ${picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height })}
          <p class="meta">${formatDate(item.date)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.excerpt)}</p>
          ${tagRow(item.tags)}
          <div class="links"><a href="${item.href}" target="_blank" rel="noopener noreferrer">Open on LinkedIn</a></div>
        </article>`
      )
      .join("");
  }

  const apps = document.getElementById("apps-mount");
  if (apps) {
    apps.innerHTML = data.apps.items
      .slice(0, 4)
      .map(
        (item) => `
        <article class="card" data-reveal>
          ${picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height })}
          <p class="meta">${item.status} · ${item.year}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
          ${linkRow(item.links)}
        </article>`
      )
      .join("");
  }

  const suggested = document.getElementById("suggested-mount");
  if (suggested) {
    suggested.innerHTML = data.suggested.items
      .slice(0, 6)
      .map(
        (item) => `
        <article class="card" data-reveal>
          <p class="meta">${escapeHtml(item.category)}</p>
          <h3><a href="${item.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a></h3>
          <p>${escapeHtml(item.why)}</p>
        </article>`
      )
      .join("");
  }

  const learning = document.getElementById("learning-mount");
  if (learning) {
    learning.innerHTML = data.learning.items
      .slice(0, 3)
      .map(
        (item) => `
        <article class="card" data-reveal>
          <header>
            <p class="meta">${escapeHtml(item.track)} · ${formatDate(item.date)}</p>
            <span class="status ${item.status}">${item.status}</span>
          </header>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
        </article>`
      )
      .join("");
  }
}

export function pageUpdates(data) {
  const root = document.getElementById("feed");
  if (!root) return;
  root.innerHTML = data.updates.items
    .map(
      (item) => `
      <article class="card" data-reveal>
        <p class="meta">${formatDate(item.date)} · ${item.kind}</p>
        <h2><a href="${abs(item.href || "")}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.summary)}</p>
      </article>`
    )
    .join("");
}

export function pageLinkedin(data) {
  const root = document.getElementById("feed");
  if (!root) return;
  root.innerHTML = data.linkedin.items
    .map(
      (item) => `
      <article class="card" data-reveal>
        ${picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height, sizes: "(max-width: 720px) 92vw, 520px" })}
        <p class="meta">${formatDate(item.date)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.excerpt)}</p>
        ${tagRow(item.tags)}
        <div class="links"><a href="${item.href}" target="_blank" rel="noopener noreferrer">Read on LinkedIn</a></div>
      </article>`
    )
    .join("");
}

export function pageApps(data) {
  const root = document.getElementById("feed");
  if (!root) return;
  root.innerHTML = data.apps.items
    .map(
      (item) => `
      <article class="card" data-reveal>
        ${picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height, sizes: "(max-width: 720px) 92vw, 480px" })}
        <p class="meta">${item.status} · ${item.year} · ${escapeHtml(item.role)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
        ${tagRow(item.tags)}
        ${linkRow(item.links)}
      </article>`
    )
    .join("");
}

export function pageSuggested(data) {
  const root = document.getElementById("feed");
  const filters = document.getElementById("filters");
  if (!root) return;
  const cats = ["all", ...new Set(data.suggested.items.map((item) => item.category))];
  if (filters) {
    filters.innerHTML = cats
      .map((cat, i) => `<button class="filter${i === 0 ? " active" : ""}" data-filter="${cat}" type="button">${cat}</button>`)
      .join("");
  }
  const draw = (cat = "all") => {
    root.innerHTML = data.suggested.items
      .filter((item) => cat === "all" || item.category === cat)
      .map(
        (item) => `
        <article class="card">
          <p class="meta">${escapeHtml(item.category)}</p>
          <h2><a href="${item.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a></h2>
          <p>${escapeHtml(item.why)}</p>
          ${tagRow(item.tags)}
        </article>`
      )
      .join("");
  };
  draw();
  filters?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-filter]");
    if (!btn) return;
    filters.querySelectorAll(".filter").forEach((node) => node.classList.remove("active"));
    btn.classList.add("active");
    draw(btn.dataset.filter);
  });
}

export function pageLearning(data) {
  const root = document.getElementById("feed");
  if (!root) return;
  root.innerHTML = data.learning.items
    .map(
      (item) => `
      <article class="card journal" data-reveal>
        <header>
          <p class="meta">${escapeHtml(item.track)} · ${formatDate(item.date)}</p>
          <span class="status ${item.status}">${item.status}</span>
        </header>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
        <ul>${item.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
        ${linkRow(item.resources)}
      </article>`
    )
    .join("");
}

export function pageWork(data) {
  const root = document.getElementById("work-mount");
  const filters = document.getElementById("filters");
  if (!root) return;
  const featured = data.projects.items.find((item) => item.featured);
  const rest = data.projects.items.filter((item) => !item.featured);

  const featuredHtml = featured
    ? `
    <article class="card featured" data-category="${featured.category}">
      <div>
        ${picture({ src: featured.image, alt: featured.imageAlt, width: featured.width, height: featured.height, eager: true, sizes: "(max-width: 900px) 92vw, 420px" })}
        <a href="${featured.demoHref}" target="_blank" rel="noopener noreferrer">
          ${picture({ src: featured.demoThumb, alt: featured.demoThumbAlt, width: featured.demoWidth, height: featured.demoHeight, sizes: "(max-width: 900px) 92vw, 420px" })}
        </a>
      </div>
      <div>
        <p class="meta">${escapeHtml(featured.tag)}</p>
        <h2>${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(featured.summary)}</p>
        <ul>${featured.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
        ${tagRow(featured.tags)}
        <div class="featured-actions">
          ${featured.links
            .map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`)
            .join("")}
        </div>
      </div>
      <div style="grid-column:1/-1">
        <p class="meta">How the system looks</p>
        <div class="gallery-viewport">
        <div class="gallery-track" id="sdgp-carousel-track">
          ${featured.gallery
            .map(
              (shot) => `
              <figure>
                ${picture({ src: shot.src, alt: shot.alt, width: shot.width, height: shot.height, wrap: false, zoom: true, sizes: "(max-width: 720px) 92vw, 32vw" })}
                <figcaption>${escapeHtml(shot.caption)}</figcaption>
              </figure>`
            )
            .join("")}
        </div>
        </div>
      </div>
    </article>`
    : "";

  const cards = rest
    .map(
      (item) => `
      <article class="card case-file" data-category="${item.category}" data-reveal>
        ${picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height })}
        <p class="meta">${escapeHtml(item.tag)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        ${tagRow(item.tags)}
        ${linkRow(item.links)}
      </article>`
    )
    .join("");

  root.innerHTML = featuredHtml + `<div class="grid-3" id="case-grid">${cards}</div>`;
  startCarousel(document.getElementById("sdgp-carousel-track"));
  bindLightbox(root);

  if (filters) {
    filters.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-filter]");
      if (!btn) return;
      filters.querySelectorAll(".filter").forEach((node) => node.classList.remove("active"));
      btn.classList.add("active");
      const value = btn.dataset.filter;
      root.querySelectorAll("[data-category]").forEach((card) => {
        const match = value === "all" || card.dataset.category === value;
        card.classList.toggle("hidden", !match);
      });
    });
  }
}

export function pageStudio(data) {
  const about = data.studio;
  const root = document.getElementById("studio-mount");
  if (!root) return;
  root.innerHTML = `
    <div class="grid-2">
      <article class="card" data-reveal>
        <p class="kicker"><span class="idx">01</span> Profile</p>
        <h2>${escapeHtml(about.about.headline)}</h2>
        ${about.about.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        <ul class="value-list">${about.about.values.map((v) => `<li>${escapeHtml(v)}</li>`).join("")}</ul>
        ${tagRow(about.about.chips)}
      </article>
      <div>
        <article class="card id-card" data-reveal>
          ${picture({
            src: about.identity.photo,
            alt: about.identity.photoAlt,
            width: about.identity.width,
            height: about.identity.height,
            className: "portrait",
            wrap: false,
            eager: true,
            sizes: "112px"
          })}
          <div>
            <p class="meta">Field profile</p>
            <ul>${about.identity.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
          </div>
        </article>
        <article class="card" data-reveal style="margin-top:16px">
          <p class="meta">Education log</p>
          ${about.education
            .map(
              (edu) => `
              <div class="edu">
                <p class="meta">${escapeHtml(edu.time)}</p>
                <h3>${escapeHtml(edu.title)}</h3>
                <p>${escapeHtml(edu.place)}</p>
              </div>`
            )
            .join("")}
        </article>
      </div>
    </div>
    <section class="band" style="margin-top:36px">
      <p class="kicker"><span class="idx">02</span> Currently building</p>
      ${about.experience
        .map(
          (job) => `
          <article class="card" data-reveal>
            <p class="meta">${escapeHtml(job.time)} · <span class="chip chip-live">${job.status}</span></p>
            <h2>${escapeHtml(job.title)}</h2>
            <p>${escapeHtml(job.company)}</p>
            <p>${escapeHtml(job.summary)}</p>
            ${tagRow(job.chips)}
          </article>`
        )
        .join("")}
    </section>
    <section>
      <p class="kicker"><span class="idx">03</span> Stack</p>
      <div class="grid-3">
        ${about.skills
          .map(
            (group) => `
            <article class="card" data-reveal>
              <h3>${escapeHtml(group.title)}</h3>
              <ul class="stack-list">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </article>`
          )
          .join("")}
      </div>
    </section>
  `;
}

export function pageCredentials(data) {
  const root = document.getElementById("feed");
  if (!root) return;
  const certs = data.credentials.certifications
    .map(
      (item) => `
      <article class="card" data-reveal>
        ${picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height, sizes: "(max-width: 720px) 92vw, 340px" })}
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <p class="meta">${escapeHtml(item.issuer)}</p>
      </article>`
    )
    .join("");
  const ach = data.credentials.achievements
    .map(
      (item) => `
      <article class="card" data-reveal>
        ${item.image ? picture({ src: item.image, alt: item.imageAlt, width: item.width, height: item.height }) : ""}
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <p class="meta">${escapeHtml(item.meta)}</p>
        ${item.href ? `<div class="links"><a href="${item.href}" target="_blank" rel="noopener noreferrer">Competition details</a></div>` : ""}
      </article>`
    )
    .join("");
  root.innerHTML = `
    <div class="grid-3">${certs}</div>
    <p style="margin:22px 0"><a class="btn btn-line" href="${data.credentials.moreHref}" target="_blank" rel="noopener noreferrer">More certificates on LinkedIn</a></p>
    <h2>Log</h2>
    <div class="grid-3">${ach}</div>
  `;
}

export function pageContact(data) {
  const site = data.site;
  const root = document.getElementById("contact-mount");
  if (!root) return;
  root.innerHTML = `
    <div class="contact-grid">
      <div>
        <div class="card info-row" style="margin:0 0 20px">
          <div><span class="label">Location</span><p>${escapeHtml(site.location)}</p></div>
          <div><span class="label">Email</span><p><a href="mailto:${site.email}">${site.email}</a></p></div>
          <div><span class="label">Phone</span><p><a href="tel:${site.phoneHref}">${site.phone}</a></p></div>
          <div><span class="label">Site</span><p><a href="${site.url}">${site.url.replace("https://", "")}</a></p></div>
        </div>
        <ul class="profile-list">
          ${site.socials
            .map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a></li>`)
            .join("")}
        </ul>
      </div>
      <form id="contact-form" class="card form" action="https://formspree.io/f/mykdyalb" method="POST">
        <input type="hidden" name="_subject" value="New portfolio message from rivindu-ashinsa.github.io" />
        <input type="hidden" name="_captcha" value="false" />
        <label>Name<input type="text" name="name" required autocomplete="name" /></label>
        <label>Email<input type="email" name="email" required autocomplete="email" /></label>
        <label>Message<textarea name="message" rows="5" required></textarea></label>
        <button class="btn btn-solid" type="submit">Send message</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  `;

  const form = document.getElementById("contact-form");
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = new FormData(form);
    status.textContent = "Sending…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      });
      status.textContent = response.ok ? "Message sent." : "Something went wrong. Try again.";
      if (response.ok) form.reset();
    } catch {
      status.textContent = "Network error. Try again.";
    }
  });
}
