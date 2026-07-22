"use client";

import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

/**
 * Hero background media.
 *
 * The poster image is the LCP: it renders on the server for everyone, so the
 * hero paints instantly regardless of the video. The <video> is only mounted,
 * client-side, on larger screens with motion allowed — never downloaded on
 * mobile (data/battery/autoplay) or under prefers-reduced-motion. It also keeps
 * preload="metadata" (not "auto") so the poster leads and the video trickles in.
 */
export default function HeroMedia({ poster }) {
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!small && !reduced) setUseVideo(true);
  }, []);

  if (useVideo) {
    return (
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/background-hero.mp4" type="video/mp4" />
      </video>
    );
  }

  return (
    <div
      className={styles.poster}
      style={{ backgroundImage: `url(${poster})` }}
      aria-hidden="true"
    />
  );
}
