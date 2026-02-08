"use strict";

// Typing effect (hero)
const texts = [
	"Computer Science undergraduate focused on data cleaning, analysis, and visualization."
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function type() {
	if (!typingElement) return;
	if (prefersReducedMotion) {
		typingElement.textContent = texts[0];
		return;
	}
	const currentText = texts[textIndex];

	if (isDeleting) {
		typingElement.textContent = currentText.substring(0, charIndex - 1);
		charIndex--;
	} else {
		typingElement.textContent = currentText.substring(0, charIndex + 1);
		charIndex++;
	}

	if (!isDeleting && charIndex === currentText.length) {
		isDeleting = true;
		setTimeout(type, 1800);
		return;
	}

	if (isDeleting && charIndex === 0) {
		isDeleting = false;
		textIndex = (textIndex + 1) % texts.length;
	}

	const typingSpeed = isDeleting ? 45 : 85;
	setTimeout(type, typingSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
	if (!typingElement) return;
	setTimeout(type, 600);
});