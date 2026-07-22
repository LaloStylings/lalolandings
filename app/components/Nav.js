"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "./lenisRef";
import styles from "./Nav.module.css";

// Campaign nav: 4 links + 1 CTA. Every CTA points to #start (opens the modal).
const LINKS = [
  { href: "#what-we-create", label: "What We Create" },
  { href: "#process", label: "The Process" },
  { href: "#why-us", label: "Why Us" },
  { href: "#gallery", label: "Our Work" },
];

const SOCIAL = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/lalostylings/",
    icon: InstagramIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@lalostylings",
    icon: TikTokIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/Lalo-Stylings/61556900092660/",
    icon: FacebookIcon,
  },
];

const HL = "/logotipos/lalostylings-hl.svg"; // extended
const LOGO = "/logotipos/lalostylings-logo.svg"; // compact

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const burgerRef = useRef(null);
  const overlayRef = useRef(null);

  const closeMenu = () => {
    setOpen(false);
    requestAnimationFrame(() => burgerRef.current?.focus());
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sticky mobile CTA appears only AFTER the hero leaves the viewport (so it
  // never duplicates the hero's own button on the first screen).
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Lock body scroll + pause Lenis while the overlay is open. When closing,
  // don't release the lock if the quote modal has meanwhile taken it over.
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else if (!document.querySelector("dialog[open]")) {
      document.body.style.overflow = "";
      lenis?.start();
    }
  }, [open]);

  // Focus management + trap + ESC while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const focusables = () =>
      Array.from(
        overlay.querySelectorAll('a[href], button:not([disabled])')
      );

    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Section link: close the overlay, then smooth-scroll to the target (after the
  // scroll lock is released on the next frames).
  const onNavLink = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    const lenis = getLenis();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -90 });
        else el.scrollIntoView({ behavior: "smooth" });
      })
    );
  };

  // CTA: just close the overlay. The global #start handler (QuoteBuilder) opens
  // the modal in the capture phase and keeps the scroll lock.
  const onCta = () => setOpen(false);

  return (
    <>
      <header
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${
          open ? styles.menuOpen : ""
        }`}
      >
        {/* Expanded — desktop, at the top of the page (two centered lines). */}
        <div
          className={`${styles.layer} ${styles.expanded} ${
            !scrolled ? styles.on : ""
          }`}
        >
          <div className={styles.expandedInner}>
            <a href="#top" className={styles.logoLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HL}
                alt="Lalo Stylings"
                width={1494}
                height={192}
                className={styles.logoExpanded}
              />
            </a>
            <span className={styles.divider} aria-hidden="true" />
            <nav className={styles.expandedLinks} aria-label="Primary">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a href="#start" className={`btn btn--on-green ${styles.expandedCta}`}>
              Start My Design
            </a>
          </div>
        </div>

        {/* Compact — mobile always, and desktop once scrolled (single line). */}
        <div
          className={`${styles.layer} ${styles.compact} ${
            scrolled ? styles.on : ""
          }`}
        >
          <div className={styles.compactInner}>
            <a href="#top" className={styles.logoLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO}
                alt="Lalo Stylings"
                width={1809}
                height={793}
                className={styles.logoCompact}
              />
            </a>
            <nav className={styles.compactLinks} aria-label="Primary">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a href="#start" className={`btn btn--primary ${styles.compactCta}`}>
              Start My Design
            </a>
            <button
              type="button"
              ref={burgerRef}
              className={styles.burger}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile / tablet overlay menu (<900px). */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open || undefined}
      >
        <div className={styles.overlayHeader}>
          <a href="#top" className={styles.logoLink} onClick={(e) => onNavLink(e, "#top")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO}
              alt="Lalo Stylings"
              width={1809}
              height={793}
              className={styles.overlayLogo}
            />
          </a>
          <button
            type="button"
            className={styles.overlayClose}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <span className={styles.overlayCloseIcon} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.overlayMain}>
          <nav className={styles.overlayLinks} aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={styles.overlayLink}
                onClick={(e) => onNavLink(e, l.href)}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span className={styles.overlayDivider} aria-hidden="true" />
          <a
            href="#start"
            className={`btn btn--on-green ${styles.overlayCta}`}
            onClick={onCta}
          >
            Start My Design
          </a>
        </div>

        <div className={styles.overlayFoot}>
          <a href="tel:+12134313250" className={styles.overlayPhone}>
            (213) 431-3250
          </a>
          <div className={styles.overlaySocials}>
            {SOCIAL.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  className={styles.overlaySocial}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Lalo Stylings on ${s.name}`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky conversion CTA — only after the hero has scrolled away. */}
      <a
        href="#start"
        className={`${styles.stickyCta} ${
          pastHero && !open ? styles.stickyOn : ""
        }`}
      >
        Start My Design · Free Consultation
      </a>
    </>
  );
}

/* --- Inline social icons (currentColor, no external assets) --- */
function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.2 3.5v9.9a2.9 2.9 0 1 1-2.4-2.85"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.2 3.5c.4 2.3 1.9 3.9 4.3 4.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8.2h1.9V5.4c-.33-.05-1.46-.15-2.77-.15-2.74 0-4.62 1.68-4.62 4.77v2.32H6.3v3.13h2.7V22h3.3v-6.7h2.6l.41-3.13h-3.01V10.3c0-.9.25-1.52 1.7-1.52Z"
        fill="currentColor"
      />
    </svg>
  );
}
