"use client";

import { useEffect } from "react";
import { setLenis } from "./lenisRef";

/**
 * Momentum smooth scroll via Lenis, mounted once around the whole page.
 *
 * - Reduced motion: Lenis is never initialized (and never even downloaded) —
 *   native scroll only.
 * - Same-page hash links (#start, #top, …) route through lenis.scrollTo so the
 *   library and the browser don't fight over the scroll position.
 * - Lenis is dynamically imported so it stays out of the initial bundle.
 * - The instance is destroyed on unmount; no listeners left hanging.
 *
 * Children are passed straight through (Server Components stay server-rendered).
 * Lenis v1 smooths native window scroll — it does not transform the page — so
 * position:fixed elements (the mobile sticky CTA) and IntersectionObserver
 * (scroll reveal) keep working unchanged. Touch scroll stays native by default.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // respect the user's preference — no Lenis at all
    }

    let lenis;
    let onClick;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.1,
        // Gentle exponential ease-out — smooth without feeling heavy.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: true, // Lenis runs its own RAF loop; destroy() stops it
      });
      // Expose for components that must pause/resume it (the quote modal).
      setLenis(lenis);

      onClick = (e) => {
        // Let modified clicks / non-primary buttons behave natively.
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }
        const anchor = e.target.closest?.('a[href^="#"]');
        if (!anchor) return;

        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = hash === "#top" ? 0 : document.querySelector(hash);
        if (target === null) return; // unknown target → let the browser handle it

        e.preventDefault();
        lenis.scrollTo(target);
        history.pushState(null, "", hash);
      };

      document.addEventListener("click", onClick);
    });

    return () => {
      cancelled = true;
      if (onClick) document.removeEventListener("click", onClick);
      if (lenis) lenis.destroy();
      setLenis(null);
    };
  }, []);

  return children;
}
