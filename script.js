"use strict";

document.body.classList.add("js");

// Smooth scroll polyfill for older browsers
if (!("scrollBehavior" in document.documentElement.style)) {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", (event) => {
			const target = document.querySelector(anchor.getAttribute("href"));
			if (!target) return;
			event.preventDefault();
			target.scrollIntoView({ behavior: "smooth" });
		});
	});
}

// Mobile navigation toggle + accessibility
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

const closeMenu = () => {
	if (!navToggle || !navMenu) return;
	navToggle.classList.remove("open");
	navMenu.classList.remove("open");
	navToggle.setAttribute("aria-expanded", "false");
};

if (navToggle && navMenu) {
	navToggle.addEventListener("click", () => {
		const expanded = navToggle.getAttribute("aria-expanded") === "true";
		navToggle.setAttribute("aria-expanded", String(!expanded));
		navToggle.classList.toggle("open");
		navMenu.classList.toggle("open");
	});
}

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());

// Navbar blur on scroll
const navbar = document.querySelector(".navbar");
const onScroll = () => navbar && navbar.classList.toggle("scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll);
onScroll();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Active section highlighting
const sections = document.querySelectorAll("section");
const sectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			navLinks.forEach((link) => {
				const isActive = link.getAttribute("href") === `#${entry.target.id}`;
				link.classList.toggle("active", isActive);
			});
		});
	},
	{ threshold: 0.6 }
);
sections.forEach((section) => sectionObserver.observe(section));

// Reveal on scroll + staggered cards
const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add("visible");
		});
	},
	{ threshold: 0.2 }
);

document.querySelectorAll(".reveal, [data-animate]").forEach((el) => revealObserver.observe(el));

document.querySelectorAll("[data-stagger]").forEach((grid) => {
	[...grid.children].forEach((child, i) => {
		child.style.transitionDelay = `${i * 90}ms`;
		revealObserver.observe(child);
	});
});

// Project filters with smooth transitions
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		filterButtons.forEach((b) => {
			b.classList.remove("active");
			b.setAttribute("aria-selected", "false");
		});
		btn.classList.add("active");
		btn.setAttribute("aria-selected", "true");

		const filter = btn.dataset.filter;
		projectCards.forEach((card) => {
			const match = filter === "all" || card.dataset.category === filter;
			card.classList.toggle("hidden", !match);
			card.style.display = match ? "" : "none";
			card.setAttribute("aria-hidden", String(!match));
		});
	});
});

// Contact form validation
const form = document.getElementById("contact-form");
const statusEl = document.querySelector(".form-status");
form.addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const name = String(formData.get("name") || "").trim();
	const email = String(formData.get("email") || "").trim();
	const message = String(formData.get("message") || "").trim();

	if (!name || !email || !message) {
		statusEl.textContent = "Please fill in all fields.";
		return;
	}
	if (!/^\S+@\S+\.\S+$/.test(email)) {
		statusEl.textContent = "Please enter a valid email.";
		return;
	}

	statusEl.textContent = "Message sent successfully (demo).";
	form.reset();
});

// Back to top button
document.querySelector(".back-to-top").addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
});

// Subtle hero parallax
const heroVisual = document.querySelector(".hero-visual");
if (heroVisual) {
	window.addEventListener("scroll", () => {
		const offset = Math.min(window.scrollY * 0.15, 40);
		heroVisual.style.transform = `translateY(${offset}px)`;
	});
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
