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
const menuBtn = document.querySelector(".menu-btn");
const siteMenu = document.querySelector(".site-menu");
const menuLinks = document.querySelectorAll(".menu-link");

const closeMenu = () => {
	if (!menuBtn || !siteMenu) return;
	menuBtn.classList.remove("open");
	siteMenu.classList.remove("open");
	menuBtn.setAttribute("aria-expanded", "false");
};

if (menuBtn && siteMenu) {
	menuBtn.addEventListener("click", () => {
		const expanded = menuBtn.getAttribute("aria-expanded") === "true";
		menuBtn.setAttribute("aria-expanded", String(!expanded));
		menuBtn.classList.toggle("open");
		siteMenu.classList.toggle("open");
	});
}

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());

// Top bar background on scroll
const topbar = document.querySelector(".topbar");
const onScroll = () => topbar && topbar.classList.toggle("scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll);
onScroll();

// Active section highlighting
const sections = document.querySelectorAll("section[id]");
const setActiveLink = () => {
	const offset = (topbar?.offsetHeight || 0) + 8;
	const scrollPos = window.scrollY + offset;
	let activeId = "";

	sections.forEach((section) => {
		if (section.offsetTop <= scrollPos) {
			activeId = section.id;
		}
	});

	menuLinks.forEach((link) => {
		const isActive = link.getAttribute("href") === `#${activeId}`;
		link.classList.toggle("active", isActive);
	});
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("resize", setActiveLink);
setActiveLink();

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

document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

document.querySelectorAll("[data-stagger]").forEach((grid) => {
	[...grid.children].forEach((child, i) => {
		child.style.transitionDelay = `${i * 90}ms`;
		revealObserver.observe(child);
	});
});

// Project filters with smooth transitions
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".case-file");
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

// SDGP system screenshots carousel: show 3 at a time and slide left one-by-one.
const sdgpCarouselTrack = document.getElementById("sdgp-carousel-track");
if (sdgpCarouselTrack) {
	const visibleCount = window.matchMedia("(max-width: 768px)").matches ? 1 : window.matchMedia("(max-width: 1024px)").matches ? 2 : 3;
	const baseSlides = Array.from(sdgpCarouselTrack.children);
	if (baseSlides.length > visibleCount) {
		const clones = baseSlides.slice(0, visibleCount).map((slide) => slide.cloneNode(true));
		clones.forEach((clone) => sdgpCarouselTrack.appendChild(clone));

		let index = 0;
		let isAnimating = false;
		const intervalMs = 2600;

		const getStepSize = () => {
			const firstSlide = sdgpCarouselTrack.querySelector(".system-shot");
			if (!firstSlide) return 0;
			const slideWidth = firstSlide.getBoundingClientRect().width;
			const computedTrackStyle = window.getComputedStyle(sdgpCarouselTrack);
			const gap = parseFloat(computedTrackStyle.columnGap || computedTrackStyle.gap || "14");
			return slideWidth + gap;
		};

		window.setInterval(() => {
			if (isAnimating) return;
			isAnimating = true;
			index += 1;
			const stepSize = getStepSize();
			sdgpCarouselTrack.style.transform = `translateX(-${index * stepSize}px)`;

			window.setTimeout(() => {
				if (index >= baseSlides.length) {
					sdgpCarouselTrack.style.transition = "none";
					index = 0;
					sdgpCarouselTrack.style.transform = "translateX(0)";
					window.requestAnimationFrame(() => {
						sdgpCarouselTrack.style.transition = "transform 0.5s ease";
					});
				}
				isAnimating = false;
			}, 520);
		}, intervalMs);
	}
}

// Contact form validation
const form = document.getElementById("contact-form");
const statusEl = document.querySelector(".form-status");
if (form && statusEl) {
	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		event.stopPropagation();
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

		statusEl.textContent = "Sending...";
		formData.set("_replyto", email);
		const endpoint = form.dataset.endpoint || form.getAttribute("action");
		if (!endpoint) {
			statusEl.textContent = "Form endpoint is missing.";
			return;
		}
		try {
			const response = await fetch(endpoint, {
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" }
			});
			if (response.ok) {
				statusEl.textContent = "Message sent successfully.";
				form.reset();
			} else {
				statusEl.textContent = "Something went wrong. Please try again.";
			}
		} catch (error) {
			statusEl.textContent = "Network error. Please try again.";
		}
	});
}

// Back to top button
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
	backToTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
}