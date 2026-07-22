"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MediaFrame from "./MediaFrame";
import { CLIENT_STORIES } from "./storiesData";
import styles from "./Stories.module.css";

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// A static 3-up grid. On hover-capable desktops each card collapses its body to
// two lines (with a fade) and expands on hover/focus WITHOUT moving its
// neighbours: the card is absolutely positioned inside a cell whose height is
// locked to the card's resting height, so it grows downward over the row.
// The resting height can't be a CSS constant (the 4/3 image scales with the
// column), so we measure it. On touch / no-hover, cards are static with the full
// text always shown.
export default function Stories() {
  const rootRef = useRef(null);
  const [locked, setLocked] = useState(false);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = window.matchMedia("(hover: hover) and (min-width: 768px)");
    const cells = () => Array.from(root.querySelectorAll("[data-cell]"));

    const clear = () => {
      cells().forEach((cell) => {
        cell.style.height = "";
        const card = cell.querySelector("[data-card]");
        if (card) {
          card.style.removeProperty("--h-rest");
          card.style.removeProperty("--h-full");
        }
      });
      setLocked(false);
    };

    const measure = () => {
      if (!mq.matches) {
        clear();
        return;
      }
      cells().forEach((cell) => {
        const card = cell.querySelector("[data-card]");
        if (!card) return;
        // Neutralise any prior locking so we read natural heights.
        cell.style.height = "";
        card.style.maxHeight = "none";
        // Full height: body un-clamped.
        card.classList.add(styles.measuring);
        const full = card.offsetHeight;
        // Resting height: body clamped back to two lines.
        card.classList.remove(styles.measuring);
        const rest = card.offsetHeight;
        card.style.maxHeight = "";
        card.style.setProperty("--h-rest", `${rest}px`);
        card.style.setProperty("--h-full", `${full}px`);
        cell.style.height = `${rest}px`;
      });
      setLocked(true);
    };

    measure();
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

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
        </div>

        <div className={styles.grid}>
          {CLIENT_STORIES.map((s) => (
            <div key={s.id} className={styles.cell} data-cell>
              <article
                className={`card ${styles.card} ${locked ? styles.locked : ""}`}
                data-card
                tabIndex={locked ? 0 : undefined}
              >
                <div className={styles.media}>
                  <MediaFrame
                    src={s.image}
                    alt={s.alt}
                    ratio="4 / 3"
                    loading="lazy"
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                </div>
                <div className={styles.copy}>
                  <h3 className={styles.name}>{s.name}</h3>
                  <div className={styles.text}>
                    <p className={styles.body}>{s.body}</p>
                    <span className={styles.fade} aria-hidden="true" />
                  </div>
                  {s.quote && (
                    <p className={styles.quote}>&ldquo;{s.quote}&rdquo;</p>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
