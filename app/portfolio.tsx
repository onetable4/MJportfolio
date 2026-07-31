"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const works = [
  {
    src: "/images/01-stillness.jpg",
    title: "Between Red Rocks",
    meta: "Nevada · 2024",
    shape: "portrait",
    width: 1800,
    height: 2700,
  },
  {
    src: "/images/02-dunes.jpg",
    title: "Distant Blue",
    meta: "Blue Ridge · 2023",
    shape: "portrait",
    width: 1800,
    height: 2700,
  },
  {
    src: "/images/03-city.jpg",
    title: "After Midnight",
    meta: "Melbourne · 2024",
    shape: "landscape wide",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/04-geometry.jpg",
    title: "The Space Between",
    meta: "Beijing · 2023",
    shape: "portrait",
    width: 1800,
    height: 2297,
  },
  {
    src: "/images/05-portrait.jpg",
    title: "Summer, Almost",
    meta: "Editorial · 2024",
    shape: "portrait",
    width: 1800,
    height: 2700,
  },
  {
    src: "/images/06-mountain.jpg",
    title: "North of Here",
    meta: "Alaska · 2022",
    shape: "landscape wide",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/07-house.jpg",
    title: "White Volume",
    meta: "Cleveland · 2023",
    shape: "landscape",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/08-portrait.jpg",
    title: "In Good Light",
    meta: "Portrait · 2024",
    shape: "landscape",
    width: 1800,
    height: 1232,
  },
];

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
        <a className="wordmark" href="#top" aria-label="한지호 포트폴리오 홈">
          JH<span>®</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <p className="eyebrow">Photographer · Seoul / Everywhere</p>
        <h1 id="hero-title">
          <span>JIHO</span>
          <span className="outline">HAN</span>
        </h1>
        <div className="hero-bottom">
          <p>사람과 장소 사이에 잠시 머무는 빛을 기록합니다.</p>
          <a href="#work" className="scroll-cue">
            Selected works <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p>01 / Selected work</p>
          <h2 id="work-title">빛, 공간, 그리고<br />그 사이의 사람들.</h2>
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
                  alt={`${work.title}, ${work.meta}`}
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
          <h2 id="about-title">관찰하고,<br />기다리고,<br /><em>기억합니다.</em></h2>
          <div>
            <p>
              서울을 기반으로 활동하는 포토그래퍼 한지호입니다. 인물과 공간이 서로의
              표정을 바꾸는 순간에 관심을 두고, 절제된 색과 자연광으로 오래 남는 장면을 만듭니다.
            </p>
            <p className="services">Portrait · Editorial · Travel · Architecture</p>
          </div>
        </div>
      </section>

      <footer id="contact">
        <p className="section-kicker">03 / Contact</p>
        <a className="contact-link" href="mailto:hello@jihohan.photo">
          Let&apos;s make<br />something <em>lasting.</em>
          <span aria-hidden="true">↗</span>
        </a>
        <div className="footer-meta">
          <p>Seoul, Korea<br />Available worldwide</p>
          <div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="mailto:hello@jihohan.photo">Email ↗</a>
          </div>
          <p>© {new Date().getFullYear()} Jiho Han</p>
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
            <Image
              src={works[active].src}
              alt={`${works[active].title}, ${works[active].meta}`}
              width={works[active].width}
              height={works[active].height}
              unoptimized
              sizes="96vw"
              priority
            />
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
