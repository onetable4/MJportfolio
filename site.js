const fallbackWorks = [
  { image: "/images/01-stillness.jpg", title: "Between Red Rocks", location: "Nevada", year: 2024, alt: "붉은 바위 사이에 선 인물", layout: "portrait" },
  { image: "/images/02-dunes.jpg", title: "Distant Blue", location: "Blue Ridge", year: 2023, alt: "푸른 산맥과 모래 언덕", layout: "portrait" },
  { image: "/images/03-city.jpg", title: "After Midnight", location: "Melbourne", year: 2024, alt: "한밤의 도시 풍경", layout: "wide" },
  { image: "/images/04-geometry.jpg", title: "The Space Between", location: "Beijing", year: 2023, alt: "기하학적 건축 공간", layout: "portrait" },
  { image: "/images/05-portrait.jpg", title: "Summer, Almost", location: "Editorial", year: 2024, alt: "여름빛 속 인물 사진", layout: "portrait" },
  { image: "/images/06-mountain.jpg", title: "North of Here", location: "Alaska", year: 2022, alt: "알래스카의 설산 풍경", layout: "wide" },
  { image: "/images/07-house.jpg", title: "White Volume", location: "Cleveland", year: 2023, alt: "흰색 건축물의 외관", layout: "landscape" },
  { image: "/images/08-portrait.jpg", title: "In Good Light", location: "Portrait", year: 2024, alt: "부드러운 자연광 속 인물", layout: "landscape" },
];

let works = fallbackWorks;
let activeIndex = 0;

const gallery = document.querySelector("#gallery");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("figure img");
const lightboxTitle = lightbox.querySelector("figcaption span:first-child");
const lightboxCount = lightbox.querySelector("figcaption span:last-child");

function imagePath(path) {
  return path.startsWith("/images/") ? `public${path}` : path;
}

function responsiveSizes(work, lightboxView = false) {
  if (lightboxView) return "96vw";
  return work.layout === "wide" ? "(max-width: 700px) 90vw, 92vw" : "(max-width: 700px) 86vw, 45vw";
}

function applyResponsiveSource(image, work, lightboxView = false) {
  image.src = imagePath(work.image);
  image.sizes = responsiveSizes(work, lightboxView);

  if (Array.isArray(work.variants) && work.variants.length > 0) {
    image.srcset = work.variants
      .map((variant) => `${imagePath(variant.src)} ${variant.width}w`)
      .join(", ");
  } else {
    image.removeAttribute("srcset");
  }
}

function text(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderSite(site) {
  document.title = `${site.name} — Photographer`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", site.metaDescription);
  document.querySelector("#wordmark").firstChild.textContent = site.wordmark;
  document.querySelector("#wordmark").setAttribute("aria-label", `${site.name} 포트폴리오 홈`);
  text("#eyebrow", site.eyebrow);
  text("#hero-title-line-1", site.heroTitleLine1);
  text("#hero-title-line-2", site.heroTitleLine2);
  text("#hero-intro", site.heroIntro);
  text("#work-heading-line-1", site.workHeadingLine1);
  text("#work-heading-line-2", site.workHeadingLine2);
  text("#about-heading-line-1", site.aboutHeadingLine1);
  text("#about-heading-line-2", site.aboutHeadingLine2);
  text("#about-heading-line-3", site.aboutHeadingLine3);
  text("#about-description", site.aboutDescription);
  text("#services", site.services);
  text("#contact-line-1", site.contactLine1);
  text("#contact-line-2", site.contactLine2);
  text("#footer-location", site.location);
  text("#footer-availability", site.availability);
  text("#copyright", `© ${new Date().getFullYear()} ${site.name}`);

  document.querySelector("#instagram-link").href = site.instagram;
  document.querySelectorAll("[data-email-link]").forEach((link) => {
    link.href = `mailto:${site.email}`;
  });
}

function renderGallery() {
  gallery.replaceChildren();

  works.forEach((work, index) => {
    const button = document.createElement("button");
    const shape = work.layout === "wide" ? "landscape wide" : work.layout;
    button.className = `work-card ${shape}`;
    button.type = "button";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `${work.title} 크게 보기`);

    const frame = document.createElement("span");
    frame.className = "image-frame";
    const image = document.createElement("img");
    applyResponsiveSource(image, work);
    image.alt = work.alt;
    image.loading = index < 2 ? "eager" : "lazy";
    const hint = document.createElement("span");
    hint.className = "view-hint";
    hint.textContent = "View";
    frame.append(image, hint);

    const caption = document.createElement("span");
    caption.className = "caption";
    const title = document.createElement("span");
    title.textContent = work.title;
    const meta = document.createElement("span");
    meta.textContent = `${work.location} · ${work.year}`;
    caption.append(title, meta);
    button.append(frame, caption);
    gallery.append(button);
  });
}

function renderLightbox() {
  const work = works[activeIndex];
  applyResponsiveSource(lightboxImage, work, true);
  lightboxImage.alt = work.alt;
  lightboxTitle.textContent = work.title;
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

gallery.addEventListener("click", (event) => {
  const card = event.target.closest(".work-card");
  if (card) openLightbox(Number(card.dataset.index));
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

async function loadContent() {
  try {
    const [siteResponse, worksResponse] = await Promise.all([
      fetch("content/site.json"),
      fetch("content/works.json"),
    ]);
    if (!siteResponse.ok || !worksResponse.ok) throw new Error("콘텐츠 파일을 불러오지 못했습니다.");

    const [site, workData] = await Promise.all([siteResponse.json(), worksResponse.json()]);
    works = workData.works.filter((work) => work.published);
    renderSite(site);
    renderGallery();
  } catch (error) {
    console.warn("기본 포트폴리오 콘텐츠를 표시합니다.", error);
  }
}

loadContent();
