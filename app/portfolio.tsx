"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import site from "../content/site.json";
import workData from "../content/works.json";

const works = workData.works
  .filter((work) => work.published)
  .map((work) => ({
    ...work,
    src: work.image,
    meta: `${work.location} · ${work.year}`,
    shape: work.layout === "wide" ? "landscape wide" : work.layout,
  }));

export function Portfolio() {
  const [active, setActive] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setActive(null), []);
  const move = useCallback((direction: number) => {
    setActive((current) => {
      if (current === null) return null;
      return (current + direction + works.length) % works.length;
    });
  }, []);

  useEffect(() => {
    if (active === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, closeLightbox, move]);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${site.name} 포트폴리오 홈`}>
          {site.wordmark}<span>®</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <p className="eyebrow">{site.eyebrow}</p>
        <h1 id="hero-title">
          <span>{site.heroTitleLine1}</span>
          <span className="outline">{site.heroTitleLine2}</span>
        </h1>
        <div className="hero-bottom">
          <p>{site.heroIntro}</p>
          <a href="#work" className="scroll-cue">
            Selected works <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p>01 / Selected work</p>
          <h2 id="work-title">{site.workHeadingLine1}<br />{site.workHeadingLine2}</h2>
        </div>

        <div className="gallery">
          {works.map((work, index) => (
            <button
              className={`work-card ${work.shape}`}
              key={work.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${work.title} 크게 보기`}
            >
              <span className="image-frame">
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  unoptimized
                  sizes={work.shape.includes("wide") ? "(max-width: 700px) 100vw, 92vw" : "(max-width: 700px) 100vw, 45vw"}
                  priority={index === 0}
                />
                <span className="view-hint">View</span>
              </span>
              <span className="caption">
                <span>{work.title}</span>
                <span>{work.meta}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="section-kicker">02 / About</div>
        <div className="about-copy">
          <h2 id="about-title">
            {site.aboutHeadingLine1}<br />
            {site.aboutHeadingLine2}<br />
            <em>{site.aboutHeadingLine3}</em>
          </h2>
          <div>
            <p>{site.aboutDescription}</p>
            <p className="services">{site.services}</p>
          </div>
        </div>
      </section>

      <footer id="contact">
        <p className="section-kicker">03 / Contact</p>
        <a className="contact-link" href={`mailto:${site.email}`}>
          {site.contactLine1}<br /><em>{site.contactLine2}</em>
          <span aria-hidden="true">↗</span>
        </a>
        <div className="footer-meta">
          <p>{site.location}<br />{site.availability}</p>
          <div>
            <a href={site.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={`mailto:${site.email}`}>Email ↗</a>
          </div>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </footer>

      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${works[active].title} 확대 이미지`}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeLightbox();
          }}
        >
          <button className="lightbox-close" type="button" onClick={closeLightbox} aria-label="닫기">
            <span aria-hidden="true">×</span>
          </button>
          <button className="lightbox-nav prev" type="button" onClick={() => move(-1)} aria-label="이전 사진">
            <span aria-hidden="true">←</span>
          </button>
          <figure>
            <span className="lightbox-image">
              <Image
                src={works[active].src}
                alt={works[active].alt}
                fill
                unoptimized
                sizes="96vw"
                priority
              />
            </span>
            <figcaption>
              <span>{works[active].title}</span>
              <span>{String(active + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}</span>
            </figcaption>
          </figure>
          <button className="lightbox-nav next" type="button" onClick={() => move(1)} aria-label="다음 사진">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </main>
  );
}
