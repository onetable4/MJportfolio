const works = [
  ["public/images/01-stillness.jpg", "Between Red Rocks", "Nevada · 2024"],
  ["public/images/02-dunes.jpg", "Distant Blue", "Blue Ridge · 2023"],
  ["public/images/03-city.jpg", "After Midnight", "Melbourne · 2024"],
  ["public/images/04-geometry.jpg", "The Space Between", "Beijing · 2023"],
  ["public/images/05-portrait.jpg", "Summer, Almost", "Editorial · 2024"],
  ["public/images/06-mountain.jpg", "North of Here", "Alaska · 2022"],
  ["public/images/07-house.jpg", "White Volume", "Cleveland · 2023"],
  ["public/images/08-portrait.jpg", "In Good Light", "Portrait · 2024"],
];

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("figure img");
const lightboxTitle = lightbox.querySelector("figcaption span:first-child");
const lightboxCount = lightbox.querySelector("figcaption span:last-child");
let activeIndex = 0;

function renderLightbox() {
  const [src, title, meta] = works[activeIndex];
  lightboxImage.src = src;
  lightboxImage.alt = `${title}, ${meta}`;
  lightboxTitle.textContent = title;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  activeIndex = index;
  renderLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

function moveLightbox(direction) {
  activeIndex = (activeIndex + direction + works.length) % works.length;
  renderLightbox();
}

document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("click", () => openLightbox(Number(card.dataset.index)));
});

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".prev").addEventListener("click", () => moveLightbox(-1));
lightbox.querySelector(".next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("mousedown", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
