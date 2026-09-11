export function initTheme() {
  const stored = localStorage.getItem("atlas-theme");
  if (stored) document.documentElement.setAttribute("data-theme", stored);

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    if (!toggle) return;
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("atlas-theme", next);
  });
}

export function initNav() {
  const rail = document.getElementById("rail");
  const toggle = () => {
    const btn = document.querySelector(".nav-toggle");
    const open = rail.classList.toggle("open");
    document.body.classList.toggle("rail-open", open);
    if (btn) btn.setAttribute("aria-expanded", String(open));
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-toggle")) toggle();
    if (event.target === document.body && document.body.classList.contains("rail-open")) {
      rail.classList.remove("open");
      document.body.classList.remove("rail-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && rail.classList.contains("open")) {
      rail.classList.remove("open");
      document.body.classList.remove("rail-open");
    }
  });

  rail.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      rail.classList.remove("open");
      document.body.classList.remove("rail-open");
    }
  });
}

export function initReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  nodes.forEach((node) => observer.observe(node));
}
