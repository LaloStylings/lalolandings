"use client";

import { useEffect, useState } from "react";
import styles from "./Nav.module.css";

// Campaign nav: 4 links + 1 CTA. Every CTA points to #start (opens the modal).
const LINKS = [
  { href: "#what-we-create", label: "What We Create" },
  { href: "#process", label: "The Process" },
  { href: "#why-us", label: "Why Us" },
  { href: "#gallery", label: "Our Work" },
];

const HL = "/logotipos/lalostylings-hl.svg"; // extended
const LOGO = "/logotipos/lalostylings-logo.svg"; // compact

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
              className={styles.burger}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={styles.mobile}
          hidden={!open}
          onClick={() => setOpen(false)}
        >
          <nav className={styles.mobileLinks} aria-label="Mobile">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className={styles.mobileLink}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Sticky conversion CTA on mobile — opens the modal like every #start. */}
      <a href="#start" className={styles.stickyCta}>
        Start My Design · Free Consultation
      </a>
    </>
  );
}
