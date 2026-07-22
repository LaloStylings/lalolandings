"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MediaFrame from "./MediaFrame";
import { CLIENT_STORIES } from "./storiesData";
import styles from "./Stories.module.css";

const COUNT = CLIENT_STORIES.length;

// Two modes, no arbitration with Lenis:
// - Desktop (>=768px): the viewport has overflow hidden (no wheel scroll to
//   conflict with the page). The track moves via transform:translateX() driven
//   by the arrows/dots. Lenis owns vertical page scroll everywhere.
// - Mobile (<768px): native horizontal scroll + snap for swipe; the container
//   carries data-lenis-prevent-touch so Lenis leaves touch alone.
export default function Stories() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [translate, setTranslate] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const prefersReduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Desktop: measure step, clamp active to what's reachable, set the transform.
  const applyDesktop = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || track.children.length === 0) return;
    const cards = track.children;
    const step =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;
    const max = Math.max(0, track.scrollWidth - vp.clientWidth);
    const maxActive = step > 0 ? Math.round(max / step) : 0;
    const idx = Math.min(active, maxActive);
    setTranslate(Math.min(idx * step, max));
    setAtStart(idx <= 0);
    setAtEnd(idx >= maxActive);
    if (idx !== active) setActive(idx);
  }, [active]);

  // Mobile: native scroll position drives active + edge states.
  const readMobile = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || track.children.length === 0) return;
    const cards = track.children;
    const base = cards[0].offsetLeft;
    const left = vp.scrollLeft;
    let nearest = 0;
    let min = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const d = Math.abs(cards[i].offsetLeft - base - left);
      if (d < min) {
        min = d;
        nearest = i;
      }
    }
    setActive(nearest);
    setAtStart(left <= 2);
    setAtEnd(left >= vp.scrollWidth - vp.clientWidth - 2);
  }, []);

  useEffect(() => {
    if (isDesktop) applyDesktop();
    else readMobile();
    const onResize = () => (isDesktop ? applyDesktop() : readMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isDesktop, applyDesktop, readMobile]);

  // Mobile only: track native scroll.
  useEffect(() => {
    if (isDesktop) return;
    const vp = viewportRef.current;
    if (!vp) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(readMobile);
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      vp.removeEventListener("scroll", onScroll);
    };
  }, [isDesktop, readMobile]);

  const goTo = (i) => {
    const idx = Math.max(0, Math.min(i, COUNT - 1));
    if (isDesktop) {
      setActive(idx); // applyDesktop (effect) clamps + sets the transform
    } else {
      const vp = viewportRef.current;
      const track = trackRef.current;
      if (!vp || !track) return;
      const cards = track.children;
      const base = cards[0].offsetLeft;
      vp.scrollTo({
        left: cards[idx].offsetLeft - base,
        behavior: prefersReduced() ? "auto" : "smooth",
      });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  const trackStyle = isDesktop
    ? { transform: `translateX(-${translate}px)` }
    : undefined;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.headerRow}>
          <div className={`section-head ${styles.head}`}>
            <span className="chip">Client Stories</span>
            <h2 className="h2">The Rings Behind the Stories</h2>
            <p className="lede">
              Every piece we make starts with someone trying to say something they
              couldn&rsquo;t put into words.
            </p>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => goTo(active - 1)}
              disabled={atStart}
              aria-label="Previous stories"
            >
              <span className={styles.arrowIcon} data-dir="prev" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => goTo(active + 1)}
              disabled={atEnd}
              aria-label="Next stories"
            >
              <span className={styles.arrowIcon} data-dir="next" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={styles.viewport}
        ref={viewportRef}
        role="region"
        aria-label="Client stories"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        {...(!isDesktop ? { "data-lenis-prevent-touch": "" } : {})}
      >
        <div className={styles.track} ref={trackRef} style={trackStyle}>
          {CLIENT_STORIES.map((s) => (
            <div key={s.id} className={`card ${styles.story}`}>
              <div className={styles.media}>
                <MediaFrame
                  src={s.image}
                  alt={s.alt}
                  ratio="4 / 3"
                  loading="lazy"
                  sizes="(max-width: 720px) 88vw, (max-width: 1024px) 60vw, 46vw"
                />
              </div>
              <div className={styles.copy}>
                {s.pending && (
                  <span className={`chip ${styles.pendingChip}`}>
                    Pending: client to provide
                  </span>
                )}
                <h3 className={styles.name}>{s.name}</h3>
                <p className={styles.body}>{s.body}</p>
                <p className={styles.quote}>&ldquo;{s.quote}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className={styles.dots}>
          {CLIENT_STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
              aria-label={`Go to story ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
